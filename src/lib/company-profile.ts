/** Hidden company-profile access token. Not listed in sitemap/robots. */
export const COMPANY_PROFILE_TOKEN = "azd7kN2mQxp29";

export const COMPANY_PROFILE_PATH = `/p/${COMPANY_PROFILE_TOKEN}`;

export const COMPANY_ORG = {
  tradeName: "AZDEPLOY ACADEMY",
  legalName: "MOHAMMED SHAHEED RAMZAN MANIYAR",
  designation: "Founder & Proprietor",
  tagline: "Empowering Students, Institutions & Businesses with Technology, AI and Digital Innovation",
  slogan: "Learn. Build. Innovate. Transform.",
  website: "www.azdeploy.com",
  email: "azdeploytechnologiespvtltd@gmail.com",
  phones: ["+91 82965 65587"],
  gstin: "29EYXPM1962C1ZU",
  pan: "EYXPM1962C",
  udyam: "UDYAM-KR-04-0178755",
  enterpriseType: "Micro",
  majorActivity: "SERVICES",
  socialCategory: "GENERAL",
  incorporationDate: "03/03/2026",
  state: "Karnataka",
  stateCode: "29",
  district: "Belagavi",
  pin: "590016",
  addressLines: [
    "Plot no. 516, VFF GROUP Building — First Floor",
    "Main Road, Auto Nagar, Kanabargi",
    "Belagavi (Belgaum), Karnataka 590016, India",
  ],
} as const;

export function isCompanyProfileToken(token: string | undefined): boolean {
  return Boolean(token && token === COMPANY_PROFILE_TOKEN);
}
