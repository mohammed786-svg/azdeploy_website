/** Indian English: whole rupees only (e.g. for GST invoice amount in words). */
const BELOW_20 = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return BELOW_20[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? ` ${BELOW_20[o]}` : "");
}

function threeDigits(n: number): string {
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${BELOW_20[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ""}`;
}

function upTo99999(n: number): string {
  if (n < 1000) return threeDigits(n);
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  return `${threeDigits(th)} Thousand${rest ? ` ${threeDigits(rest)}` : ""}`;
}

/** Converts non-negative integer rupees to words (Indian grouping: lakh, crore). */
export function rupeesIntegerInWords(rupees: number): string {
  const n = Math.floor(Math.max(0, rupees));
  if (n === 0) return "Zero";

  const parts: string[] = [];
  let num = n;

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const last = num;

  if (crores) parts.push(`${upTo99999(crores)} Crore`);
  if (lakhs) parts.push(`${threeDigits(lakhs)} Lakh`);
  if (thousands) parts.push(`${threeDigits(thousands)} Thousand`);
  if (last) parts.push(threeDigits(last));

  return parts.join(" ").trim();
}

/** INR amount with paise for invoices (e.g. "Rupees One Thousand Two Hundred Thirty-Four and Fifty Paise Only"). */
export function amountInWordsINR(amount: number): string {
  const totalPaise = Math.round(amount * 100);
  const rupees = Math.floor(totalPaise / 100);
  const paise = totalPaise % 100;
  const rWords = rupeesIntegerInWords(rupees);
  if (paise === 0) {
    return `Rupees ${rWords} Only`;
  }
  const pWords = ` ${twoDigits(paise)} Paise`;
  return `Rupees ${rWords} and${pWords} Only`;
}
