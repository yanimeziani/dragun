import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { signOut } from "@/app/_actions/auth";

export const metadata: Metadata = {
  title: "Welcome · Dragun",
};

function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      className={className}
      aria-hidden
    >
      <path d="M3.5 4.5 H20.5" />
      <path d="M12 4.5 V19.5" />
      <path d="M6 13 L12 19.5 L18 13" />
      <circle cx="12" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    (user.email ? user.email.split("@")[0] : "there");

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 text-bone">
            <Mark className="h-5 w-5" />
            <span className="font-display text-lg sm:text-xl tracking-tight">
              Dragun
            </span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-[820px] px-4 sm:px-6 py-16 sm:py-28">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-ember">
          Seat reserved
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4.4rem)] leading-[1.02] tracking-tight text-bone break-words">
          Welcome, {name}.
        </h1>
        <p className="mt-6 max-w-[52ch] text-bone-2 text-base sm:text-lg leading-[1.55]">
          Your Dragun seat is ready. The in-app tutorial is being built — for
          now, take a tour of the live demo to see how reminders unfold across
          email, SMS, and voice.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/demo"
            className="group inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink transition-colors hover:bg-bone"
          >
            See the live demo
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-bone/50 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone hover:border-ember hover:text-ember transition-colors"
          >
            Back to the site
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <p className="mt-12 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
          Signed in as {user.email}
        </p>
      </section>
    </main>
  );
}
