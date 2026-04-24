import type { Metadata } from "next";
import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Academy Policy | AZDeploy Academy",
  description: "Institutional policy for students, operations, discipline, and grievance handling.",
};

export default function AcademyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Academy Policy</h1>
      <p className="mt-3 text-sm text-[#94a3b8]">Effective Date: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-[#cbd5e1]">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Official Office and Authenticity</h2>
          <p>
            AZDeploy Academy officially operates only from {ACADEMY_OFFICE.addressLine1}, {ACADEMY_OFFICE.addressLine2}. Any external party claiming association
            must provide verifiable written authorization from our management.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Attendance and Participation</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Regular attendance, assignments, practical work, and periodic evaluations are mandatory.</li>
            <li>Repeated absenteeism or non-performance may result in mentoring intervention or access restrictions.</li>
            <li>Use of unfair means, proxy attendance, or plagiarism is prohibited.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Code of Conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respectful communication is mandatory in classroom, community, and digital channels.</li>
            <li>Harassment, intimidation, hate speech, or abuse may result in suspension/termination.</li>
            <li>Any illegal activity, data theft, impersonation, or platform misuse will be escalated legally.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Assessments, Certification, and Career Support</h2>
          <p>
            Certificate issuance and placement support are based on attendance, completion quality, performance, and compliance with academy requirements. False
            claims of guaranteed outcomes are disallowed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Grievance and Escalation</h2>
          <p>
            Students may raise concerns through official channels for fair review. Abusive or fabricated complaints, extortion attempts, and reputational attacks
            will be handled through lawful remedies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Anti-Cloning and Enforcement</h2>
          <p>
            Any fake guru, agency, company, institute, or academy using AZDeploy Academy name, near-identical branding, course style, website style, or student
            onboarding format without authorization will face strict civil and criminal proceedings, including injunction and damages.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Contact</h2>
          <p>{ACADEMY_CONTACT_NUMBERS.map((x) => x.display).join(" · ")}</p>
        </section>
      </div>
    </main>
  );
}

