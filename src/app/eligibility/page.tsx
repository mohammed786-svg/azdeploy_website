import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eligibility | AZDeploy Academy",
  description: "Eligibility criteria for admissions at AZDeploy Academy.",
};

export default function EligibilityPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Eligibility</h1>
      <p className="mt-3 text-sm text-[#94a3b8]">Effective Date: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-[#cbd5e1]">
        <section>
          <h2 className="text-lg font-semibold text-white">1. General Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Candidate must provide valid identity and contact details.</li>
            <li>Candidate should have basic computer literacy and commitment to practical learning.</li>
            <li>Minimum educational level may vary by course; additional screening may apply.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Program-Specific Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Beginner tracks: open to students and fresh graduates with foundational aptitude.</li>
            <li>Advanced tracks: may require prior coding, cloud, or DevOps fundamentals.</li>
            <li>Corporate/fast-track batches: evaluation interview or assignment may be mandatory.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Document and Verification Requirements</h2>
          <p>
            Admission can be declined, suspended, or cancelled if submitted details are false, incomplete, or unverifiable. Any forged document or impersonation
            attempt will attract strict legal action.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Admission Discretion</h2>
          <p>
            AZDeploy Academy reserves the right to accept, reject, defer, or discontinue enrollment based on capacity, course readiness, conduct, policy
            compliance, and institutional standards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Important Note</h2>
          <p>
            Eligibility criteria are part of our institutional policy and may be revised from time to time. Continued participation implies acceptance of updated
            eligibility and policy terms.
          </p>
        </section>
      </div>
    </main>
  );
}

