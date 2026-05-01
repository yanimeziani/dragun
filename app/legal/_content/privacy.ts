import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Politique de confidentialité",
  effectiveDate: "1ᵉʳ mai 2026",
  preamble:
    "Dragun (« nous », « notre », « nos ») respecte votre vie privée et celle des personnes au sujet desquelles vous nous confiez des renseignements. Cette politique décrit ce que nous recueillons, pourquoi, et avec qui nous le partageons. La version française fait foi.",
  sections: [
    {
      heading: "Renseignements que nous recueillons",
      body: [
        "Comptes propriétaires : nom, adresse courriel, mot de passe haché, langue préférée, informations de l'entreprise (nom, devise, signature de marque).",
        "Cas et débiteurs que vous créez : nom du membre, courriel, numéro de téléphone, montant dû, description, langue préférée.",
        "Événements de campagne : statut d'envoi, identifiants fournisseurs, horodatages.",
        "Paiements : montant, devise, identifiant Stripe, horodatage.",
        "Cookies : authentification (Supabase) et préférence de langue (« dragun_locale »).",
      ],
    },
    {
      heading: "Pourquoi nous recueillons ces renseignements",
      body: [
        "Exécuter le service que vous avez demandé : envoyer des courriels, textos et appels au nom de votre entreprise, encaisser les paiements de vos clients en retard, et vous montrer le suivi.",
        "Nous conformer à la loi : facturation, fiscalité, demandes des autorités lorsque la loi nous y oblige.",
        "Améliorer le produit : journaux d'erreurs et de performance, sans contenu personnel identifiable.",
      ],
    },
    {
      heading: "Avec qui nous partageons",
      body: [
        "Supabase Inc. — base de données, authentification, hébergement chiffré.",
        "Resend — envoi de courriels.",
        "Twilio — envoi de SMS et appels téléphoniques.",
        "Stripe — encaissement et reçus de paiement.",
        "Vercel — hébergement de l'application web.",
        "Aucun de ces fournisseurs n'a le droit de revendre vos données ni celles de vos clients. Aucune publicité, aucun courtier de données, aucun pisteur tiers.",
      ],
    },
    {
      heading: "Hébergement et résidence des données",
      body: [
        "Nos données opérationnelles résident chez Supabase et Vercel. Vous pouvez nous écrire pour connaître la région d'hébergement actuelle.",
      ],
    },
    {
      heading: "Vos droits",
      body: [
        "Conformément à la Loi 25 du Québec et au Règlement général sur la protection des données : vous pouvez à tout moment demander l'accès, la correction, la portabilité ou la suppression de vos données.",
        "Pour exercer un droit, écrivez-nous à privacy@dragun.app. Nous répondons dans les 30 jours.",
      ],
    },
    {
      heading: "Conservation",
      body: [
        "Vos comptes et cas sont conservés tant que votre organisation est active. Après suppression d'un compte, nous effaçons les données dans un délai de 30 jours, sauf obligation légale de conservation (ex. registres comptables).",
      ],
    },
    {
      heading: "Sécurité",
      body: [
        "Connexions chiffrées de bout en bout (TLS), mots de passe hachés, clés de service en variables d'environnement, accès restreint par row-level security.",
        "Aucun système n'est parfait. Si vous découvrez une faille, écrivez-nous à security@dragun.app.",
      ],
    },
    {
      heading: "Nous joindre",
      body: [
        "Dragun · Charlesbourg (Québec) · privacy@dragun.app",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Privacy Policy",
  effectiveDate: "May 1, 2026",
  preamble:
    "Dragun (\"we\", \"us\", \"our\") respects your privacy and the privacy of the people whose data you trust us with. This policy explains what we collect, why, and who we share it with. The French version is authoritative.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "Owner accounts: name, email, hashed password, preferred language, business info (name, currency, brand signature).",
        "Cases and debtors you create: customer name, email, phone, amount owed, description, preferred language.",
        "Campaign events: send status, provider IDs, timestamps.",
        "Payments: amount, currency, Stripe ID, timestamp.",
        "Cookies: authentication (Supabase) and language preference (\"dragun_locale\").",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "To run the service you asked for: send emails, texts and calls on behalf of your business, collect payments from your delinquent customers, and show you the tracking.",
        "To comply with the law: invoicing, taxes, government requests when legally required.",
        "To improve the product: error and performance logs, without personally identifying content.",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "Supabase Inc. — encrypted database, authentication, hosting.",
        "Resend — email delivery.",
        "Twilio — SMS and outbound calls.",
        "Stripe — payment collection and receipts.",
        "Vercel — web app hosting.",
        "None of these vendors are allowed to resell your data or your customers' data. No ads, no data brokers, no third-party trackers.",
      ],
    },
    {
      heading: "Data residency",
      body: [
        "Operational data lives at Supabase and Vercel. Email us for the current hosting region.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under Quebec's Law 25 and the GDPR: you may at any time request access, correction, portability, or deletion of your data.",
        "To exercise a right, write to privacy@dragun.app. We reply within 30 days.",
      ],
    },
    {
      heading: "Retention",
      body: [
        "Your accounts and cases are kept while your organization is active. After account deletion, we wipe the data within 30 days, except where a legal retention obligation applies (e.g. accounting records).",
      ],
    },
    {
      heading: "Security",
      body: [
        "End-to-end encrypted connections (TLS), hashed passwords, service keys in environment variables, access scoped by row-level security.",
        "No system is perfect. If you find a flaw, write to security@dragun.app.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Dragun · Charlesbourg, Quebec · privacy@dragun.app",
      ],
    },
  ],
};

export const privacyDoc = { fr, en } as const;
