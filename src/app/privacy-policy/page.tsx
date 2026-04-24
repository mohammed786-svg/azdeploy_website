import type { Metadata } from "next";
import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Privacy Policy | AZDeploy Academy",
  description: "Privacy Policy for AZDeploy Academy, Belagavi, Karnataka, India.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-3 text-sm text-[#94a3b8]">Effective Date: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-[#cbd5e1]">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Controller and Official Location</h2>
          <p>
            AZDeploy Academy operates only from its registered office at {ACADEMY_OFFICE.addressLine1}, {ACADEMY_OFFICE.addressLine2}. We do not authorize any
            third party, franchise, agency, or online operator to collect data in our name without written authorization.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identity and contact details: name, phone, email, city, education details.</li>
            <li>Enrollment and academic details: onboarding forms, fee structure, invoices, receipts, attendance-related records.</li>
            <li>Technical details: IP address, browser data, and interaction logs for security and operations.</li>
            <li>Media uploaded by users: profile images and documents submitted to academy systems.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Purpose and Legal Basis</h2>
          <p>
            Data is processed for admissions, student services, fee management, legal compliance, grievance handling, fraud prevention, and platform security.
            Processing is based on consent, contractual necessity, legitimate institutional interest, and statutory obligations under applicable Indian law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Data Sharing</h2>
          <p>
            We do not sell personal data. Data may be shared with vetted service providers (hosting, payment, communication), accountants, legal counsel, and
            competent government or law-enforcement authorities where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Data Retention and Security</h2>
          <p>
            We retain records for operational and statutory periods as required. We implement technical and organizational safeguards; however, no internet system
            can be guaranteed 100% secure. Users must keep login credentials confidential.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. User Rights and Requests</h2>
          <p>
            You may request correction or update of your data. Deletion requests are subject to legal retention and institutional requirements. Requests can be
            sent to our official contacts:
          </p>
          <p className="mt-1">{ACADEMY_CONTACT_NUMBERS.map((x) => x.display).join(" · ")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Anti-Impersonation and Misuse</h2>
          <p>
            Any person or entity misusing the AZDeploy Academy name, brand style, website style, course style, student onboarding format, or institutional
            identity for deceptive admissions, fake institutes, fake guru branding, or fraud will be subject to strict civil and criminal action under applicable
            Indian laws.
          </p>
        </section>
      </div>
    </main>
  );
}

