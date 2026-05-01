export type Channel = "EMAIL" | "SMS" | "VOICE" | "PAY" | "SYSTEM";
export type Side = "operator" | "debtor" | "both";

export type EventKind =
  | "opened"
  | "closed"
  | "emailRead"
  | "smsTapped"
  | "callPlaced"
  | "callDuration"
  | "payAuthorized"
  | "payReceived"
  | "receipt"
  | "message";

export type ScenarioEvent = {
  c: number;
  ch: Channel;
  who: Side;
  title: string;
  body: string;
  meta?: string;
  kind?: EventKind;
};

export type ClientFixture = {
  slug: string;
  displayName: string;
  appHostHandle: string;
  locale: "en" | "fr";
  case: {
    ref: string;
    memberName: string;
    memberSince: string;
    customerLine: string;
    amountDisplay: string;
    netToLedger: string;
    fee: string;
    timeToPay: string;
    feeBreakdown: string;
  };
  strings: {
    liveDemo: string;
    scenarioCaption: string;
    statusPlaying: string;
    statusPaused: string;
    statusComplete: string;
    backToSite: string;
    reset: string;
    skip: string;
    operatorViewLabel: string;
    kpiAmount: string;
    kpiAmountSubline: string;
    kpiTtp: string;
    kpiTtpOpen: string;
    kpiTtpPaid: string;
    kpiChannels: string;
    kpiChannelsSubline: string;
    kpiNet: string;
    kpiNetPending: string;
    kpiNetFeePrefix: string;
    statusPending: string;
    statusDrafted: string;
    statusFollowingUp: string;
    statusPromised: string;
    statusPaid: string;
    statusPaidClosed: string;
    liveActivity: string;
    streaming: string;
    pressPlay: string;
    customerViewLabel: string;
    iphoneNotifications: string;
    notifications: string;
    today: string;
    noNotifications: string;
    phoneCaption: string;
    cardMail: string;
    cardMessagesLabel: string;
    cardPhoneLabel: string;
    cardWalletLabel: string;
    cardIncomingCall: string;
    cardCallTitle: string;
    cardAuthorizedTitle: string;
    cardPaidTitle: string;
    applePayLabel: string;
    applePayHeadline: string;
    applePayCaption: string;
    eventLogTitle: string;
    eventLogConnector: string;
    eventLogCaption: string;
    eventLogColWhen: string;
    eventLogColChannel: string;
    eventLogColSide: string;
    eventLogColEvent: string;
    eventLogColDetail: string;
    sideOwner: string;
    sideCustomer: string;
    sideBoth: string;
    channelLabels: Record<Channel, string>;
  };
  scenario: ScenarioEvent[];
};
