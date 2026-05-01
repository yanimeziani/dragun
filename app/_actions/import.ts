"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { createClient } from "../_lib/supabase/server";
import { scheduleCampaign } from "../_lib/cadence";
import { isLocale } from "../_lib/i18n";

export type ImportRowPreview = {
  row: number;
  ok: boolean;
  reason?: string;
  name?: string;
  email?: string;
  phone?: string;
  amount?: number;
  currency?: string;
  description?: string;
  locale?: "fr" | "en" | null;
};

export type ImportState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | {
      status: "preview";
      total: number;
      valid: number;
      invalid: number;
      rows: ImportRowPreview[];
      headers: string[];
      missingColumns: string[];
    }
  | {
      status: "done";
      created: number;
      failed: number;
      errors: { row: number; reason: string }[];
    };

const E164_RE = /^\+[1-9]\d{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_CURRENCIES = ["CAD", "USD", "EUR"] as const;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_ROWS = 10_000;
const PREVIEW_ROWS = 30;

const HEADER_ALIASES: Record<string, string> = {
  // → name
  name: "name",
  fullname: "name",
  "full_name": "name",
  "full name": "name",
  customer: "name",
  "customer_name": "name",
  "customer name": "name",
  debtor: "name",
  "debtor_name": "name",
  "debtor name": "name",
  client: "name",
  "client_name": "name",
  "client name": "name",
  member: "name",
  membre: "name",
  nom: "name",
  // → email
  email: "email",
  "e-mail": "email",
  e_mail: "email",
  "email_address": "email",
  "email address": "email",
  mail: "email",
  courriel: "email",
  // → phone
  phone: "phone",
  tel: "phone",
  telephone: "phone",
  "phone_number": "phone",
  "phone number": "phone",
  mobile: "phone",
  cell: "phone",
  cellphone: "phone",
  "téléphone": "phone",
  // → amount
  amount: "amount",
  due: "amount",
  balance: "amount",
  "balance_due": "amount",
  "balance due": "amount",
  total: "amount",
  owed: "amount",
  montant: "amount",
  solde: "amount",
  // → currency
  currency: "currency",
  ccy: "currency",
  devise: "currency",
  // → description
  description: "description",
  memo: "description",
  note: "description",
  notes: "description",
  item: "description",
  invoice: "description",
  "invoice_description": "description",
  reason: "description",
  motif: "description",
  // → locale
  locale: "locale",
  language: "locale",
  lang: "locale",
  langue: "locale",
};

const REQUIRED_CANONICAL = ["name", "amount"] as const;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const stripped = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const rawLines = stripped.split("\n");
  const lines: string[] = [];
  for (const l of rawLines) {
    if (l.trim() === "") continue;
    lines.push(l);
  }
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
}

function resolveColumns(rawHeaders: string[]): {
  canonical: Record<string, number>;
  missing: string[];
} {
  const canonical: Record<string, number> = {};
  rawHeaders.forEach((raw, idx) => {
    const key = raw.replace(/\s+/g, " ").trim();
    const target = HEADER_ALIASES[key];
    if (target && canonical[target] === undefined) {
      canonical[target] = idx;
    }
  });
  const missing = REQUIRED_CANONICAL.filter(
    (c) => canonical[c] === undefined,
  );
  return { canonical, missing };
}

function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  let s = raw.trim();
  if (!s) return null;
  // strip everything except digits and a leading +
  const hasLeadingPlus = s.startsWith("+");
  s = s.replace(/[^\d]/g, "");
  if (hasLeadingPlus) s = "+" + s;
  if (s.startsWith("+")) {
    return E164_RE.test(s) ? s : null;
  }
  // No country code — assume North America for 10 or 11-digit
  if (s.length === 10) return `+1${s}`;
  if (s.length === 11 && s.startsWith("1")) return `+${s}`;
  return null;
}

