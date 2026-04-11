/** Shared office + contact details (brochure, contact page, etc.) */

export const ACADEMY_OFFICE = {
  addressLine1:
    "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590016",
  addressLine2: "VFF GROUP - First Floor",
  mapLat: 15.891116051838667,
  mapLng: 74.54251765767174,
} as const;

export function academyGoogleMapsUrl(): string {
  return `https://www.google.com/maps?q=${ACADEMY_OFFICE.mapLat},${ACADEMY_OFFICE.mapLng}`;
}

export const ACADEMY_CONTACT_NUMBERS = [
  { display: "+91 82965 65587", raw: "918296565587" },
  { display: "+91 89712 44513", raw: "918971244513" },
  { display: "+91 73383 60607", raw: "917338360607" },
] as const;
