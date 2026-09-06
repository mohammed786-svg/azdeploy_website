import type { Metadata } from "next";
import KidzzyHeader from "@/components/kidzzy/KidzzyHeader";

export const metadata: Metadata = {
  title: "Kidzzy — Kids printables & ebooks | AZ Deploy",
  description: "Printable worksheets, coloring books, and learning packs for kids. ₹199–₹299.",
};

export default function KidzzyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="kidzzy-scope min-h-screen bg-[#fafafa] text-slate-900"
      style={{ fontFamily: '"Nunito", "Segoe UI", system-ui, sans-serif' }}
    >
      <style>{`
        .kidzzy-scope,
        .kidzzy-scope * {
          cursor: auto !important;
        }
        .kidzzy-scope a,
        .kidzzy-scope button,
        .kidzzy-scope [role="button"],
        .kidzzy-scope input[type="submit"],
        .kidzzy-scope input[type="button"],
        .kidzzy-scope select,
        .kidzzy-scope summary,
        .kidzzy-scope label[for],
        .kidzzy-scope .cursor-pointer {
          cursor: pointer !important;
        }
        .kidzzy-scope input,
        .kidzzy-scope textarea {
          cursor: text !important;
        }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <KidzzyHeader />
      <main>{children}</main>
      <footer className="mt-10 border-t border-slate-100 bg-white sm:mt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
          <p>
            <span className="font-bold text-slate-700">kidzzy</span> by azdeploy.com — fun learning printables
          </p>
          <p>Pay securely with Razorpay · Instant PDF download</p>
        </div>
      </footer>
    </div>
  );
}
