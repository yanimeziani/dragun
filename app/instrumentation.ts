// Next.js instrumentation hook — invoked once per server start.
// We use it to bootstrap Sentry on the appropriate runtime.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  } else if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string> },
) => {
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(err, request, {
    routerKind: "App Router",
    routePath: request.path,
    routeType: "route",
  });
};
