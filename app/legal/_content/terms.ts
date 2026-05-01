import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Conditions d'utilisation",
  effectiveDate: "1ᵉʳ mai 2026",
  preamble:
    "Bienvenue chez Dragun. Ces conditions encadrent votre utilisation du service offert par Dragun, Inc. (Charlesbourg, Québec, Canada). Elles s'appliquent que votre entreprise soit au Québec, ailleurs au Canada, ou à l'étranger. En créant un compte, vous les acceptez. La version française fait foi en cas de divergence.",
  sections: [
    {
      heading: "Le service",
      body: [
        "Dragun est un outil logiciel-en-tant-que-service (SaaS) qui automatise la relance de paiements impayés pour les petites entreprises, par courriel, SMS et appel vocal. Vous fournissez la liste de débiteurs ; nous exécutons la cadence dans votre voix de marque, dans la langue de votre client.",
        "Dragun n'est pas une agence de recouvrement, ni un cabinet d'avocats, ni un conseiller financier. Vous demeurez le créancier ; nous sommes votre outil. Aucun avis juridique n'est fourni.",
      ],
    },
    {
      heading: "Admissibilité",
      body: [
        "Vous devez avoir l'âge de la majorité dans votre juridiction et représenter une entreprise légalement constituée. Vous ne pouvez pas utiliser Dragun si vous résidez dans un pays visé par des sanctions canadiennes, américaines, britanniques ou européennes complètes (notamment Cuba, Corée du Nord, Iran, Syrie, et les régions de Crimée, Donetsk et Louhansk en Ukraine), ni si vous figurez sur une liste de personnes désignées.",
      ],
    },
    {
      heading: "Tarification",
      body: [
        "Pas de frais d'inscription. Pas de minimum mensuel. Vous payez 5 % du montant récupéré, prélevé automatiquement à chaque paiement encaissé.",
        "Pour les premiers clients, le règlement entre Dragun et votre entreprise se fait manuellement par virement Interac ou virement bancaire, hebdomadairement, jusqu'à la mise en place de Stripe Connect Express.",
        "Les taxes applicables (TPS/TVQ pour le Québec, TVA pour l'UE/R.-U., autres taxes locales) sont ajoutées le cas échéant.",
      ],
    },
    {
      heading: "Vos engagements",
      body: [
        "Authenticité de la créance : vous attestez que les débiteurs que vous ajoutez vous doivent réellement les sommes indiquées, que la créance n'est pas contestée, et que vous avez le droit légal de les contacter à l'adresse courriel et au numéro de téléphone fournis.",
        "Consentement : vous respectez la Loi canadienne anti-pourriel (LCAP) au Canada, le RGPD et la directive ePrivacy en Europe, le PECR au Royaume-Uni, le TCPA aux États-Unis, et toute loi applicable en matière de communications commerciales et de protection des consommateurs.",
        "Conformité : vous respectez les règles d'utilisation acceptable de Twilio, Resend et Stripe, ainsi que les obligations de divulgation locales (par exemple, identification de l'expéditeur, mention « STOP » pour SMS, enregistrement d'appel selon la juridiction).",
        "Usages interdits : harcèlement, menaces, usurpation d'identité, fausses déclarations, intérêts usuraires, créances déjà confiées à une agence de recouvrement, créances faisant l'objet d'un litige, créances issues d'activités illégales.",
        "Vous indemnisez Dragun pour toute réclamation d'un débiteur, d'un fournisseur ou d'une autorité résultant d'un manquement à ces engagements.",
      ],
    },
    {
      heading: "Notre engagement",
      body: [
        "Nous opérons le service avec un effort raisonnable de fiabilité. Nous ne garantissons aucun taux de récupération, aucune disponibilité parfaite, aucun résultat précis.",
        "Nous gardons vos données chiffrées et accessibles uniquement à vous et à votre équipe (voir Politique de confidentialité).",
        "Nous publions toute interruption majeure et nos sous-traitants dans les Divulgations.",
      ],
    },
    {
      heading: "Suspension et résiliation",
      body: [
        "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'organisation. Les campagnes en cours s'arrêtent immédiatement. Les sommes déjà encaissées vous sont reversées selon le calendrier habituel.",
        "Nous pouvons suspendre ou résilier un compte qui enfreint ces conditions, qui présente un risque de fraude, ou qui menace l'intégrité du service. Nous prévenons par courriel quand cela est raisonnablement possible.",
      ],
    },
    {
      heading: "Garanties et exclusions",
      body: [
        "Le service est fourni « tel quel » et « selon disponibilité ». Dans la mesure permise par la loi, nous excluons toutes les garanties implicites de qualité marchande, d'adéquation à un usage particulier, et d'absence de contrefaçon.",
        "Rien dans ces conditions n'écarte les droits non renonciables que vous reconnaissent la Loi sur la protection du consommateur du Québec, la directive 2019/770 sur les contenus et services numériques dans l'UE, le Consumer Rights Act au R.-U., ou toute loi équivalente. Lorsque vous utilisez Dragun à des fins professionnelles, ces droits ne s'appliquent généralement pas.",
      ],
    },
    {
      heading: "Limitation de responsabilité",
      body: [
        "Dans la mesure permise par la loi, la responsabilité totale de Dragun envers vous, pour toute cause cumulée sur douze mois glissants, est limitée au plus élevé de : (a) les frais que vous nous avez payés au cours des douze derniers mois, ou (b) 100 $ CAD.",
        "Sont exclus les dommages indirects, accessoires, punitifs, ou la perte de profits, de données, de clientèle ou d'occasions d'affaires.",
        "Aucune limitation ne s'applique à la fraude, au dol, à la faute lourde, aux atteintes à la vie ou à l'intégrité physique, ni aux droits non renonciables du consommateur.",
        "Nous ne sommes pas responsables des conséquences de l'envoi à de mauvais destinataires fournis par vous, du contenu fourni par vous, ou des actes de vos clients.",
      ],
    },
    {
      heading: "Force majeure",
      body: [
        "Aucune partie n'est responsable d'un manquement causé par un événement échappant à son contrôle raisonnable : pannes des fournisseurs (Supabase, Vercel, Stripe, Twilio, Resend), événements climatiques, conflits, mesures gouvernementales, attaques informatiques de masse.",
      ],
    },
    {
      heading: "Loi applicable et règlement des différends",
      body: [
        "Ces conditions sont régies par les lois en vigueur dans la province de Québec et les lois fédérales canadiennes applicables, à l'exclusion des règles de conflit de lois.",
        "Pour les clients résidant au Canada, tout litige relève des tribunaux compétents du district judiciaire de Québec.",
        "Pour les clients résidant à l'extérieur du Canada, tout litige est soumis à un arbitrage simplifié à Québec, en français ou en anglais, selon les règles du Centre canadien d'arbitrage commercial (CCAC), à moins que le droit local impératif n'exige le for de votre résidence pour les litiges de consommation.",
        "Convention sur la vente internationale de marchandises (Vienne, 1980) : exclue.",
      ],
    },
    {
      heading: "Avis et communications",
      body: [
        "Nous vous écrivons à l'adresse courriel associée à votre compte. Vous nous écrivez à legal@dragun.app. Un avis est réputé reçu 24 heures après l'envoi.",
      ],
    },
    {
      heading: "Cession",
      body: [
        "Vous ne pouvez céder votre compte sans notre accord. Nous pouvons céder le contrat dans le cadre d'une fusion, acquisition ou réorganisation, à condition que le cessionnaire respecte ces conditions et la Politique de confidentialité.",
      ],
    },
    {
      heading: "Divisibilité et intégralité",
      body: [
        "Si une clause est invalide, le reste demeure en vigueur. Ces conditions, la Politique de confidentialité et les Divulgations forment l'entente complète entre vous et Dragun.",
      ],
    },
    {
      heading: "Modifications",
      body: [
        "Nous pouvons mettre à jour ces conditions. La date de prise d'effet ci-dessus est mise à jour à chaque révision. Les changements importants sont annoncés par courriel au moins 14 jours avant leur entrée en vigueur. La poursuite de l'utilisation après cette période vaut acceptation.",
      ],
    },
    {
      heading: "Nous joindre",
      body: [
        "Dragun, Inc. · Charlesbourg (Québec), Canada · legal@dragun.app",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Terms of Service",
  effectiveDate: "May 1, 2026",
  preamble:
    "Welcome to Dragun. These terms govern your use of the service offered by Dragun, Inc. (Charlesbourg, Québec, Canada). They apply whether your business is in Québec, elsewhere in Canada, or abroad. By creating an account, you agree to them. The French version controls if there is a conflict.",
  sections: [
    {
      heading: "The service",
      body: [
        "Dragun is a software-as-a-service (SaaS) tool that automates collection of unpaid invoices for small businesses, via email, SMS, and voice. You provide the debtor list; we run the cadence in your brand's voice and your customer's language.",
        "Dragun is not a collection agency, a law firm, or a financial advisor. You remain the creditor; we are your tool. No legal advice is provided.",
      ],
    },
    {
      heading: "Eligibility",
      body: [
        "You must be of legal age in your jurisdiction and represent a duly registered business. You may not use Dragun if you reside in a country subject to comprehensive Canadian, US, UK, or EU sanctions (including Cuba, North Korea, Iran, Syria, and the Crimea, Donetsk and Luhansk regions of Ukraine), or if you appear on a designated-persons list.",
      ],
    },
    {
      heading: "Pricing",
      body: [
        "No signup fee. No monthly minimum. You pay 5 % of the amount recovered, automatically deducted on each successful payment.",
        "For our first cohort of customers, settlement between Dragun and your business is handled manually by Interac or bank transfer, weekly, until Stripe Connect Express is in place.",
        "Applicable taxes (GST/QST in Québec, VAT in the EU/UK, other local taxes) are added when due.",
      ],
    },
    {
      heading: "Your responsibilities",
      body: [
        "Genuine debt: you confirm that the debtors you add genuinely owe you the amounts shown, that the debt is not disputed, and that you have the legal right to contact them at the email and phone provided.",
        "Consent: you comply with Canada's Anti-Spam Legislation (CASL), the GDPR and ePrivacy Directive in Europe, the UK PECR, the US TCPA, and any applicable law on commercial communications and consumer protection.",
        "Compliance: you comply with the acceptable-use rules of Twilio, Resend, and Stripe, and with local disclosure obligations (e.g., sender identification, SMS opt-out language, call recording where required).",
        "Prohibited use: harassment, threats, impersonation, false statements, usurious interest, debts already with a collection agency, disputed debts, debts arising from illegal activities.",
        "You indemnify Dragun against any claim from a debtor, vendor, or authority arising from a breach of these undertakings.",
      ],
    },
    {
      heading: "Our commitment",
      body: [
        "We operate the service with reasonable reliability efforts. We make no guarantee about recovery rates, uptime, or any specific outcome.",
        "We keep your data encrypted and accessible only to you and your team (see Privacy Policy).",
        "We publish material outages and our subprocessors in the Disclosures.",
      ],
    },
    {
      heading: "Suspension and termination",
      body: [
        "You can delete your account at any time from organization settings. Active campaigns stop immediately. Funds already collected are remitted to you on the regular schedule.",
        "We may suspend or terminate accounts that violate these terms, present a fraud risk, or threaten service integrity. We notify by email when reasonably possible.",
      ],
    },
    {
      heading: "Warranties and exclusions",
      body: [
        "The service is provided \"as is\" and \"as available\". To the extent permitted by law, we disclaim all implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
        "Nothing in these terms displaces non-waivable rights you have under Québec's Consumer Protection Act, EU Directive 2019/770 on digital content and services, the UK Consumer Rights Act, or any equivalent law. When you use Dragun for business purposes, those rights generally do not apply.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the extent permitted by law, Dragun's total liability to you, for any cause cumulated over a rolling 12-month period, is limited to the higher of (a) fees you paid us in the last twelve months, or (b) CAD 100.",
        "Indirect, incidental, and punitive damages, and loss of profits, data, goodwill, or business opportunity, are excluded.",
        "No limitation applies to fraud, willful misconduct, gross negligence, harm to life or physical integrity, or non-waivable consumer rights.",
        "We are not responsible for consequences of sending to wrong recipients you provided, content you provided, or your customers' actions.",
      ],
    },
    {
      heading: "Force majeure",
      body: [
        "Neither party is liable for a failure caused by an event beyond its reasonable control: vendor outages (Supabase, Vercel, Stripe, Twilio, Resend), weather events, conflict, government action, mass cyber attacks.",
      ],
    },
    {
      heading: "Governing law and dispute resolution",
      body: [
        "These terms are governed by the laws of the Province of Québec and the federal laws of Canada that apply, excluding conflict-of-laws rules.",
        "For customers resident in Canada, disputes fall under the competent courts of the judicial district of Québec.",
        "For customers resident outside Canada, disputes are submitted to expedited arbitration in Québec, in French or English, under the rules of the Canadian Commercial Arbitration Centre (CCAC), unless mandatory local law requires the consumer's home forum.",
        "United Nations Convention on Contracts for the International Sale of Goods (Vienna, 1980): excluded.",
      ],
    },
    {
      heading: "Notices",
      body: [
        "We write to the email associated with your account. You write to legal@dragun.app. A notice is deemed received 24 hours after sending.",
      ],
    },
    {
      heading: "Assignment",
      body: [
        "You may not assign your account without our consent. We may assign this contract in connection with a merger, acquisition, or reorganization, provided the assignee complies with these terms and the Privacy Policy.",
      ],
    },
    {
      heading: "Severability and entire agreement",
      body: [
        "If any clause is invalid, the rest remains in force. These terms, the Privacy Policy, and the Disclosures form the entire agreement between you and Dragun.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. The effective date above changes with every revision. Material changes are announced by email at least 14 days before they take effect. Continued use after that period is acceptance.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Dragun, Inc. · Charlesbourg, Québec, Canada · legal@dragun.app",
      ],
    },
  ],
};

export const termsDoc = { fr, en } as const;
