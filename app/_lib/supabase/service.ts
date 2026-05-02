import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client — bypasses RLS. Only call from privileged
// server contexts: webhook handlers (signature-verified) and cron handlers
// (CRON_SECRET-verified). Never expose to user-controlled input.
//
// Failure mode: throw. The user-facing client (server.ts / middleware.ts)
// soft-fails to keep the public site responsive when envs are missing, but
// privileged paths must fail loud — silent service-role no-ops have caused
// data-integrity bugs in this codebase before.

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error(
      "createServiceClient: NEXT_PUBLIC_SUPABASE_URL not set — refusing to operate against a stub URL on a privileged path",
    );
  }
  if (!key) {
    throw new Error(
      "createServiceClient: SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) not set — refusing to operate without service role on a privileged path",
    );
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
