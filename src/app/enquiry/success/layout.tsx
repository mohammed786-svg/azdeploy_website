import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiry received",
  description:
    "Your AZ Deploy Academy enquiry was received. Next: knowledge assessment and follow-up — Full-Stack + AI + DevOps, Belagavi.",
  robots: { index: false, follow: true },
};

export default function EnquirySuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
