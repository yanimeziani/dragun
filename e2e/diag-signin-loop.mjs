import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.development.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = process.env.E2E_BASE || "https://dragun.app";

if (!SUPABASE_URL || !SECRET) {
  console.error("missing supabase url/secret in .env.development.local");
  process.exit(1);
}

const ts = Date.now();
const EMAIL = `e2e-${ts}@dragun-test.dev`;
const PASSWORD = `Pw-${ts}-Strong!`;
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

(async () => {
  log("=== STEP 0: create pre-confirmed user via admin API ===");
  const admin = createClient(SUPABASE_URL, SECRET, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "E2E Tester", name: "E2E Tester" },
  });
  if (createErr) {
    log("admin.createUser ERROR:", createErr.message);
    process.exit(1);
  }
  log("created user id:", created.user.id, "email:", EMAIL);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ baseURL: BASE });
  const page = await ctx.newPage();

  const requests = [];
  page.on("request", (req) => {
    const u = new URL(req.url());
    if (u.host.includes("dragun.app")) {
      requests.push({ method: req.method(), url: req.url() });
    }
  });
  page.on("request", (req) => {
    const u = new URL(req.url());
    if (!u.host.includes("dragun.app")) return;
    if (req.method() !== "GET" || !u.search.includes("_rsc")) {
      log(`REQ  ${req.method()} ${u.pathname}${u.search}`);
    }
  });
  page.on("response", async (r) => {
    const u = new URL(r.url());
    if (!u.host.includes("dragun.app")) return;
    if (u.search.includes("_rsc") && r.status() < 300) return;
    const loc = r.headers()["location"] || "";
    const setCookie = r.headers()["set-cookie"] || "";
    log(`RESP ${r.status()} ${u.pathname}${u.search}${loc ? `  → ${loc}` : ""}`);
    if (setCookie) {
      const names = setCookie.split(/,(?=\s*[a-zA-Z0-9_-]+=)/).map((c) => c.split("=")[0].trim()).filter((n) => n.includes("sb-") || n === "dragun_locale");
      if (names.length) log(`   Set-Cookie: ${names.join(", ")}`);
    }
  });
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) log("NAV →", f.url());
  });

  try {
    log("=== STEP 1: visit /auth/sign-in ===");
    await page.goto("/auth/sign-in", { waitUntil: "domcontentloaded" });

    log("=== STEP 2: fill password form & submit ===");
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    const submitButtons = await page.locator('button[type="submit"]').all();
    log(`found ${submitButtons.length} submit buttons`);
    for (const [i, b] of submitButtons.entries()) {
      const txt = (await b.innerText()).trim();
      log(`  [${i}] "${txt.slice(0, 30)}"`);
    }
    log("clicking 'Sign in' button");
    await page.getByRole("button", { name: /^sign in$/i }).click();

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);

    log("URL after submit:", page.url());

    log("=== STEP 3: cookies ===");
    const cs = await ctx.cookies();
    cs.forEach((c) => log(`  ${c.name}  domain=${c.domain}  path=${c.path}  sameSite=${c.sameSite}`));

    log("=== STEP 4: visible page ===");
    const body = (await page.locator("body").innerText()).slice(0, 400).replace(/\s+/g, " ");
    log("BODY:", body);

    log("=== STEP 5: navigate /app explicitly ===");
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    log("URL after /app:", page.url());

    log("=== STEP 6: navigate / (landing) explicitly ===");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    log("URL after /:", page.url());
    const landingBody = (await page.locator("body").innerText()).slice(0, 400).replace(/\s+/g, " ");
    log("LANDING SHOWS AUTHED?", /open dashboard|tableau de bord|signed in/i.test(landingBody) ? "YES" : "NO");
  } catch (e) {
    log("ERROR:", e.message);
  } finally {
    log("\n=== CLEANUP: delete test user ===");
    await admin.auth.admin.deleteUser(created.user.id);
    log("test user deleted");
    await browser.close();
  }
})();
