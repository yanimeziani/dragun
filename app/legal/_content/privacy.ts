import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Politique de confidentialité",
  effectiveDate: "1ᵉʳ mai 2026",
  preamble:
    "Dragun (« nous », « notre », « nos ») est exploité par Dragun, Inc., dont le siège est à Charlesbourg (Québec), Canada. Cette politique décrit ce que nous recueillons, pourquoi, avec qui nous le partageons, et les droits qui vous sont reconnus, que vous écriviez du Québec, d'ailleurs au Canada, de l'Union européenne, du Royaume-Uni, de la Suisse, des États-Unis ou d'ailleurs. La version française fait foi en cas de divergence.",
  sections: [
    {
      heading: "À qui s'adresse cette politique",
      body: [
        "Aux propriétaires d'entreprise qui ouvrent un compte chez Dragun (les « clients »).",
        "Aux personnes dont nos clients ajoutent les coordonnées dans Dragun à des fins de relance (les « débiteurs »). Le client demeure le responsable du traitement des données de ses débiteurs ; Dragun agit comme sous-traitant.",
        "Aux visiteurs de notre site web.",
      ],
    },
    {
      heading: "Renseignements que nous recueillons",
      body: [
        "Comptes propriétaires : nom, adresse courriel, mot de passe haché, langue préférée, informations de l'entreprise (nom, devise, signature de marque), pays de facturation, identifiant Stripe.",
        "Cas et débiteurs que vous créez : nom du débiteur, courriel, numéro de téléphone, montant dû, description, langue préférée, statut.",
        "Événements de campagne : statut d'envoi, identifiants des fournisseurs de courriel/SMS/voix, horodatages, codes d'erreur.",
        "Paiements : montant, devise, identifiant Stripe Checkout, horodatage. Nous ne stockons jamais les numéros de carte ; ils sont gérés par Stripe.",
        "Cookies : authentification (Supabase, strictement nécessaire) et préférence de langue (« dragun_locale », fonctionnel). Aucun cookie publicitaire, aucun cookie de mesure d'audience tiers.",
        "Journaux techniques : adresse IP tronquée, agent utilisateur, identifiant de requête, durée. Conservés au maximum 90 jours pour la sécurité et le diagnostic.",
      ],
    },
    {
      heading: "Bases légales et finalités",
      body: [
        "Exécution du contrat (RGPD, art. 6(1)(b) ; Loi 25, art. 12) : faire fonctionner le service, envoyer les communications de relance, encaisser les paiements.",
        "Obligations légales (RGPD, art. 6(1)(c)) : facturation, fiscalité, demandes des autorités lorsque la loi nous y oblige.",
        "Intérêt légitime (RGPD, art. 6(1)(f)) : sécurité, prévention de la fraude, journaux techniques. Cet intérêt est mis en balance avec vos droits.",
        "Consentement (RGPD, art. 6(1)(a) ; LCAP) : pour les communications électroniques que vous, le client, envoyez à vos débiteurs. Vous attestez disposer du consentement requis (voir Conditions).",
      ],
    },
    {
      heading: "Avec qui nous partageons",
      body: [
        "Supabase Inc. — base de données, authentification, hébergement chiffré (États-Unis).",
        "Vercel Inc. — hébergement de l'application web (États-Unis ; régions edge mondiales).",
        "Stripe Payments Canada, Ltd. / Stripe, Inc. — encaissement, reçus, conformité PCI-DSS.",
        "Telnyx LLC — envoi de SMS et appels téléphoniques (États-Unis).",
        "Resend, Inc. — envoi de courriels transactionnels (États-Unis).",
        "Aucun de ces fournisseurs n'a le droit de revendre vos données ni celles de vos débiteurs. Aucune publicité, aucun courtier de données, aucun pisteur tiers.",
        "Nous pouvons partager des renseignements lorsque la loi nous y oblige (mandat, ordonnance, demande d'une autorité compétente). Nous contestons les demandes manifestement excessives.",
      ],
    },
    {
      heading: "Transferts hors du Québec et hors du Canada",
      body: [
        "Nos sous-traitants étant majoritairement aux États-Unis, vos renseignements peuvent y transiter ou y être conservés. Avant tout transfert hors du Québec, nous procédons à l'évaluation prévue à l'article 17 de la Loi 25 (facteurs de risque, mesures contractuelles, encadrement applicable).",
        "Pour les transferts depuis l'Espace économique européen, le Royaume-Uni ou la Suisse vers les États-Unis, nous nous appuyons sur les Clauses contractuelles types de la Commission européenne (2021/914), complétées par l'Addendum international de l'ICO pour le R.-U. et l'avenant suisse pour la Suisse.",
        "Vous pouvez demander à privacy@dragun.app une copie des garanties applicables.",
      ],
    },
    {
      heading: "Décisions automatisées",
      body: [
        "La cadence de relance suit des règles déterministes que vous configurez (jours, canaux, ton). Il n'y a aucun profilage, aucune notation de crédit, aucune décision juridique produite automatiquement. Aucun débiteur ne se voit refuser un service par Dragun ; nous transmettons des messages au nom de votre entreprise.",
      ],
    },
    {
      heading: "Vos droits",
      body: [
        "Selon la loi qui vous est applicable, vous disposez des droits d'accès, de rectification, de suppression, de portabilité, de retrait de consentement, d'opposition au traitement, et de limitation. La Loi 25 reconnaît également un droit à la cessation de la diffusion et à la désindexation.",
        "Pour exercer un droit, écrivez à privacy@dragun.app. Nous répondons dans un délai de 30 jours (Loi 25 et RGPD). Si vous êtes débiteur d'un client de Dragun, nous vous redirigeons vers ce client lorsqu'il s'agit de données dont il est le responsable.",
        "Vous pouvez déposer une plainte auprès de l'autorité compétente : Commission d'accès à l'information du Québec (cai.gouv.qc.ca), Commissariat à la protection de la vie privée du Canada (priv.gc.ca), votre autorité européenne de protection des données (edpb.europa.eu/about-edpb/about-edpb/members_en), Information Commissioner's Office au Royaume-Uni (ico.org.uk), ou l'autorité applicable à votre lieu de résidence.",
      ],
    },
    {
      heading: "Résidents de Californie (CCPA/CPRA)",
      body: [
        "Nous ne « vendons » pas et ne « partageons » pas vos renseignements personnels au sens de la loi californienne. Vous disposez des droits de connaître, de supprimer, de corriger et de limiter, exerçables à privacy@dragun.app. Aucune discrimination en cas d'exercice.",
      ],
    },
    {
      heading: "Mineurs",
      body: [
        "Dragun n'est pas destiné aux personnes de moins de 16 ans. Si vous croyez qu'un mineur figure dans nos systèmes, écrivez à privacy@dragun.app et nous supprimerons le compte ou les données concernées.",
      ],
    },
    {
      heading: "Conservation",
      body: [
        "Comptes et cas : tant que votre organisation est active. Après suppression, effacement dans les 30 jours, sauf obligation légale (registres comptables : 6 ans au Canada).",
        "Journaux techniques : 90 jours.",
        "Sauvegardes chiffrées : 35 jours glissants chez Supabase.",
      ],
    },
    {
      heading: "Sécurité",
      body: [
        "TLS de bout en bout, mots de passe hachés (bcrypt/argon2), clés de service en variables d'environnement, accès restreint par row-level security Supabase, journalisation des accès administratifs.",
        "Aucun système n'est parfait. Si vous découvrez une faille, écrivez à security@dragun.app. Notre politique de divulgation responsable accorde un délai raisonnable avant publication.",
        "En cas d'incident touchant des renseignements personnels, nous notifions la CAI et les personnes concernées conformément aux articles 3.5 et suivants de la Loi 25, et les autorités compétentes au titre du RGPD (art. 33-34) dans un délai de 72 heures.",
      ],
    },
    {
      heading: "Modifications",
      body: [
        "Nous pouvons mettre à jour cette politique. La date de prise d'effet ci-dessus change à chaque révision. Les modifications substantielles sont annoncées par courriel au moins 14 jours avant leur entrée en vigueur.",
      ],
    },
    {
      heading: "Nous joindre",
      body: [
        "Responsable de la protection des renseignements personnels — Dragun, Inc. · Charlesbourg (Québec), Canada · privacy@dragun.app",
        "Représentant pour l'Union européenne et le Royaume-Uni : à désigner avant ouverture commerciale dans ces juridictions ; entre-temps, écrivez à privacy@dragun.app.",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Privacy Policy",
  effectiveDate: "May 1, 2026",
  preamble:
    "Dragun (\"we\", \"us\", \"our\") is operated by Dragun, Inc., headquartered in Charlesbourg, Québec, Canada. This policy explains what we collect, why, who we share it with, and the rights you have — whether you write from Québec, elsewhere in Canada, the European Union, the United Kingdom, Switzerland, the United States, or anywhere else. The French version controls if there is a conflict.",
  sections: [
    {
      heading: "Who this policy is for",
      body: [
        "Business owners who open a Dragun account (the \"customers\").",
        "People whose contact details our customers add to Dragun for collection (the \"debtors\"). The customer remains the controller of debtor data; Dragun acts as processor.",
        "Visitors to our website.",
      ],
    },
    {
      heading: "What we collect",
      body: [
        "Owner accounts: name, email, hashed password, preferred language, business info (name, currency, brand signature), billing country, Stripe ID.",
        "Cases and debtors you create: debtor name, email, phone, amount owed, description, preferred language, status.",
        "Campaign events: send status, email/SMS/voice provider IDs, timestamps, error codes.",
        "Payments: amount, currency, Stripe Checkout ID, timestamp. We never store card numbers; Stripe does.",
        "Cookies: authentication (Supabase, strictly necessary) and language preference (\"dragun_locale\", functional). No advertising cookies, no third-party analytics.",
        "Technical logs: truncated IP, user agent, request ID, duration. Kept up to 90 days for security and diagnostics.",
      ],
    },
    {
      heading: "Legal bases and purposes",
      body: [
        "Performance of contract (GDPR art. 6(1)(b); Law 25 s. 12): operating the service, sending recovery messages, collecting payments.",
        "Legal obligations (GDPR art. 6(1)(c)): invoicing, taxes, lawful authority requests.",
        "Legitimate interest (GDPR art. 6(1)(f)): security, fraud prevention, technical logs. Balanced against your rights.",
        "Consent (GDPR art. 6(1)(a); CASL): for the electronic communications that you, the customer, send to your debtors. You confirm you hold the required consent (see Terms).",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "Supabase Inc. — encrypted database, auth, hosting (United States).",
        "Vercel Inc. — web app hosting (United States; global edge regions).",
        "Stripe Payments Canada, Ltd. / Stripe, Inc. — payment collection, receipts, PCI-DSS compliance.",
        "Telnyx LLC — SMS and outbound calls (United States).",
        "Resend, Inc. — transactional email (United States).",
        "None of these vendors are allowed to resell your data or your debtors' data. No ads, no data brokers, no third-party trackers.",
        "We may disclose information when legally required (warrant, order, lawful authority request). We push back on requests that are clearly overbroad.",
      ],
    },
    {
      heading: "Cross-border transfers",
      body: [
        "Most of our subprocessors are in the United States, so your information may transit or be stored there. Before any transfer outside Québec, we run the assessment required by section 17 of Law 25 (risk factors, contractual safeguards, applicable framework).",
        "For transfers from the European Economic Area, the United Kingdom or Switzerland to the United States, we rely on the European Commission's Standard Contractual Clauses (2021/914), supplemented by the ICO International Data Transfer Addendum for the UK and the Swiss addendum for Switzerland.",
        "You can ask privacy@dragun.app for a copy of the safeguards in place.",
      ],
    },
    {
      heading: "Automated decisions",
      body: [
        "The recovery cadence runs on deterministic rules you configure (days, channels, tone). There is no profiling, no credit scoring, no automated legal decision. No debtor is denied a service by Dragun; we relay messages on behalf of your business.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Depending on the law that applies to you, you have the rights of access, rectification, deletion, portability, withdrawal of consent, objection, and restriction. Law 25 also recognizes a right to cease dissemination and a right to de-indexing.",
        "To exercise a right, write to privacy@dragun.app. We respond within 30 days (Law 25 and GDPR). If you are a debtor of a Dragun customer, we redirect you to that customer when the data is theirs as controller.",
        "You can lodge a complaint with the competent authority: Commission d'accès à l'information du Québec (cai.gouv.qc.ca), Office of the Privacy Commissioner of Canada (priv.gc.ca), your European data protection authority (edpb.europa.eu/about-edpb/about-edpb/members_en), the UK Information Commissioner's Office (ico.org.uk), or the authority for your place of residence.",
      ],
    },
    {
      heading: "California residents (CCPA/CPRA)",
      body: [
        "We do not \"sell\" or \"share\" your personal information as those terms are defined under California law. You have rights to know, delete, correct, and limit, exercisable at privacy@dragun.app. No discrimination for exercising them.",
      ],
    },
    {
      heading: "Minors",
      body: [
        "Dragun is not intended for anyone under 16. If you believe a minor's data is in our systems, write to privacy@dragun.app and we will delete the account or data.",
      ],
    },
    {
      heading: "Retention",
      body: [
        "Accounts and cases: while your organization is active. After deletion, wiped within 30 days, except where a legal obligation applies (accounting records: 6 years in Canada).",
        "Technical logs: 90 days.",
        "Encrypted backups: 35-day rolling window at Supabase.",
      ],
    },
    {
      heading: "Security",
      body: [
        "End-to-end TLS, hashed passwords (bcrypt/argon2), service keys in environment variables, access scoped by Supabase row-level security, admin access logged.",
        "No system is perfect. If you find a flaw, write to security@dragun.app. Our responsible-disclosure stance gives you a reasonable window before publication.",
        "If an incident affects personal information, we notify the CAI and affected individuals as required by Law 25 (s. 3.5 ff.) and competent authorities under GDPR (art. 33-34) within 72 hours.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update this policy. The effective date above changes with each revision. Material changes are announced by email at least 14 days before they take effect.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Privacy Officer — Dragun, Inc. · Charlesbourg, Québec, Canada · privacy@dragun.app",
        "EU and UK representative: to be appointed before commercial launch in those jurisdictions; in the meantime, write to privacy@dragun.app.",
      ],
    },
  ],
};

export const privacyDoc = { fr, en } as const;