function normalizeAmount(raw: string): number | null {
  if (!raw) return null;
  let s = raw.trim().replace(/[^\d,.\-]/g, "");
  if (!s) return null;
  // Both . and , present: . decimal, , thousands
  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/,/g, "");
  } else if (s.includes(",") && !s.includes(".")) {
    // FR-style decimal comma
    s = s.replace(",", ".");
  }
  const n = Number(s);
  if (!isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

function normalizeCurrency(raw: string): string | null {
  const s = raw.trim().toUpperCase();
  if (!s) return "CAD";
  if ((ALLOWED_CURRENCIES as readonly string[]).includes(s)) return s;
  return null;
}

function paylinkSlug(): string {
  return randomBytes(6).toString("base64url");
}

function autoRef(i: number): string {
  return `DR-${Date.now().toString(36).toUpperCase().slice(-5)}-${String(
    i + 1,
  ).padStart(3, "0")}`;
}

function validateRow(
  row: string[],
  canonical: Record<string, number>,
  rowNum: number,
): ImportRowPreview {
  const cell = (k: number | undefined) =>
    k !== undefined && k < row.length ? row[k].trim() : "";
  const name = cell(canonical.name);
  const email = cell(canonical.email);
  const phoneRaw = cell(canonical.phone);
  const amountRaw = cell(canonical.amount);
  const currencyRaw = cell(canonical.currency);
  const description = cell(canonical.description);
  const localeRaw = cell(canonical.locale).toLowerCase();

  if (!name) {
    return { row: rowNum, ok: false, reason: "Missing name" };
  }
  if (email && !EMAIL_RE.test(email)) {
    return {
      row: rowNum,
      ok: false,
      reason: `Invalid email: ${email}`,
      name,
    };
  }
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (phoneRaw && !phone) {
    return {
      row: rowNum,
      ok: false,
      reason: `Phone could not be normalized to E.164: ${phoneRaw}`,
      name,
    };
  }
  const amount = normalizeAmount(amountRaw);
  if (amount === null) {
    return {
      row: rowNum,
      ok: false,
      reason: `Amount must be > 0 (got: ${amountRaw || "empty"})`,
      name,
    };
  }
  const currency = normalizeCurrency(currencyRaw);
  if (currency === null) {
    return {
      row: rowNum,
      ok: false,
      reason: `Unsupported currency: ${currencyRaw}`,
      name,
    };
  }
  const locale = isLocale(localeRaw) ? localeRaw : null;

  return {
    row: rowNum,
    ok: true,
    name,
    email: email || undefined,
    phone: phone ?? undefined,
    amount,
    currency,
    description: description || undefined,
    locale,
  };
}

export async function importCasesAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const file = formData.get("csv");
  const mode = String(formData.get("action") ?? "preview").toLowerCase();

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", error: "Choose a CSV file." };
  }
  if (file.size > MAX_BYTES) {
    return {
      status: "error",
      error: `CSV too large (max ${Math.floor(MAX_BYTES / 1024 / 1024)} MB).`,
    };
  }

  const text = await file.text();
  const { headers, rows } = parseCsv(text);
  if (rows.length > MAX_ROWS) {
    return {
      status: "error",
      error: `CSV has ${rows.length} rows; max is ${MAX_ROWS}. Split the file and import in batches.`,
    };
  }

  const { canonical, missing } = resolveColumns(headers);
  if (missing.length > 0) {
    return {
      status: "error",
      error: `CSV is missing required columns: ${missing.join(", ")}. Header must include name and amount (or one of their aliases — see the sample CSV).`,
    };
  }

  const validated = rows.map((r, i) => validateRow(r, canonical, i + 2));
  const valid = validated.filter((v) => v.ok).length;
  const invalid = validated.length - valid;

  if (mode === "preview") {
    return {
      status: "preview",
      total: validated.length,
      valid,
      invalid,
      rows: validated.slice(0, PREVIEW_ROWS),
      headers,
      missingColumns: [],
    };
  }

  // Commit path
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", error: "Not authenticated." };
  }
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return { status: "error", error: "Organization not found." };
  }

  let created = 0;
  let failed = 0;
  const errors: { row: number; reason: string }[] = [];

  for (const v of validated) {
    if (!v.ok) {
      failed++;
      errors.push({ row: v.row, reason: v.reason ?? "invalid" });
      continue;
    }
    try {
      const { data: caseRow, error: e1 } = await supabase
        .from("cases")
        .insert({
          org_id: membership.org_id,
          ref: autoRef(v.row - 2),
          amount_cents: Math.round((v.amount as number) * 100),
          currency: v.currency!,
          description: v.description || null,
          paylink_slug: paylinkSlug(),
        })
        .select("id, opened_at")
        .single();
      if (e1 || !caseRow) throw new Error(e1?.message ?? "case insert failed");
      const { error: e2 } = await supabase.from("debtors").insert({
        case_id: caseRow.id,
        full_name: v.name!,
        email: v.email || null,
        phone_e164: v.phone || null,
        locale: v.locale ?? null,
      });
      if (e2) throw new Error(e2.message);
      await scheduleCampaign(supabase, caseRow.id, new Date(caseRow.opened_at));
      created++;
    } catch (err) {
      failed++;
      errors.push({ row: v.row, reason: String(err) });
    }
  }

  revalidatePath("/app");
  return {
    status: "done",
    created,
    failed,
    errors: errors.slice(0, 50),
  };
}
