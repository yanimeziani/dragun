"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "../_lib/supabase/service";

export type UnsubscribeState =
  | { status: "idle" }
  | { status: "done"; alreadyDone: boolean; orgName: string; debtorName: string }
  | { status: "error"; error: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function unsubscribeAction(
  _prev: UnsubscribeState,
  formData: FormData,
): Promise<UnsubscribeState> {
  const debtorId = String(formData.get("debtorId") ?? "").trim();
  if (!UUID_RE.test(debtorId)) {
    return { status: "error", error: "Invalid link." };
  }

  // Use service-role: the RPC is anon-grantable, but we hit it from a
  // public action where there's no auth context to scope service-role
  // queries against, so this is the cleanest path.
  const client = createServiceClient();
  const { data, error } = await client.rpc("unsubscribe_debtor", {
    p_debtor_id: debtorId,
  });

  if (error) return { status: "error", error: error.message };
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return { status: "error", error: "Not found." };
  }
  const row = Array.isArray(data) ? data[0] : data;

  revalidatePath(`/u/${debtorId}`);
  return {
    status: "done",
    alreadyDone: Boolean(row.already_unsubscribed),
    orgName: String(row.org_display_name ?? ""),
    debtorName: String(row.full_name ?? ""),
  };
}
