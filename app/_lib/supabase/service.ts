import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-env.invalid";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "missing-env";
  return createClient(
    url,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
