"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { createClient } from "../_lib/supabase/server";
import { scheduleCampaign } from "../_lib/cadence";
import { isLocale } from "../_lib/i18n";

export type ImportState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | {
      status: "done";
      created: number;
      failed: number;
      errors: { row: number; reason: string }[];
    };

const E164_RE = /^\+[1-9]\d{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_COLS = ["name", "amount"] as const;
const ALLOWED_CURRENCIES = ["CAD", "USD", "EUR"] as const;

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((l) => l.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };
  const split = (line: string) => line.split(",").map((c) => c.trim());
  const headers = split(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).map(split);
  return { headers, rows };
}

function paylinkSlug(): string {
  return randomBytes(6).toString("base64url");
}

function autoRef(i: number): string {
  return `DR-${Date.now().toString(36).toUpperCase().slice(-5)}-${String(i + 1).padStart(3, "0")}`;
}

export async function importCasesAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", error: "Choose a CSV file." };
  }
  if (file.size > 1024 * 1024) {
    return { status: "error", error: "CSV too large (max 1 MB)." };
  }
  const text = await file.text();
  const { headers, rows } = parseCsv(text);

  const missing = REQUIRED_COLS.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    return {
      status: "error",
      error: `CSV missing required columns: ${missing.join(", ")}. Header must include name and amount.`,
    };
  }

  const idx = {
    name: headers.indexOf("name"),
    email: headers.indexOf("email"),
    phone: headers.indexOf("phone"),
    amount: headers.indexOf("amount"),
    currency: headers.indexOf("currency"),
    description: headers.indexOf("description"),
    locale: headers.indexOf("locale"),
  };

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

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // header is row 1
    const cell = (k: number) => (k >= 0 && k < row.length ? row[k].trim() : "");
    const name = cell(idx.name);
    const email = cell(idx.email);
    const phone = cell(idx.phone);
    const amountStr = cell(idx.amount);
    const currencyRaw = cell(idx.currency).toUpperCase();
    const description = cell(idx.description);
    const localeRaw = cell(idx.locale).toLowerCase();

    if (!name) {
      failed++;
      errors.push({ row: rowNum, reason: "Missing name" });
      continue;
    }
    if (email && !EMAIL_RE.test(email)) {
      failed++;
      errors.push({ row: rowNum, reason: "Invalid email" });
      continue;
    }
    if (phone && !E164_RE.test(phone)) {
      failed++;
      errors.push({ row: rowNum, reason: "Phone not E.164 (e.g. +14185551234)" });
      continue;
    }
    const amount = Number(amountStr.replace(",", "."));
    if (!isFinite(amount) || amount <= 0) {
      failed++;
      errors.push({ row: rowNum, reason: "Amount must be > 0" });
      continue;
    }
    const currency = currencyRaw || "CAD";
    if (!(ALLOWED_CURRENCIES as readonly string[]).includes(currency)) {
      failed++;
      errors.push({ row: rowNum, reason: `Unsupported currency ${currency}` });
      continue;
    }
    const locale = isLocale(localeRaw) ? localeRaw : null;

    try {
      const { data: caseRow, error: e1 } = await supabase
        .from("cases")
        .insert({
          org_id: membership.org_id,
          ref: autoRef(i),
          amount_cents: Math.round(amount * 100),
          currency,
          description: description || null,
          paylink_slug: paylinkSlug(),
        })
        .select("id, opened_at")
        .single();
      if (e1 || !caseRow) {
        throw new Error(e1?.message ?? "case insert failed");
      }
      const { error: e2 } = await supabase.from("debtors").insert({
        case_id: caseRow.id,
        full_name: name,
        email: email || null,
        phone_e164: phone || null,
        locale,
      });
      if (e2) throw new Error(e2.message);
      await scheduleCampaign(supabase, caseRow.id, new Date(caseRow.opened_at));
      created++;
    } catch (err) {
      failed++;
      errors.push({ row: rowNum, reason: String(err) });
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
