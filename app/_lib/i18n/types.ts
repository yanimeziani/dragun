export type Locale = "fr" | "en";

export type Strings = {
  locale: {
    label: string;
    short: string;
    switchTo: string;
  };
  nav: {
    signIn: string;
    signUp: string;
    signOut: string;
    dashboard: string;
    demo: string;
    pricing: string;
    home: string;
  };
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    submit: string;
    continue: string;
    back: string;
    yes: string;
    no: string;
  };
  landing: {
    heroTagline: string;
    heroHeadline: string;
    heroSub: string;
    heroPrimary: string;
    heroSecondary: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    businessName: string;
    businessNamePlaceholder: string;
    defaultLocale: string;
    brandColor: string;
    signature: string;
    signaturePlaceholder: string;
    submit: string;
  };
  dashboard: {
    title: string;
    addCase: string;
    emptyTitle: string;
    emptySubtitle: string;
    kpiOpen: string;
    kpiRecovered: string;
    kpiOverdue: string;
    statusOpen: string;
    statusPaid: string;
    statusClosed: string;
    statusHandoff: string;
  };
  caseForm: {
    title: string;
    debtorName: string;
    debtorEmail: string;
    debtorPhone: string;
    debtorLocale: string;
    amount: string;
    currency: string;
    description: string;
    descriptionPlaceholder: string;
    ref: string;
    refPlaceholder: string;
    sendNow: string;
    submit: string;
  };
  paylink: {
    payNow: string;
    amountDue: string;
    poweredBy: string;
    securedBy: string;
    thanksTitle: string;
    thanksSub: string;
  };
  legal: {
    privacy: string;
    terms: string;
    privacyTitle: string;
    termsTitle: string;
  };
  errors: {
    invalidEmail: string;
    passwordTooShort: string;
    notAuthenticated: string;
    notFound: string;
    invalidPhone: string;
    nameRequired: string;
    amountRequired: string;
  };
};
