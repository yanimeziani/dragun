# Autonomous build loop

A "Ralph Wiggum" loop: same prompt fires every iteration; the agent
walks `stories.md` top to bottom, completes one story per iteration,
commits, and exits when (a) all stories are `done`, or (b) it hits
something only a human can resolve.

## Pre-flight before launching the loop

1. Mounir's number (in your contacts) added to Twilio verified
   caller-IDs and OTP completed. The loop cannot do this for you.
2. Twilio + Supabase Cloud accounts exist and credentials are in
   `.env.development.local` *and* in Vercel project env vars.
3. `git status` is clean (loop will commit per story; you don't want
   it sweeping up unrelated work-in-progress).
4. `npm run build` currently passes on `main`.

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
  past a `pending` story to grab one further down is NOT allowed —
  fix or finish the pending one first.
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
