import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Sécurité",
  effectiveDate: "Mise à jour · 2 mai 2026",
  preamble:
    "La sécurité de vos données et de celles de vos clients est centrale à Dragun. Cette page résume nos mesures techniques, organisationnelles et de réponse aux incidents.",
  sections: [
    {
      heading: "Signaler une vulnérabilité",
      body: [
        "Pour divulguer une faille de sécurité, écrivez à security@dragun.app. Notre fichier security.txt est publié à https://dragun.app/.well-known/security.txt.",
        "Nous accusons réception sous 48 heures et publions un correctif coordonné lorsque c'est applicable. Les divulgations responsables sont reconnues publiquement avec votre accord.",
      ],
    },
    {
      heading: "Mesures techniques",
      body: [
        "TLS 1.2+ de bout en bout. HSTS avec preload. CSP avec nonce par requête.",
        "Postgres avec row-level security activé sur chaque table multi-locataire ; clés de service jamais exposées au navigateur.",
        "Mots de passe hachés (bcrypt/argon2 via Supabase Auth). Politique de longueur minimale 12 caractères et vérification HIBP de fuites de mots de passe.",
        "Webhooks signés (HMAC) avec vérification à temps constant. Idempotence sur l'enregistrement des paiements.",
      ],
    },
    {
      heading: "Journalisation et observabilité",
      body: [
        "Journal d'audit administratif sur chaque mutation d'organisation, de cas, de paiement ou d'abonnement, conservé douze mois et lisible par les membres de votre organisation à /app/settings/activity.",
        "Logs structurés (Pino) avec masquage automatique des PII (courriels, téléphones, charges utiles de campagne) avant ingestion.",
        "Suivi des erreurs via Sentry avec règles de masquage des champs sensibles.",
      ],
    },
    {
      heading: "Réponse aux incidents",
      body: [
        "Politique formelle dans docs/incident-response.md. En cas de violation confirmée de données personnelles, nous notifions la CAI (Loi 25) et l'autorité GDPR concernée dans un délai de 72 heures, et les clients affectés selon le calendrier prévu par la loi.",
        "Exercices de simulation tabletop annuels ; revue trimestrielle des contacts d'escalade.",
      ],
    },
    {
      heading: "Sous-traitants",
      body: [
        "La liste complète des sous-traitants (Supabase, Vercel, Stripe, Resend, Telnyx, Google OAuth, Sentry, Logflare, GitHub) est tenue à jour dans docs/subprocessors.md, avec leur portée de données, région et certifications SOC 2 / ISO.",
      ],
    },
    {
      heading: "Conformité — état du programme",
      body: [
        "SOC 2 — Programme aligné sur les critères AICPA TSC. Engagement d'audit Type I prévu post-lancement.",
        "Loi 25 (Québec) et RGPD — droits d'accès, de rectification et d'effacement honorés via la procédure documentée dans la politique de confidentialité.",
        "Hébergement principal au Canada (région Supabase ca-central-1).",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Security",
  effectiveDate: "Updated · May 2, 2026",
  preamble:
    "The security of your data and your customers' data is central to Dragun. This page summarises our technical, organisational and incident-response measures.",
  sections: [
    {
      heading: "Report a vulnerability",
      body: [
        "Report a security issue at security@dragun.app. Our security.txt is published at https://dragun.app/.well-known/security.txt.",
        "We acknowledge reports within 48 hours and coordinate disclosure where applicable. Responsible disclosures are credited publicly with your consent.",
      ],
    },
    {
      heading: "Technical measures",
      body: [
        "TLS 1.2+ end-to-end. HSTS with preload. Per-request nonced CSP.",
        "Postgres with row-level security enabled on every multi-tenant table; service-role keys never reach the browser.",
        "Passwords hashed (bcrypt/argon2 via Supabase Auth). Minimum length 12 characters with HIBP leaked-password checks.",
        "Webhooks signed (HMAC) with constant-time verification. Idempotency on payment recording.",
      ],
    },
    {
      heading: "Logging and observability",
      body: [
        "Administrative audit log on every organisation, case, payment, and subscription mutation; retained twelve months and readable to organisation members at /app/settings/activity.",
        "Structured logs (Pino) with automatic PII redaction (emails, phone numbers, campaign payloads) before ingestion.",
        "Error tracking via Sentry with sensitive-field scrubbing rules.",
      ],
    },
    {
      heading: "Incident response",
      body: [
        "Formal policy in docs/incident-response.md. On confirmed personal-data breach, we notify the CAI (Law 25) and the relevant GDPR DPA within 72 hours, and affected customers per the statutory schedule.",
        "Annual tabletop exercises; quarterly review of escalation contacts.",
      ],
    },
    {
      heading: "Subprocessors",
      body: [
        "The full list (Supabase, Vercel, Stripe, Resend, Telnyx, Google OAuth, Sentry, Logflare, GitHub) is maintained in docs/subprocessors.md with each vendor's data scope, region, and SOC 2 / ISO certifications.",
      ],
    },
    {
      heading: "Compliance — program status",
      body: [
        "SOC 2 — Program aligned to AICPA TSC. Type I audit engagement scheduled post-launch.",
        "Law 25 (Quebec) and GDPR — access, rectification, and erasure rights honoured via the procedure documented in the privacy policy.",
        "Primary hosting in Canada (Supabase ca-central-1 region).",
      ],
    },
  ],
};

export const securityDoc: Record<"fr" | "en", LegalDoc> = { fr, en };
