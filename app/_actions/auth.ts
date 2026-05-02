"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/app/_lib/supabase/server";

export type AuthState =
  | { status: "idle" }
  | { status: "error"; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return {
      status: "error",
      error: error?.message ?? "Couldn't start Google sign-in.",
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

  if (!EMAIL_RE.test(email))
    return { status: "error", error: "That email looks off." };
  if (password.length < 8)
    return { status: "error", error: "Password is at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", error: error.message };

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

  if (!fullName) return { status: "error", error: "Tell us your name." };
  if (!EMAIL_RE.test(email))
    return { status: "error", error: "That email looks off." };
  if (password.length < 8)
    return { status: "error", error: "Password is at least 8 characters." };

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
  if (error) return { status: "error", error: error.message };

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
