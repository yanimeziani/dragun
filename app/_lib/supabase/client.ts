"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-env.invalid";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "missing-env";
  return createBrowserClient(url, key);
}
