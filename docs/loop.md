# Autonomous build loop

A "Ralph Wiggum" loop: same prompt fires every iteration; the agent
walks `stories.md` top to bottom, completes one story per iteration,
commits, and exits when (a) all stories are `done`, or (b) it hits
something only a human can resolve.

**Authorized run window:** ~3 hours of wall-clock work toward the
2026-05-01 15:30 production launch. Story list per the post-spec
rewrite is S0..S16 in `stories.md`; ~12 stories in scope for the
loop (S0 done, S1–S3 blocked-human, the rest workable in dependency
order).

## Pre-flight before launching the loop

1. Mounir's number (in your contacts) added to Twilio verified
   caller-IDs and OTP completed. The loop cannot do this for you.
2. Twilio + Supabase Cloud accounts exist and credentials are in
   `.env.development.local` *and* in Vercel project env vars.
3. `git status` is clean *for files the loop will touch*. The user
   may have parallel WIP on `app/page.tsx` (auth integration) — the
   loop must `git status` before touching that file and skip / wait
   if the user has uncommitted edits there.
4. `npm run build` currently passes on `main`.
5. Stripe test-mode keys exist in env (S3) — without them, S11+S12
   are blocked.

If any of those are red, fix them by hand first. The loop is for
the mechanical slices, not the human-input ones.

## The prompt

Paste this (or a slash-command equivalent) into the loop runner:

```
You are continuing an autonomous build loop on the Dragun repo.

Source of truth: docs/product.md, docs/architecture.md, docs/stories.md, docs/runbook.md.
Read all four every iteration before doing anything.

Your job each iteration:

1. Open docs/stories.md and find the first story that is workable now.
   "Workable" = Status is `pending` or `in_progress`, AND every story
   listed in `Depends on:` has Status `done`. Skip stories whose Status
   is `blocked-human` and any story whose dependency chain includes a
   `blocked-human` story. If no story is workable, stop and report
   which human-blocked stories are gating the rest.
2. If you find a workable story whose own Status is `blocked-human`
   (do not — they should be skipped above), stop and report.
3. Mark that story `in_progress` in stories.md and commit only that change
   with message: `chore(stories): start <Sx>`.
4. Execute the story's Steps in order. Stay within the file layout in
   architecture.md. Do not invent surfaces or dependencies that are not
   listed there. Do not add ElevenLabs, Stripe, or auth.
5. Run the acceptance check exactly as written. The check must pass on
   the deployed Vercel URL where the story says so — localhost-only
   passes do not count.
6. If acceptance passes: mark the story `done` in stories.md, commit the
   code + the status change together with message:
   `feat(<area>): <story title> (<Sx>)`. Then stop the iteration. The
   outer loop will fire again for the next story.
7. If acceptance fails: do NOT mark `done`. Either fix forward in this
   iteration (preferred), or revert your changes, leave the story
   `in_progress`, and stop with a clear failure report so the next
   iteration can resume with full context.

Hard rules:

- Never edit a story's Acceptance section. If acceptance is wrong,
  stop and ask. The acceptance criteria are the contract.
- Skipping `blocked-human` stories is allowed and expected. Skipping
  past a `pending` story to grab one further down is NOT allowed
  unless the pending story's `Depends on:` lists a story that is
  itself `blocked-human` or `pending` — in that case, also skip.
- Before opening a file the user might be editing in parallel
  (notably `app/page.tsx`), run `git status` and inspect for
  uncommitted modifications. If the file is dirty with the user's
  WIP, leave a note in the iteration report and pick a different
  story instead of merge-conflicting with them.
- Never disable hooks, never --no-verify, never --force push.
- Commits go to `main` directly (solo founder, pre-launch). One commit
  per story plus one for the `in_progress` flip.
- If you are about to run a destructive operation (db reset on prod,
  rm -rf, force push), stop and ask instead.

Reporting at end of iteration:
- One line: which story you advanced and to what state.
- If you stopped because of human input, name exactly what you need.
```

## Launching it

The `/loop` skill is the right runner. Two modes:

- **Self-paced (recommended for this batch):** `/loop` with no
  interval, paste the prompt above. The model picks its own cadence
  between iterations and stops when stories are done or input is
  needed.
- **Fixed interval:** `/loop 10m <prompt>` if you want forced pacing.
  Not useful here — story sizes vary too much.

Do not launch the loop until S1 is unblocked (Mounir's number in hand).
The loop will hit S1 immediately and stop.

## Stop conditions

The loop should stop on its own when:

- All stories in `stories.md` are `done` → ship.
- It hits a `Blocked by: human` story → tell you what to provide.
- It hits a destructive-op decision → ask before proceeding.
- An acceptance check fails twice in a row on the same story → ask.

If the loop is misbehaving (looping on the same story, fabricating
acceptance, editing protected sections), kill it manually with the
`ralph-loop:cancel-ralph` command and inspect `git log` for the
divergence.
