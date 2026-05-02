# Incident response runbook

When the privacy policy commits to "72-hour notification to the CAI / GDPR
DPA on a confirmed personal-data breach", this is the playbook that delivers
on that promise. **Do not improvise during an incident — follow this doc.**

## Detection sources

| Source | What it surfaces |
|---|---|
| Sentry (`security@dragun.app` alerts) | Unhandled exceptions, error spikes, performance regressions |
| Logflare (custom alerts on `kind:auth.signin.failed` rate, `kind:stripe.webhook.bad_signature`, `kind:csp.violation`) | Auth abuse, webhook tampering attempts, CSP violations indicating possible XSS |
| Stripe Radar | Fraud signals on payments; transaction disputes |
| Twilio fraud detection | Toll fraud, abnormal call volumes |
| Customer email (`security@dragun.app`, `privacy@dragun.app`) | Externally reported issues |
| GitHub Dependabot | Dependency CVE disclosures |
| Supabase / Vercel status pages | Subprocessor outages |

## Severity matrix

| Sev | Definition | Initial response time | Escalation |
|---|---|---|---|
| **S1** | Confirmed customer data exposure, OR production outage > 1 hour, OR active attack in progress | Immediate (≤15 min) | Founder + advisor + legal counsel |
| **S2** | Suspected data exposure (unconfirmed), OR degraded service affecting > 1 customer, OR repeated auth abuse from a single source | ≤1 hour | Founder + advisor |
| **S3** | Single-customer issue, isolated bug, dependency CVE with available patch | ≤24 hours | Founder |
| **S4** | Informational (e.g. customer security questionnaire) | ≤72 hours | Founder |

## Communication tree (single-founder phase)

| Role | Name | Contact | When |
|---|---|---|---|
| Incident commander | Yani Meziani (founder) | mezianiyani0@gmail.com / personal mobile (Vercel envs) | Always |
| Advisor / second pair of eyes | Mounir Rami | (TBD — confirm before launch) | S1 + S2 |
| Legal counsel | (TBD — engage before launch) | — | S1 only |
| Customers | broadcast email | from `security@dragun.app` | S1 within 72h, S2 if confirmed |
| CAI Quebec | https://www.cai.gouv.qc.ca/ | breach notification form | S1 confirmed personal-data breach |
| GDPR DPA | (CNIL France via OSS lead authority TBD) | dedicated breach form | S1 confirmed EU-resident breach |

## Phase 1 — Detect & triage (first 30 minutes)

1. **Acknowledge** — first responder posts in `#incidents` (or self-DM if solo) with `IR-{YYYYMMDD-HHMM}` ID, severity guess, source.
2. **Snapshot evidence** — capture Sentry event IDs, Logflare request_ids, Vercel deploy hashes, Supabase log timestamps. Do not delete anything.
3. **Stop the bleeding** — if active attack: rotate the suspected credential, rate-limit at Vercel firewall, take the affected route offline if needed.
4. **Open the ticket** — file a private GitHub issue under `INCIDENTS-only` (admin-restricted) titled with the IR ID. Pin Sentry event link, log queries.

## Phase 2 — Contain (first 2 hours)

1. **Isolate** — revoke any session, key, or token that may have been compromised. Update env in Vercel (auto-redeploys).
2. **Preserve** — Supabase point-in-time-recovery snapshot taken if data integrity is in question.
3. **Notify advisor** if S1 or S2.
4. **Initial customer comms** if customer-facing — short, factual, no speculation. Template in `templates/incident-customer-initial.md` (TBD).

## Phase 3 — Eradicate & recover (24-72 hours)

1. **Root cause** — confirm what broke. Don't ship a fix until cause is understood.
2. **Patch** — code fix + tests + deploy. Use the normal CI flow if possible.
3. **Verify** — replay the failing scenario, confirm metric returned to normal.
4. **Restore** — re-enable any disabled routes, lift rate limits.

## Phase 4 — Notify (within 72 hours of confirmation)

For confirmed personal-data breaches:

- **CAI Quebec** breach form — required if Quebec residents' data is affected (Law 25)
- **GDPR DPA** notification — required if EU residents' data is affected (Art. 33 GDPR)
- **Affected customers** — email from `security@dragun.app` describing what happened, what data, what we've done, what they should do

Use the templates in §Templates below.

## Phase 5 — Post-incident review (within 2 weeks)

Author a postmortem in `docs/incidents/{IR-ID}.md` with:

- Timeline (UTC, evidence-cited)
- Root cause (5-whys or fault-tree, no blame)
- Blast radius (who was affected, what data, for how long)
- Remediation already shipped
- Follow-up actions, each with owner + target date
- Process gaps (was the playbook insufficient? update it)

## Templates

### Customer notification template (S1 confirmed PII breach)

```
Subject: Important: a security incident affecting your Dragun account

[Customer name],

On [DATE], we detected [BRIEF FACT]. Here is what we know:

- **What happened:** [factual description, no speculation]
- **What data was involved:** [precise list — debtor names? emails? phones? payment metadata?]
- **What did NOT happen:** [reassurances based on evidence — e.g. "no payment card data was exposed because Stripe holds it"]
- **What we've done:** [containment, remediation, audit]
- **What you should do:** [concrete actions — rotate passwords, monitor accounts, etc.]

We are notifying the CAI Quebec / [other DPA] in parallel. We will follow up
within seven days with the post-incident report.

Yani Meziani — security@dragun.app — [phone, S1 only]
```

### Regulator notification template

For CAI Quebec: use the form at https://www.cai.gouv.qc.ca/
For GDPR DPA: file via the lead authority in the customer's member state

Required fields (gathered from the IR ticket):

- Date and time of detection / containment / notification
- Nature of the breach
- Categories and approximate number of affected data subjects
- Categories and approximate number of affected records
- Likely consequences
- Measures taken / proposed
- Contact: `security@dragun.app` + founder phone

## Drill cadence

- **Quarterly** — read this doc end-to-end, confirm contacts still resolve (manops §2.4)
- **Annually** — tabletop exercise: simulate an S1 with the advisor, walk the playbook, time-stamp each phase

## Cross-references

- Privacy policy 72h commitment: `app/legal/_content/privacy.ts`
- Audit trail: `/app/settings/activity` (UI) + `audit_events` table
- Subprocessor escalation contacts: [`subprocessors.md`](./subprocessors.md)
- ManOps drill schedule: [`soc2-manops.md`](./soc2-manops.md) §2.4 + §3
