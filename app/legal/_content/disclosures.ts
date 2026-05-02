import type { LegalDoc } from "./types";

const fr: LegalDoc = {
  title: "Divulgations",
  effectiveDate: "1ᵉʳ mai 2026",
  preamble:
    "Cette page rassemble les divulgations qui n'entrent ni dans la Politique de confidentialité ni dans les Conditions d'utilisation, mais que nous voulons rendre visibles : ce que Dragun est et n'est pas, comment les communications sont encadrées selon votre marché, qui sont nos sous-traitants, et comment se règlent les questions de paiement et d'incidents. La version française fait foi.",
  sections: [
    {
      heading: "Ce que Dragun est et n'est pas",
      body: [
        "Dragun est un outil logiciel. Il automatise l'envoi de courriels, de SMS et d'appels vocaux que vous, propriétaire d'entreprise, adressez à vos propres clients en retard de paiement.",
        "Dragun n'est pas une agence de recouvrement de créances au sens de la Loi sur le recouvrement de certaines créances du Québec, de la Loi sur les agences de recouvrement de l'Ontario, ni du Fair Debt Collection Practices Act des États-Unis. Vous demeurez le créancier d'origine ; nous ne prenons jamais possession de la créance.",
        "Dragun n'est ni un cabinet d'avocats, ni un conseiller financier, ni un comptable. Aucune communication produite par Dragun ne constitue un avis juridique, fiscal ou financier.",
        "Dragun n'est pas un processeur de paiements. Les paiements sont traités par Stripe ; nous ne touchons jamais aux numéros de carte.",
      ],
    },
    {
      heading: "Communications par courriel",
      body: [
        "Au Canada, vous devez respecter la Loi canadienne anti-pourriel (LCAP, L.C. 2010, ch. 23) : consentement (exprès ou tacite documenté), identification de l'expéditeur, mécanisme de désabonnement fonctionnel pendant 60 jours. Dragun inclut automatiquement votre nom commercial et un lien de désabonnement dans chaque courriel.",
        "Aux États-Unis, vous devez respecter le CAN-SPAM Act (15 U.S.C. § 7701 et suivants) : objet non trompeur, adresse postale physique, désinscription en 10 jours.",
        "Dans l'Union européenne et au Royaume-Uni, vous devez respecter le RGPD, la directive ePrivacy (2002/58/CE) et le PECR : consentement préalable explicite pour la prospection ou base légale équivalente (par exemple, intérêt légitime documenté pour le recouvrement d'une dette pré-existante envers le même responsable).",
      ],
    },
    {
      heading: "Communications par SMS",
      body: [
        "Aux États-Unis, le Telephone Consumer Protection Act (TCPA, 47 U.S.C. § 227) exige un consentement écrit préalable pour les SMS automatisés à des fins commerciales. Le mot-clé STOP doit désinscrire immédiatement.",
        "Au Canada, la LCAP s'applique aussi aux SMS. Le CRTC peut imposer des amendes jusqu'à 10 millions $ CAD par infraction pour une entreprise.",
        "Dans l'UE/R.-U., consentement opt-in clair, granulaire, retirable. Les SMS sont enregistrés comme « communications électroniques non sollicitées » au sens du PECR.",
        "Dragun s'appuie sur Telnyx, qui exige un identifiant d'expéditeur enregistré (10DLC aux É.-U.) et fait respecter les listes de mots-clés de désinscription (STOP, ARRÊT, UNSUBSCRIBE) à l'échelle réseau.",
      ],
    },
    {
      heading: "Appels vocaux et enregistrement",
      body: [
        "Un appel automatisé exécuté par Dragun joue un message vocal préenregistré ou synthétisé par votre fournisseur Telnyx. Aucun appel n'est enregistré par Dragun.",
        "Si vous activez ailleurs un enregistrement de conversation : au Québec et dans le reste du Canada, le consentement d'au moins une partie suffit (article 184(2) du Code criminel) ; dans plusieurs États américains (Californie, Floride, Illinois, etc.) et dans l'UE, le consentement de toutes les parties est requis. Vous êtes responsable de divulguer l'enregistrement avant qu'il ne commence.",
        "Heures permises : au Canada, les SMS commerciaux et les appels automatisés sont restreints à 9 h – 21 h heure locale du destinataire (Règles sur les télécommunications non sollicitées, CRTC). Aux É.-U., 8 h – 21 h heure locale (TCPA). L'UE et le R.-U. interdisent les appels en dehors d'heures raisonnables et exigent l'identification de l'appelant.",
      ],
    },
    {
      heading: "Tarification et paiements",
      body: [
        "Frais de Dragun : 5 % du montant net récupéré, prélevés automatiquement à chaque paiement encaissé via Stripe.",
        "Aucun frais d'inscription, aucun minimum mensuel, aucune pénalité de résiliation.",
        "Frais Stripe : facturés en sus selon la grille publique de Stripe (typiquement 2,9 % + 0,30 $ CAD par transaction réussie au Canada).",
        "Devises : CAD, USD, EUR, GBP. La conversion est gérée par Stripe.",
        "Taxes : TPS/TVQ pour le Québec, TVA selon votre lieu d'établissement dans l'UE/R.-U., autres taxes locales selon votre juridiction. Les taxes sont ajoutées aux 5 %.",
        "Règlement entre Dragun et votre entreprise : actuellement manuel par Interac ou virement bancaire, hebdomadaire. Dès la mise en service de Stripe Connect Express, le règlement sera automatique au moment de la transaction.",
      ],
    },
    {
      heading: "Remboursements et différends",
      body: [
        "Si une transaction Stripe est contestée par un débiteur (« chargeback »), les frais de 5 % de Dragun ne sont pas remboursés ; les frais et la pénalité Stripe sont à votre charge en tant que créancier.",
        "Si vous croyez que Dragun a envoyé un message à un mauvais destinataire en raison d'un défaut de notre code (et non d'une donnée erronée que vous avez fournie), écrivez à support@dragun.app. Nous corrigeons et compensons les frais affectés.",
      ],
    },
    {
      heading: "Sous-traitants",
      body: [
        "Supabase Inc. — base de données PostgreSQL, authentification, stockage chiffré (États-Unis).",
        "Vercel Inc. — hébergement et exécution de l'application web (États-Unis et zones edge mondiales).",
        "Stripe Payments Canada, Ltd. et Stripe, Inc. — encaissement de paiements et reçus (Canada / États-Unis).",
        "Telnyx LLC — passerelle SMS et voix (États-Unis).",
        "Resend, Inc. — passerelle de courriel transactionnel (États-Unis).",
        "Anthropic PBC — modèle de langage utilisé pour générer la voix de marque, sans entraînement sur vos données (États-Unis).",
        "Toute modification importante de cette liste est annoncée par courriel au moins 30 jours avant son entrée en vigueur, conformément à l'article 28 du RGPD.",
      ],
    },
    {
      heading: "Disponibilité du service",
      body: [
        "Cible interne : 99,5 % de disponibilité mensuelle sur le tableau de bord propriétaire et la passerelle d'envoi.",
        "Le pré-règlement Stripe et la livraison de SMS dépendent de fournisseurs tiers ; nous publions toute interruption majeure à status.dragun.app dès que le diagnostic est confirmé.",
        "Aucun crédit de service automatique n'est offert pendant la phase de lancement. Un manquement répété et démontrable peut donner lieu à un remboursement discrétionnaire des frais de la période.",
      ],
    },
    {
      heading: "Statut bêta",
      body: [
        "Dragun est en phase de lancement. Certaines fonctionnalités sont libellées « bêta » dans le produit. Elles peuvent évoluer ou disparaître sans préavis. Nous ne facturons pas pour les fonctionnalités bêta tant qu'elles ne sont pas généralisées.",
      ],
    },
    {
      heading: "Marques et propriété intellectuelle",
      body: [
        "« Dragun », le mot-symbole et la flèche descendante sont des marques de commerce de Dragun, Inc. Vous conservez l'entière propriété de votre contenu, de votre liste de débiteurs, de votre voix de marque et de vos modèles de message. Vous nous accordez la licence limitée nécessaire à l'exécution du service.",
      ],
    },
    {
      heading: "Conformité et autorités compétentes",
      body: [
        "Vie privée : Commission d'accès à l'information du Québec ; Commissariat à la protection de la vie privée du Canada ; CNIL (France) ; ICO (Royaume-Uni) ; autorités équivalentes dans l'EEE et en Suisse ; Attorney General de Californie.",
        "Pratiques commerciales : Office de la protection du consommateur (Québec) ; Bureau de la concurrence (Canada) ; FTC (États-Unis) ; CMA (Royaume-Uni) ; autorités nationales de protection des consommateurs dans l'UE.",
        "Communications : CRTC (Canada) ; FCC (États-Unis) ; ICO (R.-U.) ; autorités nationales pour ePrivacy dans l'UE.",
      ],
    },
    {
      heading: "Nous joindre",
      body: [
        "Dragun, Inc. · Charlesbourg (Québec), Canada · hello@dragun.app · privacy@dragun.app · legal@dragun.app · security@dragun.app",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Disclosures",
  effectiveDate: "May 1, 2026",
  preamble:
    "This page collects the disclosures that don't fit in the Privacy Policy or the Terms of Service but that we want visible: what Dragun is and isn't, how communications are framed in each market, who our subprocessors are, and how payments and incidents are handled. The French version controls if there is a conflict.",
  sections: [
    {
      heading: "What Dragun is and isn't",
      body: [
        "Dragun is a software tool. It automates the email, SMS, and voice messages that you, a business owner, send to your own delinquent customers.",
        "Dragun is not a debt collection agency under Québec's Act respecting the collection of certain debts, Ontario's Collection and Debt Settlement Services Act, or the US Fair Debt Collection Practices Act. You remain the original creditor; we never take possession of the debt.",
        "Dragun is not a law firm, a financial advisor, or an accounting firm. Nothing produced by Dragun is legal, tax, or financial advice.",
        "Dragun is not a payment processor. Payments are handled by Stripe; we never touch card numbers.",
      ],
    },
    {
      heading: "Email communications",
      body: [
        "In Canada, you must comply with Canada's Anti-Spam Legislation (CASL, S.C. 2010, c. 23): consent (express or documented implied), sender identification, working unsubscribe valid for 60 days. Dragun automatically includes your trade name and an unsubscribe link in every email.",
        "In the United States, you must comply with the CAN-SPAM Act (15 U.S.C. § 7701 et seq.): truthful subject line, physical mailing address, opt-out honored within 10 days.",
        "In the European Union and United Kingdom, you must comply with the GDPR, the ePrivacy Directive (2002/58/EC) and PECR: prior explicit consent for marketing, or an equivalent legal basis (e.g., a documented legitimate interest for collecting a pre-existing debt owed to the same controller).",
      ],
    },
    {
      heading: "SMS communications",
      body: [
        "In the US, the Telephone Consumer Protection Act (TCPA, 47 U.S.C. § 227) requires prior written consent for automated commercial SMS. The keyword STOP must trigger immediate opt-out.",
        "In Canada, CASL also applies to SMS. The CRTC can issue penalties of up to CAD 10 million per breach for a business.",
        "In the EU/UK, opt-in must be clear, granular, withdrawable. SMS counts as \"unsolicited electronic communication\" under PECR.",
        "Dragun runs on Telnyx, which requires a registered sender ID (10DLC in the US) and enforces opt-out keyword lists (STOP, ARRÊT, UNSUBSCRIBE) network-wide.",
      ],
    },
    {
      heading: "Voice calls and recording",
      body: [
        "An automated call placed by Dragun plays a pre-recorded or synthesized voice message via your Telnyx account. No call is recorded by Dragun.",
        "If you enable call recording elsewhere: in Québec and the rest of Canada, one-party consent is sufficient (Criminal Code, s. 184(2)); in several US states (California, Florida, Illinois, etc.) and across the EU, all-party consent is required. You are responsible for disclosing the recording before it begins.",
        "Allowed hours: in Canada, commercial SMS and automated calls are restricted to 9 a.m. – 9 p.m. local time at the recipient's location (CRTC Unsolicited Telecommunications Rules). In the US, 8 a.m. – 9 p.m. local (TCPA). The EU and UK prohibit calls outside reasonable hours and require caller identification.",
      ],
    },
    {
      heading: "Pricing and payments",
      body: [
        "Dragun fee: 5 % of the net amount recovered, automatically deducted on each payment collected via Stripe.",
        "No signup fee, no monthly minimum, no termination penalty.",
        "Stripe fees: charged in addition, per Stripe's public schedule (typically 2.9 % + CAD 0.30 per successful transaction in Canada).",
        "Currencies: CAD, USD, EUR, GBP. Conversion is handled by Stripe.",
        "Taxes: GST/QST for Québec, VAT based on your place of establishment in the EU/UK, other local taxes as applicable. Taxes are added on top of the 5 %.",
        "Settlement between Dragun and your business: currently manual via Interac or bank transfer, weekly. Once Stripe Connect Express is live, settlement will be automatic at transaction time.",
      ],
    },
    {
      heading: "Refunds and disputes",
      body: [
        "If a Stripe transaction is disputed by a debtor (\"chargeback\"), Dragun's 5 % fee is not refunded; Stripe's fees and chargeback fee are borne by you as the creditor.",
        "If you believe Dragun sent a message to the wrong recipient because of a defect in our code (not because of bad data you provided), write to support@dragun.app. We fix it and compensate the affected fees.",
      ],
    },
    {
      heading: "Subprocessors",
      body: [
        "Supabase Inc. — PostgreSQL database, auth, encrypted storage (United States).",
        "Vercel Inc. — web app hosting and execution (United States and global edge regions).",
        "Stripe Payments Canada, Ltd. and Stripe, Inc. — payment collection and receipts (Canada / United States).",
        "Telnyx LLC — SMS and voice gateway (United States).",
        "Resend, Inc. — transactional email gateway (United States).",
        "Anthropic PBC — language model used to generate brand voice, without training on your data (United States).",
        "Material changes to this list are announced by email at least 30 days in advance, in line with GDPR art. 28.",
      ],
    },
    {
      heading: "Service availability",
      body: [
        "Internal target: 99.5 % monthly availability on the owner dashboard and the send pipeline.",
        "Stripe payment intents and SMS delivery depend on third parties; we publish material outages at status.dragun.app once the diagnosis is confirmed.",
        "No automatic service credit is offered during the launch phase. Repeated and demonstrable failure may give rise to a discretionary refund of fees for the affected period.",
      ],
    },
    {
      heading: "Beta status",
      body: [
        "Dragun is in launch phase. Some features are labeled \"beta\" in the product. They may evolve or disappear without notice. We do not charge for beta features until they reach general availability.",
      ],
    },
    {
      heading: "Trademarks and IP",
      body: [
        "\"Dragun\", the wordmark, and the downward arrow are trademarks of Dragun, Inc. You retain full ownership of your content, debtor list, brand voice, and message templates. You grant us the limited license needed to run the service.",
      ],
    },
    {
      heading: "Compliance and competent authorities",
      body: [
        "Privacy: Commission d'accès à l'information du Québec; Office of the Privacy Commissioner of Canada; CNIL (France); ICO (United Kingdom); equivalent authorities in the EEA and Switzerland; California Attorney General.",
        "Commercial practices: Office de la protection du consommateur (Québec); Competition Bureau (Canada); FTC (United States); CMA (United Kingdom); national consumer-protection authorities in the EU.",
        "Communications: CRTC (Canada); FCC (United States); ICO (UK); national ePrivacy authorities in the EU.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Dragun, Inc. · Charlesbourg, Québec, Canada · hello@dragun.app · privacy@dragun.app · legal@dragun.app · security@dragun.app",
      ],
    },
  ],
};

export const disclosuresDoc = { fr, en } as const;
