import Link from "next/link";
import { GoogleButton } from "./_components/google-button";
import { LocaleToggle } from "./_components/locale-toggle";
import { Reveal } from "./_components/reveal";
import { Wick } from "./_components/wick";
import { CountUp } from "./_components/count-up";
import { PricingSection } from "./_components/pricing-section";
import { DragunLogo } from "./_components/logo";
import { createClient } from "./_lib/supabase/server";
import { signOut } from "./_actions/auth";
import { getLocale } from "./_lib/i18n";

/* ────────────────────────────────────────────────────────── */
/*  Bilingual landing copy                                    */
/* ────────────────────────────────────────────────────────── */

const COPY = {
  fr: {
    topBar: {
      online: "En ligne · 30·04·2026",
      forSmb: "Pour les PME",
      hours: "Heures de rappel · 08 h–20 h 59 (heure locale)",
      pricing: "Gratuit · 5 % sur le récupéré",
      builtIn: "Conçu au Québec",
    },
    nav: {
      tagline: "™ · Encaisser",
      howItWorks: "Comment ça marche",
      compliance: "Conformité",
      pricing: "Tarifs",
      investors: "Investisseurs",
      howShort: "Comment",
      complianceShort: "Conformité",
      startShort: "Commencer",
      startFree: "Commencer gratuitement",
      signIn: "Connexion",
      dashboard: "Tableau de bord",
      signOut: "Déconnexion",
    },
    hero: {
      tagline: "Relance amicale pour les PME · Fondé en 2026",
      titleLine1: "Encaissez à temps.",
      titleLine2: "Restez en bons termes.",
      body: "Dragun est le bureau qui relance vos factures impayées — par texto, courriel et un agent vocal amical — pour que vous gardiez le client et soyez payé. Vous tenez la boutique. Nous gérons le moment gênant.",
      ctaPrimary: "Commencer gratuitement",
      ctaSecondaryAuthed: "Ouvrir le tableau de bord",
      ctaSecondaryUnauth: "Commencer gratuitement",
      ctaMicro: "Sans carte de crédit · 5 min · Annulez à tout moment",
      asideLabel: "Dragun · Coup d'œil",
      asideLive: "En ligne",
      asideHead1: "Une boîte.",
      asideHead2: "Trois canaux.",
      asideSubline: "Gratuit · 5 % uniquement sur le récupéré",
      asideKChannels: "Canaux",
      asideKCampaign: "Campagne",
      asideKPricing: "Tarif",
      asideArc: "Arc des canaux",
      asideEmail: "Courriel",
      asideSms: "Texto",
      asideVoice: "Voix",
      asideBuiltOn: "Conçu avec · Twilio · Resend · Agent vocal Dragun",
    },
    problem: {
      label: "I. La math du paiement",
      introA: "La facture n'est pas le problème.",
      introB: "C'est la relance.",
      headlinePrefix: "des factures de PME",
      headlineMid: "dépassent trente jours. Au quatre-vingt-dixième jour, seulement",
      headlineSuffix: "sur le dollar reviennent.",
      bigStat: "42 %",
      bigStat2: "12 ¢",
      bigStatNum: 42,
      bigStatSuffix: " %",
      bigStat2Num: 12,
      bigStat2Suffix: " ¢",
      stat1Big: "825 G$",
      stat1Label: "Factures impayées détenues par les PME nord-américaines",
      stat2Big: "31 h / mois",
      stat2Label: "Temps consacré aux relances par un propriétaire moyen",
      stat3Big: "1 sur 6",
      stat3Label: "Factures radiées avant la troisième année",
    },
    channels: {
      label: "II. Trois canaux amicaux",
      title: "Trois canaux, un rythme, une boîte.",
      sub: "Chaque client vous entend de la même façon — gentiment. La cadence est automatique, sensible aux heures, ajustée à votre secteur.",
      windowLabel: "Fenêtre",
      cards: [
        {
          roman: "Ⅰ.",
          name: "Texto",
          vendor: "Twilio",
          window: "Jour 0 · 3",
          cadence: "2 relances",
          voice: "Court, doux, signé de votre marque. Lien de paiement en un clic.",
          detail: [
            "10DLC enregistré, A2P pré-validé",
            "Heures calmes selon le fuseau du client",
            "STOP / AIDE entrants gérés",
          ],
        },
        {
          roman: "Ⅱ.",
          name: "Courriel",
          vendor: "Resend",
          window: "Jour 7",
          cadence: "1 rappel formel",
          voice: "Chaleureux, transactionnel, dans la voix de votre marque.",
          detail: [
            "Alignement DKIM, SPF et DMARC",
            "Réponses regroupées vers votre équipe",
            "Trace écrite pour votre dossier",
          ],
        },
        {
          roman: "Ⅲ.",
          name: "Voix",
          vendor: "Agent Dragun",
          window: "Jour 14 → 27",
          cadence: "Jusqu'à 3 appels",
          voice: "Un agent amical. Écoute, aide, laisse une trace claire.",
          detail: [
            "Enregistrement et transcriptions en direct",
            "Appels uniquement durant les heures ouvrables locales",
            "Transfert à un humain au bon moment",
          ],
        },
      ],
    },
    mechanism: {
      label: "III. Le rythme de trente jours",
      title: "Un rythme. Début amical, rappels doux, fin polie.",
      body: "Les rappels se déroulent automatiquement entre texto, courriel et voix. Vous voyez chaque action dans un seul registre ; vos clients entendent une seule voix, cohérente et amicale.",
      laneLabel: "Voie",
      laneEmail: "Courriel",
      laneSms: "Texto",
      laneVoice: "Voix",
      vendorEmail: "Resend",
      vendorSms: "Twilio",
      vendorVoice: "Agent",
      outcomeLabel: "Résultat",
      outcomePayLink: "Lien de paiement · J0",
      outcomeRhythm: "Rythme · 30 j",
      outcomeHandoff: "Transfert si > J27",
    },
    compliance: {
      label: "V. Conçu avec soin",
      titleLine1: "Amical avec vos clients.",
      titleLine2: "Honnête avec les règles.",
      body: "Le respect du client n'est pas une option ajoutée. C'est la façon dont chaque rappel est rédigé, planifié et envoyé.",
      items: [
        {
          k: "TCPA / LCAP",
          tag: "Intégré",
          l: "Appels et textos respectent les heures locales du client. Désinscriptions traitées immédiatement. Trace de consentement par facture.",
        },
        {
          k: "Ton et fréquence",
          tag: "Intégré",
          l: "Plafonds raisonnables, identité claire dans chaque message, ton de petite entreprise — pour garder vos clients, pas les acculer.",
        },
        {
          k: "10DLC / A2P",
          tag: "En traitement",
          l: "Enregistrement marque + campagne en cours auprès de Twilio. Trafic actuel limité aux numéros vérifiés ; filtrage des opérateurs minimisé après approbation.",
        },
        {
          k: "SOC 2",
          tag: "Planifié",
          l: "Programme aligné AICPA TSC. Engagement d'audit Type I prévu post-lancement. Journal d'audit administratif activé, conservé douze mois.",
        },
      ],
    },
    distribution: {
      label: "IV. Pour commencer",
      titleLine1: "Gratuit pour démarrer.",
      titleLine2: "Vous payez seulement ce qu'on récupère.",
      body1:
        "Inscrivez-vous sur dragun.app, nommez votre entreprise, collez votre liste de clients en retard, et une cadence de 14 jours démarre dans la voix de votre marque. Aucun appel commercial, aucun gardien, aucun frais mensuel.",
      body2:
        "Forfait fixe de 5 % sur ce qui est encaissé. Annulez à tout moment. Votre registre vous appartient, toujours. On gagne uniquement quand vous gagnez.",
      stats: [
        { k: "Onboarding", v: "Autonome", d: "5 minutes" },
        { k: "Langues", v: "FR · EN", d: "Dès le départ" },
        { k: "Tarif", v: "5 %", d: "Du payé, fixe" },
      ],
      timeline: [
        ["J0", "Inscrivez-vous · configurez votre entreprise en 5 min"],
        ["J0", "Ajoutez un client ou téléversez votre liste CSV"],
        ["J0", "Le premier texto amical part le jour même"],
        ["J14+", "L'agent vocal entre en jeu à mesure que la facture vieillit"],
      ],
      formLabel: "Commencer",
      formTitleA: "Lancez votre registre",
      formTitleB: "sur Dragun.",
      formBody:
        "Aucun appel commercial. Aucune liste d'attente. Connectez-vous et l'assistant d'onboarding vous mène d'un compte vide à votre premier rappel en moins de dix minutes.",
      bullets: [
        "5 % fixe sur le payé. Rien d'autre.",
        "Bilingue FR · EN dès le départ.",
        "Annulez quand vous voulez. Le registre vous appartient.",
      ],
    },
    auth: {
      authedLabel: "Connecté",
      authedTitle: (name: string | null) =>
        name ? `Bon retour, ${name}.` : "Bon retour.",
      authedSub:
        "Votre tableau de bord est prêt. Ajoutez un client une fois, ou téléversez votre liste de clients en retard en CSV.",
      ctaDashboard: "Ouvrir le tableau de bord",
      ctaImport: "Importer des clients",
      unauthLabel: "Une étape. Pas de long formulaire.",
      unauthTitle: "Commencez en deux clics.",
      unauthSub:
        "Continuez avec Google, ou avec courriel et mot de passe. Votre tableau de bord est prêt dès la connexion.",
      googleCta: "Continuer avec Google",
      emailCta: "Utiliser le courriel",
      already: "Déjà membre ?",
      alreadyLink: "Connexion →",
    },
    investor: {
      label: "VII. Levée en cours",
      titleLine1: "Le bureau qui",
      titleLine2: "vous fait payer.",
      body:
        "Nous bouclons une ronde pré-amorçage pour étendre l'agent vocal et le maillage de conformité. La data room — économies unitaires, plan de mise en marché, posture de conformité — est disponible sur demande aux investisseurs qualifiés.",
      investorEmail: "investors@dragun.app",
      investorMicro: "Pré-amorçage · SAFE · Investisseurs qualifiés QC + É.-U.",
      foundersLink: "Parler à un fondateur",
      cardLabel: "Ronde · Pré-amorçage",
      cardOpen: "Ouverte",
      kStage: "Stade",
      vStage: "Pré-amorçage",
      kVehicle: "Instrument",
      vVehicle: "SAFE",
      kUse: "Usage",
      vUse: "Agent vocal · Conformité · Croissance",
      kGeo: "Géographie",
      vGeo: "Québec · États-Unis d'abord",
      footnote:
        "Le mémo couvre les économies unitaires, la conception des canaux, la posture réglementaire, le plan de mise en marché et l'équipe.",
    },
    footer: {
      blurb:
        "Le bureau amical pour vous faire payer. Texto, courriel et voix — un rythme, un registre, un dépôt bancaire.",
      platform: "Plateforme",
      contact: "Contact",
      howItWorks: "Comment ça marche",
      compliance: "Conformité",
      pricing: "Tarifs",
      investors: "Investisseurs",
      founders: "Fondateurs",
      owners: "Propriétaires",
      copyright: "© 2026 Dragun, Inc. · Tous droits réservés",
      tagline: "Conçu au Québec · Pour les PME",
      privacy: "Confidentialité",
      terms: "Conditions",
      disclosures: "Divulgations",
      security: "Sécurité",
    },
  },
  en: {
    topBar: {
      online: "Online · 04·30·2026",
      forSmb: "For small businesses",
      hours: "Reminder hours · 08:00–20:59 local",
      pricing: "Free to start · 5% on recovered",
      builtIn: "Built in Québec",
    },
    nav: {
      tagline: "™ · Get paid",
      howItWorks: "How it works",
      compliance: "Compliance",
      pricing: "Pricing",
      investors: "Investors",
      howShort: "How",
      complianceShort: "Compliance",
      startShort: "Start",
      startFree: "Start free",
      signIn: "Sign in",
      dashboard: "Dashboard",
      signOut: "Sign out",
    },
    hero: {
      tagline: "Friendly invoice follow-up for small businesses · Est. 2026",
      titleLine1: "Get paid on time.",
      titleLine2: "Stay friends.",
      body: "Dragun is the back-office that follows up on your unpaid invoices — across SMS, email and a friendly voice agent — so you keep the customer and still get paid. You run the shop. We handle the awkward part.",
      ctaPrimary: "Start free",
      ctaSecondaryAuthed: "Open dashboard",
      ctaSecondaryUnauth: "Start free",
      ctaMicro: "No credit card · 5 min onboarding · Cancel anytime",
      asideLabel: "Dragun · At a glance",
      asideLive: "Live",
      asideHead1: "One inbox.",
      asideHead2: "Three channels.",
      asideSubline: "Free to start · 5% only on recovered",
      asideKChannels: "Channels",
      asideKCampaign: "Campaign",
      asideKPricing: "Pricing",
      asideArc: "Channel arc",
      asideEmail: "Email",
      asideSms: "SMS",
      asideVoice: "Voice",
      asideBuiltOn: "Built on · Twilio · Resend · Dragun voice agent",
    },
    problem: {
      label: "I. The math of getting paid",
      introA: "The invoice isn't the problem.",
      introB: "The follow-up is.",
      headlinePrefix: "of small-business invoices",
      headlineMid: "go past thirty days. By day ninety, only",
      headlineSuffix: "on the dollar comes back.",
      bigStat: "42%",
      bigStat2: "12¢",
      bigStatNum: 42,
      bigStatSuffix: "%",
      bigStat2Num: 12,
      bigStat2Suffix: "¢",
      stat1Big: "$825B",
      stat1Label: "Outstanding invoices held by US small businesses",
      stat2Big: "31 hrs / mo",
      stat2Label: "A typical owner spends sending reminders",
      stat3Big: "1 in 6",
      stat3Label: "Invoices written off by year three",
    },
    channels: {
      label: "II. Three friendly channels",
      title: "Three channels, one rhythm, one inbox.",
      sub: "Every customer hears from you the same way — kindly. The cadence is automatic, hours-aware, and tuned to your industry.",
      windowLabel: "Window",
      cards: [
        {
          roman: "Ⅰ.",
          name: "SMS",
          vendor: "Twilio",
          window: "Day 0 · 3",
          cadence: "2 nudges",
          voice: "Short, kind, branded. Pay link in one tap.",
          detail: [
            "10DLC registered, A2P 10DLC pre-cleared",
            "Quiet hours by your customer's timezone",
            "Inbound STOP / HELP handled",
          ],
        },
        {
          roman: "Ⅱ.",
          name: "Email",
          vendor: "Resend",
          window: "Day 7",
          cadence: "1 formal reminder",
          voice: "Warm, transactional, written in your brand voice.",
          detail: [
            "DKIM, SPF & DMARC alignment",
            "Threaded replies routed to your team",
            "A written record for your file",
          ],
        },
        {
          roman: "Ⅲ.",
          name: "Voice",
          vendor: "Dragun agent",
          window: "Day 14 → 27",
          cadence: "Up to 3 calls",
          voice: "A friendly agent. Listens, helps, leaves a clear record.",
          detail: [
            "Real-time call recording & transcripts",
            "Calls only during local business hours",
            "Hands off to a human at the right cue",
          ],
        },
      ],
    },
    mechanism: {
      label: "III. The thirty-day rhythm",
      title: "One rhythm. Friendly start, gentle reminders, polite finish.",
      body: "Reminders unfold automatically across SMS, email and voice. You see every touch in a single ledger; your customers hear one consistent, friendly tone.",
      laneLabel: "Lane",
      laneEmail: "Email",
      laneSms: "SMS",
      laneVoice: "Voice",
      vendorEmail: "Resend",
      vendorSms: "Twilio",
      vendorVoice: "Agent",
      outcomeLabel: "Outcome",
      outcomePayLink: "Pay link · Day 0",
      outcomeRhythm: "Rhythm · 30d",
      outcomeHandoff: "Hand-off if > D27",
    },
    compliance: {
      label: "V. Built thoughtfully",
      titleLine1: "Friendly with your customers.",
      titleLine2: "Honest with the rules.",
      body: "Customer respect isn't a feature bolted on. It's how every reminder is written, scheduled, and sent.",
      items: [
        {
          k: "TCPA / CASL",
          tag: "Built in",
          l: "Calls and texts respect your customer's local hours. Opt-outs honored instantly. Consent records kept per invoice.",
        },
        {
          k: "Tone & frequency",
          tag: "Built in",
          l: "Sensible frequency caps, clear identity in every message, and a small-business tone — designed to keep customers, not to corner them.",
        },
        {
          k: "10DLC / A2P",
          tag: "In review",
          l: "Brand and campaign registration in progress with Twilio. Current traffic limited to verified numbers; carrier filtering minimised once approval lands.",
        },
        {
          k: "SOC 2",
          tag: "Planned",
          l: "Program aligned to AICPA TSC. Type I audit engagement scheduled post-launch. Administrative-action audit log live, retained twelve months.",
        },
      ],
    },
    distribution: {
      label: "IV. Getting started",
      titleLine1: "Free to start.",
      titleLine2: "Pay only on what we recover.",
      body1:
        "Sign up at dragun.app, name your business, paste in your delinquent list, and a 14-day cadence kicks off in your brand voice. No sales calls, no gatekeeping, no monthly fee.",
      body2:
        "Flat 5 % on what gets paid. Cancel any time. Your ledger is yours, always. We only earn when you do.",
      stats: [
        { k: "Onboarding", v: "Self-serve", d: "5 minutes" },
        { k: "Languages", v: "FR · EN", d: "From day one" },
        { k: "Pricing", v: "5%", d: "Of paid, flat" },
      ],
      timeline: [
        ["D0", "Sign up · onboard your business in 5 minutes"],
        ["D0", "Add a customer or upload your list as CSV"],
        ["D0", "First friendly text goes out the same day"],
        ["D14+", "Voice agent joins in as invoices age"],
      ],
      formLabel: "Start free",
      formTitleA: "Run your ledger",
      formTitleB: "on Dragun.",
      formBody:
        "No sales calls. No waiting list. Sign in and the onboarding wizard gets you from a fresh account to your first reminder in under ten minutes.",
      bullets: [
        "Flat 5% on what gets paid. Nothing else.",
        "Bilingual EN · FR from day one.",
        "Cancel any time. Your ledger is yours.",
      ],
    },
    auth: {
      authedLabel: "Signed in",
      authedTitle: (name: string | null) =>
        name ? `Welcome back, ${name}.` : "Welcome back.",
      authedSub:
        "Your dashboard is ready. Add a customer one at a time, or upload your delinquent list as a CSV.",
      ctaDashboard: "Open dashboard",
      ctaImport: "Import customers",
      unauthLabel: "One step. No long form.",
      unauthTitle: "Get started in two clicks.",
      unauthSub:
        "Continue with Google, or use email and password. Your dashboard is ready the moment you sign in.",
      googleCta: "Continue with Google",
      emailCta: "Use email instead",
      already: "Already a member?",
      alreadyLink: "Sign in →",
    },
    investor: {
      label: "VII. Now raising",
      titleLine1: "The back-office for",
      titleLine2: "getting paid.",
      body:
        "We're closing a pre-seed round to extend the voice agent and the compliance lattice. The data room — including unit economics, the go-to-market plan, and our compliance posture — is available on request to qualified investors.",
      investorEmail: "investors@dragun.app",
      investorMicro: "Pre-seed · SAFE · QC + US qualified investors",
      foundersLink: "Talk to a founder",
      cardLabel: "Round · Pre-seed",
      cardOpen: "Open",
      kStage: "Stage",
      vStage: "Pre-seed",
      kVehicle: "Vehicle",
      vVehicle: "SAFE",
      kUse: "Use",
      vUse: "Voice agent · Compliance · Growth",
      kGeo: "Geography",
      vGeo: "Québec · US first",
      footnote:
        "Memo includes unit economics, channel design, regulatory posture, go-to-market plan, and team profile.",
    },
    footer: {
      blurb:
        "The friendly back-office for getting paid. SMS, email and voice — one rhythm, one ledger, one bank deposit.",
      platform: "Platform",
      contact: "Contact",
      howItWorks: "How it works",
      compliance: "Compliance",
      pricing: "Pricing",
      investors: "Investors",
      founders: "Founders",
      owners: "Owners",
      copyright: "© 2026 Dragun, Inc. · All rights reserved",
      tagline: "Built in Québec · For small businesses",
      privacy: "Privacy",
      terms: "Terms",
      disclosures: "Disclosures",
      security: "Security",
    },
  },
};

