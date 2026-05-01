import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Conditions d'utilisation",
  effectiveDate: "1ᵉʳ mai 2026",
  preamble:
    "Bienvenue chez Dragun. Ces conditions encadrent votre utilisation du service. En créant un compte, vous les acceptez. La version française fait foi.",
  sections: [
    {
      heading: "Le service",
      body: [
        "Dragun automatise la relance de paiements impayés pour les petites entreprises, par courriel, SMS et appel vocal. Vous fournissez la liste de débiteurs ; nous exécutons la cadence de relance dans votre voix de marque, dans la langue de votre client.",
      ],
    },
    {
      heading: "Tarification",
      body: [
        "Pas de frais d'inscription. Pas de minimum mensuel. Vous payez 5 % du montant récupéré, prélevé automatiquement à chaque paiement encaissé.",
        "Pour les premiers clients, le règlement entre Dragun et votre entreprise se fait manuellement par virement Interac ou virement bancaire, hebdomadairement, jusqu'à la mise en place de Stripe Connect Express.",
      ],
    },
    {
      heading: "Vos engagements",
      body: [
        "Vous attestez que les débiteurs que vous ajoutez vous doivent réellement les sommes indiquées, et que vous avez le droit légal de les contacter à l'adresse courriel et au numéro de téléphone fournis.",
        "Vous respectez la Loi canadienne anti-pourriel (LCAP), les règles de Twilio et de Resend en matière de consentement, et toute loi applicable de protection des consommateurs.",
        "Vous n'utilisez pas Dragun pour le harcèlement, les menaces, l'usurpation d'identité, les fausses déclarations ou toute pratique trompeuse.",
      ],
    },
    {
      heading: "Notre engagement",
      body: [
        "Nous opérons le service avec un effort raisonnable de fiabilité. Nous ne garantissons toutefois aucun taux de récupération, aucune disponibilité parfaite, et aucun résultat précis.",
        "Nous gardons vos données chiffrées et accessibles uniquement à vous et à votre équipe (voir Politique de confidentialité).",
      ],
    },
    {
      heading: "Suspension et résiliation",
      body: [
        "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'organisation. Les campagnes en cours s'arrêtent immédiatement.",
        "Nous pouvons suspendre ou résilier un compte qui enfreint ces conditions, qui présente un risque de fraude, ou qui menace l'intégrité du service. Nous prévenons par courriel quand cela est raisonnablement possible.",
      ],
    },
    {
      heading: "Limitation de responsabilité",
      body: [
        "Dans la mesure permise par la loi, la responsabilité totale de Dragun envers vous, pour toute cause, est limitée au plus élevé de : (a) les frais que vous nous avez payés au cours des douze derniers mois, ou (b) 100 $ CAD.",
        "Nous ne sommes pas responsables des conséquences de l'envoi à de mauvais destinataires, du contenu fourni par vous, ou des actes de vos clients.",
      ],
    },
    {
      heading: "Loi applicable",
      body: [
        "Ces conditions sont régies par les lois du Québec et les lois fédérales canadiennes applicables. Tout litige relève des tribunaux compétents du district judiciaire de Québec.",
      ],
    },
    {
      heading: "Modifications",
      body: [
        "Nous pouvons mettre à jour ces conditions. La date de prise d'effet ci-dessus est mise à jour à chaque révision. Les changements importants sont annoncés par courriel au moins 14 jours avant leur entrée en vigueur.",
      ],
    },
    {
      heading: "Nous joindre",
      body: [
        "Dragun · Charlesbourg (Québec) · legal@dragun.app",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Terms of Service",
  effectiveDate: "May 1, 2026",
  preamble:
    "Welcome to Dragun. These terms govern your use of the service. By creating an account, you agree to them. The French version is authoritative.",
  sections: [
    {
      heading: "The service",
      body: [
        "Dragun automates the collection of unpaid invoices for small businesses, via email, SMS, and voice. You provide the debtor list; we run the recovery cadence in your brand's voice and your customer's language.",
      ],
    },
    {
      heading: "Pricing",
      body: [
        "No signup fee. No monthly minimum. You pay 5 % of the amount recovered, automatically deducted on each successful payment.",
        "For our first cohort of customers, settlement between Dragun and your business is handled manually by Interac or bank transfer, weekly, until Stripe Connect Express is in place.",
      ],
    },
    {
      heading: "Your responsibilities",
      body: [
        "You confirm that the debtors you add genuinely owe you the amounts shown, and that you have the legal right to contact them at the email and phone provided.",
        "You comply with Canada's Anti-Spam Legislation (CASL), Twilio's and Resend's consent rules, and any applicable consumer-protection law.",
        "You don't use Dragun for harassment, threats, impersonation, false statements, or deceptive practices.",
      ],
    },
    {
      heading: "Our commitment",
      body: [
        "We operate the service with reasonable reliability efforts. We make no guarantee about recovery rates, uptime, or any specific outcome.",
        "We keep your data encrypted and accessible only to you and your team (see Privacy Policy).",
      ],
    },
    {
      heading: "Suspension and termination",
      body: [
        "You can delete your account at any time from organization settings. Active campaigns stop immediately.",
        "We may suspend or terminate accounts that violate these terms, present a fraud risk, or threaten service integrity. We notify by email when reasonably possible.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the extent permitted by law, Dragun's total liability to you, for any cause, is limited to the higher of (a) fees you paid us in the last twelve months, or (b) CAD 100.",
        "We are not responsible for consequences of sending to wrong recipients, content you provided, or your customers' actions.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of Quebec and applicable federal Canadian law. Disputes fall under the competent courts of the judicial district of Québec.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. The effective date above changes with every revision. Material changes are announced by email at least 14 days before they take effect.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Dragun · Charlesbourg, Quebec · legal@dragun.app",
      ],
    },
  ],
};

export const termsDoc = { fr, en } as const;
