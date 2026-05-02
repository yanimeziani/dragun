import { chromium } from "playwright";

const BASE = process.env.E2E_BASE || "https://dragun.app";
const ts = Date.now();
const EMAIL = process.env.E2E_EMAIL || `e2e-${ts}@dragun-test.dev`;
const PASSWORD = process.env.E2E_PASSWORD || `Pw-${ts}-Strong!`;
const NAME = "E2E Tester";

const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

const events = [];
const cookies = [];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ baseURL: BASE });
  const page = await ctx.newPage();

  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      events.push({ type: "nav", url: frame.url(), at: Date.now() - ts });
      log("NAV →", frame.url());
    }
  });
  page.on("response", (r) => {
    const u = new URL(r.url());
    if (u.host.includes("dragun.app") && (r.status() >= 300 || u.pathname.startsWith("/auth") || u.pathname.startsWith("/welcome") || u.pathname.startsWith("/app"))) {
      events.push({ type: "resp", status: r.status(), url: r.url(), at: Date.now() - ts });
      log(`HTTP ${r.status()} ${u.pathname}${u.search}`);
    }
  });
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      log("CONSOLE", m.type(), m.text());
    }
  });
  page.on("pageerror", (e) => log("PAGEERROR", e.message));

  try {
    log("=== STEP 1: visit apex /auth/sign-up ===");
    await page.goto("/auth/sign-up", { waitUntil: "domcontentloaded" });
    log("URL after navigation:", page.url());

    log("=== STEP 2: fill sign-up form ===");
    await page.fill('input[name="name"]', NAME);
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    log("Submitting with email:", EMAIL);

    await Promise.all([
      page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {}),
      page.click('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Sign up")').catch(async () => {
        const btns = await page.$$('button[type="submit"]');
        if (btns[0]) await btns[0].click();
      }),
    ]);

    await page.waitForTimeout(2500);
    log("URL after submit:", page.url());

    log("=== STEP 2b: any error displayed on page ===");
    const fullBody = await page.locator("body").innerText();
    const errMatch = fullBody.match(/(error|invalid|failed|already|exist|registered|confirm|disabled|missing)[^\n]{0,200}/gi);
    if (errMatch) errMatch.slice(0, 5).forEach((m) => log("ERR-LIKE:", JSON.stringify(m).slice(0, 250)));
    log("FULL BODY:", fullBody.replace(/\s+/g, " "));
    const formState = await page.evaluate(() => {
      const status = document.querySelector('[role="alert"], [data-error], .error');
      return status ? status.textContent : null;
    });
    if (formState) log("FORM-STATE:", formState);

    log("=== STEP 3: cookies after sign-up ===");
    const cs = await ctx.cookies();
    cs.forEach((c) => {
      cookies.push({ name: c.name, domain: c.domain, path: c.path, secure: c.secure, sameSite: c.sameSite, httpOnly: c.httpOnly });
      log(`  ${c.name} | domain=${c.domain} | path=${c.path} | sameSite=${c.sameSite}`);
    });

    log("=== STEP 4: try to reach /app directly ===");
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    log("URL after /app navigation:", page.url());
    const title = await page.title();
    log("Page title:", title);

    log("=== STEP 5: visible content sample ===");
    const bodyText = (await page.locator("body").innerText()).slice(0, 500);
    log("BODY (first 500 chars):", bodyText.replace(/\s+/g, " "));

    log("=== STEP 6: try apex (no www) ===");
    const ctx2 = await browser.newContext();
    await ctx2.addCookies(cs);
    const page2 = await ctx2.newPage();
    await page2.goto(`${BASE.replace("//www.", "//")}/app`, { waitUntil: "domcontentloaded" });
    await page2.waitForTimeout(1500);
    log("URL after apex /app:", page2.url());
  } catch (e) {
    log("ERROR:", e.message);
  } finally {
    log("\n=== SUMMARY ===");
    log("Final URL:", page.url());
    log("Events captured:", events.length);
    log("Cookies on dragun.app:", cookies.filter((c) => c.domain.includes("dragun.app")).length);
    log("Auth-token cookies:", cookies.filter((c) => c.name.includes("auth-token") || c.name.startsWith("sb-")).map((c) => c.name).join(", ") || "(none)");
    await browser.close();
  }
})();
