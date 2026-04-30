import type { Metadata } from "next";
import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Terms and Conditions | AZDeploy Academy",
  description: "Terms and Conditions for AZDeploy Academy services and admissions.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
      <p className="mt-3 text-sm text-[#94a3b8]">Effective Date: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-[#cbd5e1]">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Institutional Identity and Jurisdiction</h2>
          <p>
            AZDeploy Academy is operated only from {ACADEMY_OFFICE.addressLine1}, {ACADEMY_OFFICE.addressLine2}. Any claim of branch, partner, franchise, or
            training center in our name is invalid unless expressly disclosed in writing by us. Jurisdiction for disputes is Belagavi, Karnataka, India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Enrollment and Conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Admission is subject to document verification, fee compliance, and policy acceptance.</li>
            <li>Students must maintain discipline, ethical conduct, and respectful behavior across offline and online channels.</li>
            <li>Misconduct, fraud, abuse, impersonation, and unauthorized access may lead to suspension or cancellation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Fees, Payments, and Refunds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All fees and due dates are binding once invoice/enrollment is issued.</li>
            <li>Late payments may result in access restrictions and administrative action.</li>
            <li>Fees once paid are non-refundable unless otherwise required by applicable law or written order.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Academic and Placement Disclaimer</h2>
          <p>
            AZDeploy Academy provides training, mentoring, and career support. Job placement depends on student performance, attendance, discipline, technical
            capability, and market conditions. No unconditional placement commitment is made unless explicitly documented in writing.
          </p>
          <p className="mt-2">
            AZDeploy Academy has good industry connections and provides active placement assistance; however, placement support is offered after a student becomes
            industry-ready by completing program learning outcomes, project work, assignments, interview preparation, and required academy guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Intellectual Property and Brand Protection</h2>
          <p>
            All content, teaching material, logos, brand assets, website design, onboarding formats, sales styles, and institutional documentation are protected.
            Copying, cloning, republishing, or running institutes/agencies/fake academies using our exact style or name is strictly prohibited.
          </p>
          <p className="mt-2">
            We will initiate strict legal action including injunction, damages, criminal complaint, and platform/domain takedown under applicable Indian laws
            including, where applicable, trade mark, copyright, fraud, and cyber law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Compliance and Governing Law</h2>
          <p>
            These terms are governed by applicable laws of India and relevant state/local regulations. By enrolling or using our services, users agree to these
            terms and submit to competent courts at Belagavi, Karnataka.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Official Contacts</h2>
          <p>{ACADEMY_CONTACT_NUMBERS.map((x) => x.display).join(" · ")}</p>
        </section>
      </div>
    </main>
  );
}

