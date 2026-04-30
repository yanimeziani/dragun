# Dragun specs

Single source of truth for what we're building, why, and in what order.
Read in this sequence:

1. [`product.md`](./product.md) — what Dragun is and what "done" means for the 2026-05-01 demo with Mounir Rami (Venice Gym Charlesbourg).
2. [`architecture.md`](./architecture.md) — surfaces, data model, third-party deps, env vars, file layout.
3. [`stories.md`](./stories.md) — ordered slices S1..S9 with acceptance criteria. The autonomous build loop walks this list top to bottom.
4. [`runbook.md`](./runbook.md) — pre-flight checklist and meeting-day choreography.
5. [`loop.md`](./loop.md) — the autonomous Ralph-style build loop prompt and how to launch it.

Conventions:

- Specs are prose, not templates. Edit freely; keep them short and current.
- A story is "done" only when its acceptance criteria pass on the deployed Vercel URL, not localhost.
- If reality diverges from a spec, **update the spec in the same commit as the code change** so the docs never drift.
