import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();
  // `.invalid` is RFC 2606-reserved — DNS fails fast so missing-env pages render as anonymous instead of crashing.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-env.invalid";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "missing-env";
  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            for (const { name, value, options } of toSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    },
  );
}
