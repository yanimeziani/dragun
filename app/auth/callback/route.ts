import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/_lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let target = explicitNext ?? "/welcome";
      if (!explicitNext && data.user) {
        const { data: membership } = await supabase
          .from("org_members")
          .select("org_id")
          .eq("user_id", data.user.id)
          .limit(1)
          .maybeSingle();
        target = membership ? "/app" : "/welcome";
      }
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth`);
}
