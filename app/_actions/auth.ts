"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/app/_lib/supabase/server";
import { withReqId } from "@/app/_lib/log";
import { getStrings } from "@/app/_lib/i18n";

export type AuthState =
  | { status: "idle" }
  | { status: "error"; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function reqLog() {
  const h = await headers();
  return withReqId(h.get("x-request-id"));
}

async function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function signInWithGoogle(): Promise<AuthState> {
  const supabase = await createClient();
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error || !data.url) {
    const s = await getStrings();
    return {
      status: "error",
      error: error?.message ?? s.errors.googleStartFailed,
    };
  }
  redirect(data.url);
}

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const s = await getStrings();
  if (!EMAIL_RE.test(email))
    return { status: "error", error: s.errors.invalidEmail };
  if (password.length < 8)
    return { status: "error", error: s.errors.passwordTooShort };

  const log = await reqLog();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    log.warn(
      { kind: "auth.signin.failed", reason: error.message },
      "password sign-in failed",
    );
    return { status: "error", error: error.message };
  }
  log.info({ kind: "auth.signin.ok", user_id: data.user?.id }, "password sign-in ok");

  const userId = data.user?.id;
  let target = "/welcome";
  if (userId) {
    const { data: membership } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (membership) target = "/app";
  }

  revalidatePath("/", "layout");
  redirect(target);
}

export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "").trim();

  const s = await getStrings();
  if (!fullName) return { status: "error", error: s.errors.nameRequired };
  if (!EMAIL_RE.test(email))
    return { status: "error", error: s.errors.invalidEmail };
  if (password.length < 8)
    return { status: "error", error: s.errors.passwordTooShort };

  const log = await reqLog();
  const supabase = await createClient();
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    log.warn({ kind: "auth.signup.failed", reason: error.message }, "sign-up failed");
    return { status: "error", error: error.message };
  }
  log.info({ kind: "auth.signup.ok", user_id: data.user?.id }, "sign-up ok");

  // If the project requires email confirmation, session will be null.
  if (!data.session) {
    redirect("/auth/sign-in?check=email");
  }

  revalidatePath("/", "layout");
  redirect("/welcome");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
