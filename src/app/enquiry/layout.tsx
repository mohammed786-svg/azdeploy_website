import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiry",
  description:
    "Enquire about AZ Deploy Academy — Full-Stack + AI + DevOps in Belagavi. WhatsApp, online form, or explore courses and home.",
};

export default function EnquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
