export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDoc = {
  title: string;
  effectiveDate: string;
  preamble: string;
  sections: LegalSection[];
};
