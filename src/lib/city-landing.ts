export type CityLanding = {
  slug: string;
  city: string;
  region: string;
  nearbyCopy: string;
  focusKeywords: string[];
};

export const CITY_LANDINGS: CityLanding[] = [
  {
    slug: "software-training-in-belagavi",
    city: "Belagavi",
    region: "Karnataka",
    nearbyCopy: "near Belagavi, Tilakwadi, Shahapur, Auto Nagar, and nearby areas",
    focusKeywords: ["best software institute in belagavi", "software training in belagavi", "software institute near me"],
  },
  {
    slug: "software-training-in-belgaum",
    city: "Belgaum",
    region: "Karnataka",
    nearbyCopy: "near Belgaum city and surrounding localities",
    focusKeywords: ["best software institute in belgaum", "software training in belgaum", "software coaching near belgaum"],
  },
  {
    slug: "software-training-in-hubli",
    city: "Hubli",
    region: "Karnataka",
    nearbyCopy: "for students from Hubli-Dharwad looking for job-ready software training",
    focusKeywords: ["software institute in hubli", "full stack training hubli", "software training near hubli"],
  },
  {
    slug: "software-training-in-dharwad",
    city: "Dharwad",
    region: "Karnataka",
    nearbyCopy: "for students from Dharwad and surrounding regions",
    focusKeywords: ["software institute in dharwad", "software training in dharwad", "best it institute near dharwad"],
  },
  {
    slug: "software-training-in-kolhapur",
    city: "Kolhapur",
    region: "Maharashtra",
    nearbyCopy: "for students from Kolhapur (also searched as Kholapur) and nearby cities",
    focusKeywords: ["software institute in kolhapur", "software institute in kholapur", "full stack institute near kolhapur"],
  },
];

export function cityLandingUrl(slug: string): string {
  return `/${slug}`;
}