type Copy = (typeof COPY)["fr"];

/* ────────────────────────────────────────────────────────── */
/*  Page                                                      */
/* ────────────────────────────────────────────────────────── */

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    displayName =
      profile?.full_name ||
      (user.user_metadata?.full_name as string | undefined) ||
      (user.email ? user.email.split("@")[0] : null);
  }

  const locale = await getLocale();
  const c = COPY[locale];

  return (
    <main className="relative overflow-x-hidden">
      <TopBar c={c} />
      <Nav c={c} user={user ? { name: displayName, email: user.email ?? null } : null} />
      <Hero c={c} authed={Boolean(user)} />
      <Problem c={c} />
      <Channels c={c} />
      <Mechanism c={c} />
      <Compliance c={c} />
      <PricingSection locale={locale} authed={Boolean(user)} />
      <Distribution c={c} authed={Boolean(user)} displayName={displayName} />
      <Investor c={c} />
      <Footer c={c} />
    </main>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Brand mark                                                */
/* ────────────────────────────────────────────────────────── */


/* ────────────────────────────────────────────────────────── */
/*  Top status bar                                            */
/* ────────────────────────────────────────────────────────── */

function TopBar({ c }: { c: Copy }) {
  return (
    <div className="border-b border-line bg-ink-1/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span>{c.topBar.online}</span>
          <span className="hidden md:inline">{c.topBar.forSmb}</span>
          <span className="hidden lg:inline">{c.topBar.hours}</span>
        </div>
        <div className="flex items-center gap-x-6 gap-y-1">
          <span className="hidden sm:flex items-center gap-2">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
            <span className="text-bone-2">{c.topBar.pricing}</span>
          </span>
          <span>{c.topBar.builtIn}</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Nav                                                       */
/* ────────────────────────────────────────────────────────── */

function Nav({
  c,
  user,
}: {
  c: Copy;
  user: { name: string | null; email: string | null } | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <a href="#" className="text-bone">
          <DragunLogo
            className="h-5 w-5"
            wordmarkClassName="text-lg sm:text-xl"
            tagline={c.nav.tagline}
          />
        </a>
        <ul className="hidden lg:flex items-center gap-5 xl:gap-8 font-mono text-[12px] xl:text-sm uppercase tracking-[0.18em] text-bone-2">
          <li><a href="#mechanism" className="link-rule hover:text-bone">{c.nav.howItWorks}</a></li>
          <li><a href="#compliance" className="link-rule hover:text-bone">{c.nav.compliance}</a></li>
          <li><a href="#pricing" className="link-rule hover:text-bone">{c.nav.pricing}</a></li>
          <li><a href="#investor" className="link-rule hover:text-bone">{c.nav.investors}</a></li>
        </ul>
        <ul className="hidden md:flex lg:hidden items-center gap-5 font-mono text-[12px] uppercase tracking-[0.18em] text-bone-2">
          <li><a href="#mechanism" className="link-rule hover:text-bone">{c.nav.howShort}</a></li>
          <li><a href="#compliance" className="link-rule hover:text-bone">{c.nav.complianceShort}</a></li>
          <li><a href="#start" className="link-rule hover:text-bone">{c.nav.startShort}</a></li>
        </ul>
        <Link
          href="/auth/sign-up"
          className="group inline-flex md:hidden items-center gap-2 border border-ember px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember"
        >
          {c.nav.startFree}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <LocaleToggle />
            <Link
              href="/app"
              className="font-mono text-[11px] lg:text-xs uppercase tracking-[0.2em] text-bone-2 hover:text-bone whitespace-nowrap"
            >
              {user.name ?? c.nav.dashboard}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="font-mono text-[11px] lg:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone whitespace-nowrap"
              >
                {c.nav.signOut}
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <LocaleToggle />
            <Link
              href="/auth/sign-in"
              className="font-mono text-[11px] lg:text-xs uppercase tracking-[0.2em] text-bone-3 hover:text-bone whitespace-nowrap"
            >
              {c.nav.signIn}
            </Link>
            <Link
              href="/auth/sign-up"
              className="group inline-flex items-center gap-2 border border-bone/70 px-3 lg:px-4 py-2 font-mono text-[11px] lg:text-xs uppercase tracking-[0.2em] text-bone hover:border-ember hover:text-ember transition-colors whitespace-nowrap"
            >
              {c.nav.startFree}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero                                                      */
/* ────────────────────────────────────────────────────────── */

function Hero({ c, authed }: { c: Copy; authed: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="ember-floor" aria-hidden />
      <div className="scanline" aria-hidden />
      <div className="scanline delay" aria-hidden />

      {/* faint grid */}
      <div
        aria-hidden
        className="grid-faint pointer-events-none absolute inset-0 opacity-[0.06]"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pt-24 pb-32 md:pt-32 md:pb-44">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="rise font-mono text-xs sm:text-sm uppercase tracking-[0.28em] sm:tracking-[0.32em] text-bone-3">
              <span className="text-ember">●</span>&nbsp;&nbsp;{c.hero.tagline}
            </p>
            <h1
              className="rise kern-display font-display mt-8 text-[clamp(2.6rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-bone break-words"
              style={{ animationDelay: "0.08s" }}
            >
              {c.hero.titleLine1}
              <br />
              <em className="italic text-bone-2">{c.hero.titleLine2}</em>
            </h1>
            <p
              className="rise mt-10 max-w-[44ch] text-base sm:text-lg leading-[1.55] text-bone-2 md:text-xl"
              style={{ animationDelay: "0.18s" }}
            >
              {c.hero.body}
            </p>

            <div
              className="rise mt-10 sm:mt-12 flex flex-wrap items-center gap-3 sm:gap-4"
              style={{ animationDelay: "0.28s" }}
            >
              <Link
                href="/auth/sign-up"
                className="cta-primary group inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink hover:bg-ember-hot"
              >
                {c.hero.ctaPrimary}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={authed ? "/app" : "/auth/sign-up"}
                className="group inline-flex items-center gap-3 border border-bone/30 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 hover:border-ember hover:text-ember transition-colors"
              >
                {authed ? c.hero.ctaSecondaryAuthed : c.hero.ctaSecondaryUnauth}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
            <p
              className="rise mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3"
              style={{ animationDelay: "0.36s" }}
            >
              {c.hero.ctaMicro}
            </p>
          </div>

          {/* At-a-glance card */}
          <aside
            className="rise lg:col-span-4 lg:mt-2 self-start"
            style={{ animationDelay: "0.42s" }}
          >
            <div className="border border-line bg-ink-1/70 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
                <span>{c.hero.asideLabel}</span>
                <span className="flex items-center gap-2 text-ember">
                  <span className="pulse h-1.5 w-1.5 rounded-full bg-ember" />
                  {c.hero.asideLive}
                </span>
              </div>
              <div className="px-5 py-7">
                <div className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.96] tracking-tight text-bone break-words">
                  {c.hero.asideHead1}
                  <br />
                  <em className="text-bone-2">{c.hero.asideHead2}</em>
                </div>
                <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3">
                  {c.hero.asideSubline}
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-line">
                {[
                  { k: c.hero.asideKChannels, v: "3" },
                  { k: c.hero.asideKCampaign, v: "30d" },
                  { k: c.hero.asideKPricing, v: "5%" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="border-r border-line px-4 py-4 last:border-r-0"
                  >
                    <div className="num font-display text-2xl text-bone">{s.v}</div>
                    <div className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line px-5 py-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-bone-3">
                  {c.hero.asideArc}
                </div>
                <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-[1px] bg-ink-3">
                  <span className="h-full bg-ember" style={{ width: "33.33%" }} />
                  <span className="h-full bg-bone" style={{ width: "33.33%" }} />
                  <span className="h-full bg-moss" style={{ width: "33.34%" }} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                  <span>{c.hero.asideSms}</span>
                  <span>{c.hero.asideEmail}</span>
                  <span>{c.hero.asideVoice}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
              {c.hero.asideBuiltOn}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Problem                                                   */
/* ────────────────────────────────────────────────────────── */

function Problem({ c }: { c: Copy }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-44">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Wick />
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.problem.label}
            </p>
            <p className="mt-6 font-display text-2xl sm:text-3xl leading-tight text-bone-2">
              {c.problem.introA}
              <br />
              <em>{c.problem.introB}</em>
            </p>
          </Reveal>
          <div className="lg:col-span-8 lg:pl-12">
            <p className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[1.08] tracking-tight text-bone break-words">
              <span className="italic text-ember">
                <CountUp to={c.problem.bigStatNum} suffix={c.problem.bigStatSuffix} />
              </span>{" "}
              {c.problem.headlinePrefix} {c.problem.headlineMid}{" "}
              <span className="italic text-ember">
                <CountUp to={c.problem.bigStat2Num} suffix={c.problem.bigStat2Suffix} />
              </span>{" "}
              {c.problem.headlineSuffix}
            </p>
            <div className="mt-10 sm:mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                { k: c.problem.stat1Big, l: c.problem.stat1Label },
                { k: c.problem.stat2Big, l: c.problem.stat2Label },
                { k: c.problem.stat3Big, l: c.problem.stat3Label },
              ].map((d) => (
                <div key={d.k}>
                  <div className="num font-display text-3xl sm:text-4xl text-bone break-words">
                    {d.k}
                  </div>
                  <div className="mt-2 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-3">
                    {d.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Channels — Resend, Twilio, Voice                          */
/* ────────────────────────────────────────────────────────── */

function Channels({ c }: { c: Copy }) {
  return (
    <section
      id="channels"
      className="seam-top relative bg-ink-1/30"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Wick />
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.channels.label}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              {c.channels.title}
            </h2>
          </div>
          <p className="max-w-md font-sans text-bone-2">{c.channels.sub}</p>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid gap-px bg-line border border-line md:grid-cols-3">
          {c.channels.cards.map((card) => (
            <article
              key={card.name}
              className="card-lift group relative bg-ink p-6 sm:p-8 hover:bg-ink-1"
            >
              <div className="flex items-baseline justify-between font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
                <span>{card.roman} {card.name}</span>
                <span>{card.vendor}</span>
              </div>
              <h3 className="mt-5 sm:mt-6 font-display text-4xl sm:text-5xl tracking-tight text-bone">
                {card.name}
              </h3>
              <p className="mt-4 max-w-[34ch] text-bone-2 text-sm sm:text-base">{card.voice}</p>

              <ul className="mt-7 sm:mt-8 space-y-2 border-t border-line pt-5 text-sm text-bone-2">
                {card.detail.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 h-px w-3 shrink-0 bg-bone-3" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-end justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-3">
                <span>{c.channels.windowLabel} {card.window}</span>
                <span>{card.cadence}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Mechanism — 30 day campaign timeline                      */
/* ────────────────────────────────────────────────────────── */

function Mechanism({ c }: { c: Copy }) {
  const days = 30;
  const lanes = [
    {
      name: c.mechanism.laneSms,
      vendor: c.mechanism.vendorSms,
      color: "var(--color-ember)",
      hits: [0, 3],
    },
    {
      name: c.mechanism.laneEmail,
      vendor: c.mechanism.vendorEmail,
      color: "var(--color-bone)",
      hits: [7],
    },
    {
      name: c.mechanism.laneVoice,
      vendor: c.mechanism.vendorVoice,
      color: "var(--color-moss)",
      hits: [14, 21, 27],
    },
  ];

  return (
    <section id="mechanism" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <Reveal>
          <Wick />
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
            {c.mechanism.label}
          </p>
          <h2 className="mt-4 max-w-[24ch] font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
            {c.mechanism.title}
          </h2>
          <p className="mt-6 max-w-[60ch] text-bone-2 text-sm sm:text-base">{c.mechanism.body}</p>
        </Reveal>

        <div className="mt-12 sm:mt-16 border border-line bg-ink-1/40 overflow-hidden">
          {/* Day axis */}
          <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-b border-line">
            <div className="px-3 sm:px-4 py-3 font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
              {c.mechanism.laneLabel}
            </div>
            <div className="relative h-9">
              <div className="absolute inset-0 flex">
                {Array.from({ length: days + 1 }).map((_, d) => (
                  <div
                    key={d}
                    className="relative flex-1 border-l border-line-soft first:border-l-0"
                  >
                    {d % 5 === 0 && (
                      <span className="absolute left-1 top-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                        {d === 0 ? "D0" : `D${d}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lanes */}
          {lanes.map((lane) => (
            <div
              key={lane.name}
              className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-b border-line last:border-b-0"
            >
              <div className="flex flex-col justify-center border-r border-line px-3 sm:px-4 py-4 sm:py-5">
                <span className="font-display text-lg sm:text-xl text-bone">
                  {lane.name}
                </span>
                <span className="font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                  {lane.vendor}
                </span>
              </div>
              <div className="relative h-20">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                {lane.hits.map((d, i) => {
                  const pct = (d / days) * 100;
                  const isLast = i === lane.hits.length - 1;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${pct}%` }}
                    >
                      <div
                        className={`h-3 w-3 -translate-x-1/2 rounded-full ${isLast ? "dot-pulse" : ""}`}
                        style={
                          isLast
                            ? ({
                                background: lane.color,
                                ["--lane-color" as string]: lane.color,
                              } as React.CSSProperties)
                            : {
                                background: lane.color,
                                boxShadow: `0 0 0 4px ${lane.color}22`,
                              }
                        }
                      />
                      <div className="hidden md:block absolute left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                        D{d} · #{i + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Outcome bar */}
          <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] border-t border-line bg-ink">
            <div className="border-r border-line px-3 sm:px-4 py-3 sm:py-4 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
              {c.mechanism.outcomeLabel}
            </div>
            <div className="relative px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.18em] text-bone-2">
                <span>{c.mechanism.outcomePayLink}</span>
                <span>{c.mechanism.outcomeRhythm}</span>
                <span>{c.mechanism.outcomeHandoff}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Compliance                                                */
/* ────────────────────────────────────────────────────────── */

function Compliance({ c }: { c: Copy }) {
  return (
    <section id="compliance" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Wick />
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.compliance.label}
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.85rem,4.5vw,3.6rem)] leading-[1.06] tracking-tight text-bone break-words">
              {c.compliance.titleLine1}
              <br />
              <em>{c.compliance.titleLine2}</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-bone-2 text-sm sm:text-base">
              {c.compliance.body}
            </p>
          </Reveal>
          <div className="lg:col-span-8 lg:pl-12">
            <div className="grid gap-px border border-line bg-line md:grid-cols-2">
              {c.compliance.items.map((it) => (
                <div key={it.k} className="card-lift bg-ink p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-2xl sm:text-3xl text-bone break-words">
                      {it.k}
                    </span>
                    <span className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.22em] text-ember">
                      {it.tag}
                    </span>
                  </div>
                  <p className="mt-4 text-bone-2 text-sm sm:text-base">{it.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Distribution — getting started                            */
/* ────────────────────────────────────────────────────────── */

function Distribution({
  c,
  authed,
  displayName,
}: {
  c: Copy;
  authed: boolean;
  displayName: string | null;
}) {
  return (
    <section className="seam-top relative bg-ink-1/40">
      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Wick />
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.distribution.label}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-bone break-words">
              {c.distribution.titleLine1}
              <br />
              <em>{c.distribution.titleLine2}</em>
            </h2>
            <p className="mt-6 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              {c.distribution.body1}
            </p>
            <p className="mt-4 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              {c.distribution.body2}
            </p>
          </Reveal>

          <div className="lg:col-span-7 lg:pl-10">
            <div className="border border-line">
              <div className="grid grid-cols-3 border-b border-line">
                {c.distribution.stats.map((s, i) => (
                  <div
                    key={s.k}
                    className={`p-4 sm:p-6 ${i < 2 ? "border-r border-line" : ""}`}
                  >
                    <div className="font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {s.k}
                    </div>
                    <div className="num mt-2 font-display text-2xl sm:text-4xl text-bone break-words">
                      {s.v}
                    </div>
                    <div className="mt-1 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.18em] text-ember">
                      {s.d}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-line">
                {c.distribution.timeline.map(([k, v], i) => (
                  <li
                    key={`${k}-${i}`}
                    className="grid grid-cols-[52px_1fr] sm:grid-cols-[60px_1fr] items-baseline px-4 sm:px-6 py-4 gap-2"
                  >
                    <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {k}
                    </span>
                    <span className="text-bone-2 text-sm sm:text-base">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sign-up form */}
        <div
          id="start"
          className="mt-20 sm:mt-24 grid gap-12 border-t border-line pt-12 sm:pt-16 lg:grid-cols-12"
        >
          <Reveal className="lg:col-span-5">
            <Wick />
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
              {c.distribution.formLabel}
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.06] tracking-tight text-bone break-words">
              {c.distribution.formTitleA}
              <br />
              <em className="text-bone-2">{c.distribution.formTitleB}</em>
            </h3>
            <p className="mt-5 max-w-[40ch] text-bone-2 text-sm sm:text-base">
              {c.distribution.formBody}
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-2">
              {c.distribution.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="text-ember shrink-0">▲</span> {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="lg:col-span-7">
            <AuthCta c={c} authed={authed} displayName={displayName} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthCta({
  c,
  authed,
  displayName,
}: {
  c: Copy;
  authed: boolean;
  displayName: string | null;
}) {
  if (authed) {
    return (
      <div className="border border-ember/40 bg-ember/5 p-6 sm:p-8 text-bone">
        <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-ember">
          {c.auth.authedLabel}
        </div>
        <p className="mt-3 font-display text-xl sm:text-2xl leading-snug break-words">
          {c.auth.authedTitle(displayName)}
        </p>
        <p className="mt-2 max-w-[44ch] text-bone-2 text-sm sm:text-base">
          {c.auth.authedSub}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/app"
            className="cta-primary group inline-flex items-center gap-3 bg-ember px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink hover:bg-ember-hot"
          >
            {c.auth.ctaDashboard}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/app/cases/import"
            className="group inline-flex items-center gap-3 border border-bone/30 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 hover:border-ember hover:text-ember transition-colors"
          >
            {c.auth.ctaImport}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line bg-ink-1/40 p-6 sm:p-8">
      <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-bone-3">
        {c.auth.unauthLabel}
      </div>
      <p className="mt-3 font-display text-xl sm:text-2xl leading-snug text-bone break-words">
        {c.auth.unauthTitle}
      </p>
      <p className="mt-3 max-w-[44ch] text-bone-2 text-sm sm:text-base">
        {c.auth.unauthSub}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <GoogleButton variant="primary">{c.auth.googleCta}</GoogleButton>
        <Link
          href="/auth/sign-up"
          className="group inline-flex items-center justify-center gap-3 border border-bone/30 px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 hover:border-ember hover:text-ember transition-colors"
        >
          {c.auth.emailCta}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <p className="mt-6 font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.2em] text-bone-3">
        {c.auth.already}{" "}
        <Link href="/auth/sign-in" className="text-bone hover:text-ember">
          {c.auth.alreadyLink}
        </Link>
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Investor                                                  */
/* ────────────────────────────────────────────────────────── */

function Investor({ c }: { c: Copy }) {
  return (
    <section
      id="investor"
      className="seam-top relative overflow-hidden"
    >
      <div className="ember-floor" aria-hidden style={{ bottom: "-65%" }} />
      <div className="relative mx-auto max-w-[1320px] px-6 py-24 md:py-44">
        <Reveal>
          <Wick />
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] text-bone-3">
            {c.investor.label}
          </p>
          <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2.25rem,7vw,7rem)] leading-[0.98] tracking-tight text-bone break-words">
            {c.investor.titleLine1}
            <br />
            <em className="text-bone-2">{c.investor.titleLine2}</em>
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-bone-2 leading-[1.55] max-w-[58ch]">
              {c.investor.body}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="mailto:investors@dragun.app?subject=Dragun%20%E2%80%94%20investor%20memo"
                className="cta-primary group inline-flex max-w-full items-center gap-3 bg-ember px-5 sm:px-7 py-3.5 sm:py-4 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-ink hover:bg-ember-hot break-all"
              >
                {c.investor.investorEmail}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="mailto:founders@dragun.app?subject=Dragun%20%E2%80%94%20founders"
                className="group inline-flex items-center gap-3 border-b border-bone/30 pb-1 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-bone-2 transition-colors hover:text-bone hover:border-bone"
              >
                {c.investor.foundersLink}
              </a>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-3">
              {c.investor.investorMicro}
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="card-lift border border-line bg-ink-1/70 p-5 sm:p-7">
              <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-bone-3">
                <span>{c.investor.cardLabel}</span>
                <span className="text-ember">{c.investor.cardOpen}</span>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-5 sm:gap-6">
                {[
                  { k: c.investor.kStage, v: c.investor.vStage },
                  { k: c.investor.kVehicle, v: c.investor.vVehicle },
                  { k: c.investor.kUse, v: c.investor.vUse },
                  { k: c.investor.kGeo, v: c.investor.vGeo },
                ].map((d) => (
                  <div key={d.k} className="min-w-0">
                    <dt className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] text-bone-3">
                      {d.k}
                    </dt>
                    <dd className="mt-1 font-display text-lg sm:text-xl text-bone break-words">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7 border-t border-line pt-5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bone-3 leading-relaxed">
                {c.investor.footnote}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer                                                    */
/* ────────────────────────────────────────────────────────── */

function Footer({ c }: { c: Copy }) {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 sm:pt-20 pb-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <a href="#" className="text-bone">
              <DragunLogo className="h-6 w-6" wordmarkClassName="text-2xl" />
            </a>
            <p className="mt-5 max-w-[44ch] text-bone-2 text-sm sm:text-base">
              {c.footer.blurb}
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8 font-mono text-[12px] sm:text-sm uppercase tracking-[0.18em] text-bone-2">
            <div>
              <div className="text-bone-3">{c.footer.platform}</div>
              <ul className="mt-3 space-y-2">
                <li><a href="#mechanism" className="link-rule hover:text-bone">{c.footer.howItWorks}</a></li>
                <li><a href="#compliance" className="link-rule hover:text-bone">{c.footer.compliance}</a></li>
                <li><a href="#pricing" className="link-rule hover:text-bone">{c.footer.pricing}</a></li>
              </ul>
            </div>
            <div className="min-w-0">
              <div className="text-bone-3">{c.footer.contact}</div>
              <ul className="mt-3 space-y-2 break-words">
                <li><a href="mailto:investors@dragun.app" className="link-rule hover:text-bone">{c.footer.investors}</a></li>
                <li><a href="mailto:founders@dragun.app" className="link-rule hover:text-bone">{c.footer.founders}</a></li>
                <li><a href="mailto:hello@dragun.app" className="link-rule hover:text-bone">{c.footer.owners}</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-16 sm:mt-20 select-none overflow-hidden">
          <div className="kern-display font-display text-[clamp(3.5rem,22vw,18rem)] leading-none tracking-[-0.03em] text-bone/90 break-words">
            DRAGUN
            <span className="text-ember glow-ember">
              †
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-bone-3 md:flex-row md:items-center md:justify-between">
          <span>{c.footer.copyright}</span>
          <span>{c.footer.tagline}</span>
          <span className="flex flex-wrap gap-4 sm:gap-5">
            <Link href="/legal/privacy" className="link-rule hover:text-bone">{c.footer.privacy}</Link>
            <Link href="/legal/terms" className="link-rule hover:text-bone">{c.footer.terms}</Link>
            <Link href="/legal/disclosures" className="link-rule hover:text-bone">{c.footer.disclosures}</Link>
            <Link href="/legal/security" className="link-rule hover:text-bone">{c.footer.security}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
