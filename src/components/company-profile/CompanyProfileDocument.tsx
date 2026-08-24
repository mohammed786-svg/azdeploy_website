"use client";

import { useEffect } from "react";
import { COMPANY_ORG } from "@/lib/company-profile";

function Sheet({
  children,
  screenOnly = false,
  last = false,
}: {
  children: React.ReactNode;
  screenOnly?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`hq-a4-sheet box-border flex h-[297mm] w-[210mm] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-white text-neutral-900 shadow-xl print:max-w-none print:w-[210mm] ${
        last ? "cp-sheet-last" : ""
      } ${screenOnly ? "cp-sheet-screen" : ""}`}
      style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
    >
      <div className="flex min-h-0 flex-1 flex-col px-[9mm] py-[6mm] text-[10pt] leading-snug text-black">{children}</div>
    </div>
  );
}

function PageFill({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-0 flex-1 flex-col gap-2.5">{children}</div>;
}

function KvTable({ rows, compact = false }: { rows: [string, string][]; compact?: boolean }) {
  const pad = compact ? "px-2 py-1" : "px-2 py-1.5";
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-neutral-200">
            <td className={`w-[34%] bg-blue-50 ${pad} text-[10px] font-semibold uppercase tracking-wide text-blue-900`}>
              {label}
            </td>
            <td className={`${pad} font-medium text-neutral-900`}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GridTable({ title, items, cols = 2 }: { title?: string; items: string[]; cols?: 2 | 3 }) {
  return (
    <div>
      {title ? <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{title}</p> : null}
      <table className="w-full border-collapse text-sm">
        <tbody>
          {Array.from({ length: Math.ceil(items.length / cols) }, (_, r) => (
            <tr key={r} className="border-b border-neutral-200">
              {Array.from({ length: cols }, (_, c) => {
                const item = items[r * cols + c];
                return (
                  <td key={c} className={`${cols === 3 ? "w-1/3" : "w-1/2"} border border-neutral-200 px-2 py-1.5 align-top`}>
                    {item || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-1.5 border-b-2 border-blue-800 pb-1 text-[11pt] font-bold uppercase tracking-wide text-blue-900">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-[10.5pt] font-bold text-neutral-900">{children}</h3>;
}

function HighlightCards({
  items,
}: {
  items: { kicker: string; title: string; body: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <div
          key={item.title}
          className="overflow-hidden rounded border-2 border-blue-800 bg-white"
          style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        >
          <div className="bg-blue-800 px-2 py-1 text-center text-[8px] font-bold uppercase tracking-[0.14em] text-white">
            {item.kicker}
          </div>
          <div className="px-2.5 py-2.5">
            <p className="text-[10.5pt] font-bold leading-tight text-neutral-900">{item.title}</p>
            <p className="mt-1 text-[9pt] leading-snug text-neutral-700">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HierarchyBar() {
  return (
    <table className="w-full border-collapse text-center text-sm" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      <thead>
        <tr className="bg-blue-800 text-white">
          <th className="border border-blue-800 px-2 py-2 font-semibold">Trust / Group</th>
          <th className="border border-blue-800 px-2 py-2 font-semibold">Branch</th>
          <th className="border border-blue-800 px-2 py-2 font-semibold">Institution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-neutral-300 bg-blue-50 px-2 py-2 font-semibold">Central control</td>
          <td className="border border-neutral-300 bg-blue-50 px-2 py-2 font-semibold">Campus / unit</td>
          <td className="border border-neutral-300 bg-blue-50 px-2 py-2 font-semibold">School · College · Institute</td>
        </tr>
        <tr>
          <td className="border border-neutral-300 px-2 py-1.5 text-[9.5pt] text-neutral-700">One dashboard for the entire trust</td>
          <td className="border border-neutral-300 px-2 py-1.5 text-[9.5pt] text-neutral-700">Branch-wise fees, staff & reports</td>
          <td className="border border-neutral-300 px-2 py-1.5 text-[9.5pt] text-neutral-700">Institution-level academics & operations</td>
        </tr>
      </tbody>
    </table>
  );
}

function StatsBanner() {
  return (
    <div
      className="border-2 border-blue-800 bg-blue-50 px-3 py-2"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <p className="text-center text-[8px] font-bold uppercase tracking-[0.16em] text-blue-800">Delivery track record</p>
      <p className="mt-1 text-center text-[11pt] font-bold leading-snug text-neutral-900">
        500+ business websites, Android &amp; iOS mobile apps, and AI automations
      </p>
      <p className="mt-0.5 text-center text-[9.5pt] text-blue-900">
        Calling agents · WhatsApp agents · Message agents · Web apps · Native mobile apps
      </p>
    </div>
  );
}

function ProfileLogo() {
  return (
    <div className="relative h-[29mm] w-[54mm] overflow-hidden bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- print-safe cropped logo */}
      <img
        src="/proposal-logo-cropped.png"
        alt="AZ Deploy Academy"
        width={216}
        height={116}
        className="block h-full w-full object-contain object-left"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        decoding="async"
      />
    </div>
  );
}

function PageHead({ page, total, title }: { page: number; total: number; title?: string }) {
  return (
    <div className="mb-2 flex shrink-0 items-center justify-between gap-3 border-b-2 border-blue-800 pb-2">
      <div className="min-w-0">
        <ProfileLogo />
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          {title || "Company Profile"}
        </p>
      </div>
      <div className="text-right">
        <p className="rounded border-2 border-blue-800 bg-blue-50 px-2 py-1">
          <span className="block text-[8px] font-semibold uppercase tracking-wide text-blue-800">GSTIN</span>
          <span className="font-mono text-[11px] font-bold tracking-wide text-neutral-900">{COMPANY_ORG.gstin}</span>
        </p>
        <p className="mt-1 text-[9px] text-neutral-500">
          Page {page} of {total}
        </p>
      </div>
    </div>
  );
}

const ERP_MODULES = [
  "100% web-based (no installation)",
  "WhatsApp / SMS fee reminders",
  "Internal WhatsApp Chat System (own)",
  "Single-click student / staff 360° view",
  "Trust → Branch → Institution control",
  "Student Management System",
  "Admission Management",
  "Student Enquiry & Lead Management",
  "Online Application System",
  "Student Profiles",
  "Parent Portal",
  "Teacher Portal",
  "Staff Management",
  "Attendance Management",
  "Biometric Integration",
  "Face Recognition Integration",
  "Timetable Management",
  "Examination Management",
  "Marks & Result Management",
  "Fee Management",
  "Online Payment Integration",
  "Receipt Generation",
  "Scholarship Management",
  "Library Management",
  "Hostel Management",
  "Transport Management",
  "HRMS",
  "Payroll Management",
  "Leave Management",
  "Inventory Management",
  "Certificate Generation",
  "ID Card Generation",
  "Notices & Announcements",
  "WhatsApp Communication",
  "SMS & Email Notifications",
  "Reports & Analytics",
  "Role-Based Access Control",
];

const CORE_AI = [
  "Artificial Intelligence",
  "Generative AI",
  "AI Engineering",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Large Language Models",
  "Retrieval-Augmented Generation (RAG)",
  "AI Agents",
  "AI Automation",
];

const CORE_DATA = [
  "Data Analytics",
  "Data Science",
  "Data Engineering",
  "Python Programming",
  "SQL",
  "Data Visualization",
  "Business Intelligence",
  "Database Management",
  "Real-World Data Projects",
];

const CORE_SOFTWARE = [
  "Web Application Development",
  "Mobile Application Development",
  "Custom Software Development",
  "SaaS Product Development",
  "API Development & Integration",
  "Database Design",
  "Cloud-Based Applications",
  "Business Management Systems",
];

const DIGITAL_TX = [
  "Institution Website Development",
  "Admission Portals",
  "Learning Management Systems",
  "Student Mobile Applications",
  "Parent & Teacher Applications",
  "Online Examination Systems",
  "Digital Attendance Systems",
  "ERP Implementation",
  "AI-Powered Student Support",
  "WhatsApp Automation",
  "Automated Notifications",
  "Data Dashboards",
  "Custom Institutional Software",
];

const BUSINESS = [
  "Business Websites",
  "E-Commerce Platforms",
  "Mobile Applications",
  "Customer Relationship Management (CRM)",
  "Enterprise Resource Planning (ERP)",
  "Appointment & Booking Systems",
  "Inventory Management",
  "Billing & Invoicing Systems",
  "HRMS & Employee Management",
  "Custom Business Software",
  "AI-Powered Customer Support",
  "WhatsApp Automation",
  "Lead Management Automation",
  "Workflow Automation",
  "Calling Agent Integration",
  "Digital Marketing Technology Solutions",
];

const AUTOMATION = [
  "WhatsApp Automation",
  "Automated Lead Follow-Up",
  "AI Chatbots",
  "AI Voice Agents",
  "Calling Automation",
  "CRM Automation",
  "Google Sheets Automation",
  "Email Automation",
  "Customer Support Automation",
  "Appointment Automation",
  "Workflow Automation",
  "API Integrations",
  "AI Knowledge Base Systems",
];

const TRAINING = [
  "Artificial Intelligence",
  "AI Engineering",
  "Generative AI",
  "Data Analytics",
  "Data Science",
  "Data Engineering",
  "Python Programming",
  "Full Stack Development",
  "Web Development",
  "Mobile App Development",
  "DevOps",
  "Cloud Technologies",
  "Cybersecurity",
  "Ethical Hacking",
  "Machine Learning",
  "Software Engineering",
];

const METHOD = [
  "Practical Learning",
  "Hands-On Projects",
  "Real-World Problem Solving",
  "Industry Tools",
  "Portfolio Development",
  "AI-Assisted Development",
  "Live Workshops",
  "Career Guidance",
  "Interview Preparation",
  "Job Placement Support",
];

const WORKSHOPS = [
  "Introduction to Artificial Intelligence",
  "Generative AI Tools",
  "AI for Students",
  "AI for Teachers & Faculty",
  "Prompt Engineering",
  "Building Applications Using AI",
  "Automation Using AI",
  "Python Programming",
  "Data Analytics",
  "Cybersecurity Awareness",
  "Ethical Hacking Fundamentals",
  "Web Development",
  "Mobile App Development",
  "Career Opportunities in Technology",
];

const WHY = [
  "Practical and Industry-Oriented Approach",
  "AI-First Technology Solutions",
  "Customized Software Development",
  "Solutions for Educational Institutions",
  "Real-World Project Experience",
  "Modern Technology Stack",
  "Automation-Focused Systems",
  "Scalable Digital Solutions",
  "Training and Technology Under One Ecosystem",
  "Dedicated Support and Continuous Innovation",
];

const PRINT_PAGES = 8;

export default function CompanyProfileDocument() {
  useEffect(() => {
    const prev = document.title;
    document.title = "AZDeploy Academy — Company Profile";
    return () => {
      document.title = prev;
    };
  }, []);

  const addr = COMPANY_ORG.addressLines.join(", ");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4 portrait; margin: 0; }
          @media print {
            html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
            .hq-a4-screen {
              background: #fff !important;
              padding: 0 !important;
              gap: 0 !important;
              display: block !important;
            }
            .hq-a4-sheet {
              box-shadow: none !important;
              max-width: none !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              overflow: hidden !important;
              margin: 0 !important;
              page-break-after: always;
              break-after: page;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .hq-a4-sheet.cp-sheet-last {
              height: 297mm !important;
              min-height: 297mm !important;
              overflow: hidden !important;
              page-break-after: auto !important;
              break-after: auto !important;
            }
            .hq-a4-sheet.cp-sheet-screen { display: none !important; }
            .hq-print-logo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              filter: brightness(0) !important;
            }
            .print\\:hidden { display: none !important; }
          }
        `,
        }}
      />

      <div className="print:hidden mb-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100"
        >
          Print / Save as PDF
        </button>
        <span className="self-center text-xs text-neutral-500">A4 company profile — print or save as PDF.</span>
      </div>

      <div className="hq-a4-screen flex min-h-screen flex-col items-center gap-4 bg-neutral-200 py-4 print:gap-0 print:bg-white print:py-0">
        {/* Page 1 — Cover */}
        <Sheet>
          <PageHead page={1} total={PRINT_PAGES} title="Official Company Profile" />
          <PageFill>
          <div className="border-2 border-blue-800 bg-blue-50 px-3 py-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-800">Goods and Services Tax Identification Number</p>
            <p className="mt-1 font-mono text-[22px] font-bold tracking-[0.12em] text-neutral-900">{COMPANY_ORG.gstin}</p>
            <p className="mt-1 text-[10px] text-blue-900">State: Karnataka (29) · Trade name: {COMPANY_ORG.tradeName}</p>
          </div>
          <div className="text-center">
            <h1 className="text-[18pt] font-bold tracking-wide text-neutral-900">{COMPANY_ORG.tradeName}</h1>
            <p className="text-[12pt] font-semibold uppercase tracking-[0.14em] text-neutral-700">Company Profile</p>
            <p className="mt-2 text-sm italic text-neutral-700">{COMPANY_ORG.tagline}</p>
          </div>
          <KvTable
            rows={[
              ["Organization", COMPANY_ORG.tradeName],
              ["Legal name", COMPANY_ORG.legalName],
              ["Designation", COMPANY_ORG.designation],
              ["Website", COMPANY_ORG.website],
              ["Email", COMPANY_ORG.email],
              ["Contact", COMPANY_ORG.phones.join(" · ")],
              ["Address", addr],
            ]}
          />
          <div>
          <SectionTitle>Statutory registration</SectionTitle>
          <KvTable
            rows={[
              ["GSTIN", COMPANY_ORG.gstin],
              ["PAN", COMPANY_ORG.pan],
              ["Udyam / MSME", COMPANY_ORG.udyam],
              ["Type of enterprise", `${COMPANY_ORG.enterpriseType} (Services)`],
              ["Major activity", COMPANY_ORG.majorActivity],
              ["Date of incorporation", COMPANY_ORG.incorporationDate],
              ["Social category", COMPANY_ORG.socialCategory],
              ["Place of business", `${COMPANY_ORG.district}, ${COMPANY_ORG.state} ${COMPANY_ORG.pin}`],
            ]}
          />
          </div>
          <p className="pt-2 text-[9px] text-neutral-500">
            This document is computer-generated for {COMPANY_ORG.tradeName}.
          </p>
          </PageFill>
        </Sheet>

        {/* Page 2 — About */}
        <Sheet>
          <PageHead page={2} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>About AZDeploy</SectionTitle>
          <p className="mb-2.5 text-justify">
            AZDeploy Academy is a technology-driven organization focused on empowering students, educational institutions, businesses,
            and organizations through <strong>Artificial Intelligence, Software Development, Digital Transformation, Automation, and
            Industry-Oriented Training</strong>.
          </p>
          <p className="mb-2.5 text-justify">
            We bridge the gap between <strong>education and industry requirements</strong> by providing practical, hands-on learning
            experiences and developing modern digital solutions that solve real-world challenges.
          </p>
          <p className="mb-2.5 text-justify">
            Our approach combines <strong>learning, innovation, technology, and implementation</strong>. We work with students to
            build future-ready skills while helping institutions and businesses adopt digital systems that improve efficiency,
            productivity, communication, and growth.
          </p>
          <p className="text-justify">
            At AZDeploy, we believe that technology should not be limited to large organizations. Our mission is to make modern
            technologies, AI solutions, automation, software systems, and digital platforms accessible to students, educational
            institutions, startups, small businesses, and enterprises.
          </p>
          </div>
          <div>
          <SectionTitle>Our vision</SectionTitle>
          <p className="text-justify">
            To become a trusted technology and skill development organization that empowers individuals, educational institutions,
            and businesses to confidently participate in the digital and AI-driven future.
          </p>
          </div>
          <div>
          <SectionTitle>Our mission</SectionTitle>
          <GridTable
            items={[
              "Deliver practical and industry-oriented technology education",
              "Build innovative software and AI-powered solutions",
              "Support schools, colleges, and universities in digital transformation",
              "Help businesses automate processes and improve efficiency",
              "Create opportunities for students to work on real-world projects",
              "Promote innovation, entrepreneurship, and technology adoption",
              "Bridge the gap between academic learning and industry requirements",
              "Make AI and digital platforms accessible beyond large enterprises",
            ]}
          />
          </div>
          <div>
          <SectionTitle>Who we serve</SectionTitle>
          <HighlightCards
            items={[
              {
                kicker: "Students",
                title: "Industry-ready skills",
                body: "Hands-on AI, software, data and DevOps training with live projects, portfolios and career support.",
              },
              {
                kicker: "Institutions",
                title: "Digital campuses",
                body: "ERP, admissions, attendance, parent communication and multi-branch control for schools and colleges.",
              },
              {
                kicker: "Businesses",
                title: "Automation & software",
                body: "Websites, apps, CRM, ERP, WhatsApp automation and AI systems that reduce manual work.",
              },
            ]}
          />
          </div>
          <p className="text-[9.5pt] text-neutral-600">
            <strong>Technology focus:</strong> Artificial Intelligence · Generative AI · Python · SQL · Web & Mobile · Cloud · DevOps ·
            PostgreSQL · APIs · Automation · AI Agents · ERP · CRM · WhatsApp Integration · Business Intelligence
          </p>
          </PageFill>
        </Sheet>

        {/* Page 3 — Core areas */}
        <Sheet>
          <PageHead page={3} total={PRINT_PAGES} />
          <PageFill>
          <SectionTitle>Our core areas</SectionTitle>
          <div>
          <SubTitle>1. AI & emerging technologies</SubTitle>
          <p className="mb-2 text-justify">Training and solutions in modern AI technologies, including:</p>
          <GridTable items={CORE_AI} />
          </div>
          <div>
          <SubTitle>2. Data & analytics</SubTitle>
          <GridTable items={CORE_DATA} />
          </div>
          <div>
          <SubTitle>3. Software development</SubTitle>
          <p className="mb-2 text-justify">Customized software solutions based on organizational and business requirements:</p>
          <GridTable items={CORE_SOFTWARE} />
          </div>
          </PageFill>
        </Sheet>

        {/* Page 4 — ERP */}
        <Sheet>
          <PageHead page={4} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>AZDeploy Education ERP</SectionTitle>
          <p className="mb-1 text-[10.5pt] font-semibold">A complete digital management solution for schools, colleges & educational institutions</p>
          <p className="text-justify">
            AZDeploy Education ERP is <strong>100% web-based</strong> — open it in a browser, with <strong>no software installation</strong>.
            Institutions manage academics, administration, finance and operations from one platform, including
            <strong> direct WhatsApp and SMS fee reminders</strong>. Built for trusts, groups, multi-branch campuses and individual
            institutions.
          </p>
          </div>
          <HighlightCards
            items={[
              {
                kicker: "No install",
                title: "100% web-based ERP",
                body: "Run the full ERP from any browser. No desktop setup, no campus-by-campus installation — log in and start working.",
              },
              {
                kicker: "Fee alerts",
                title: "WhatsApp & SMS reminders",
                body: "Send fee dues, receipts and payment reminders directly on WhatsApp or SMS from the ERP — not from personal phones.",
              },
              {
                kicker: "Own chat stack",
                title: "Internal WhatsApp chat system",
                body: "In-house WhatsApp communication for parents, students and staff — notices, support and updates in one place.",
              },
            ]}
          />
          <HighlightCards
            items={[
              {
                kicker: "One tap",
                title: "Single-click all details access",
                body: "Open a student, staff or enquiry and see admissions, fees, attendance, exams, documents and chat in one click.",
              },
              {
                kicker: "Multi-level",
                title: "Trust → Branch → Institution",
                body: "Centralised control for a trust or group: policy at the top, operations at each branch, academics at institution level.",
              },
              {
                kicker: "And more",
                title: "Fees, exams, HR & analytics",
                body: "Online payments, receipts, timetable, exams, HRMS, library, transport, reports and role-based access — all included.",
              },
            ]}
          />
          <HierarchyBar />
          <GridTable title="Key modules" items={ERP_MODULES} cols={3} />
          </PageFill>
        </Sheet>

        {/* Page 5 — Institutional + business */}
        <Sheet>
          <PageHead page={5} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>Institutional digital transformation</SectionTitle>
          <p className="mb-2.5 text-justify">
            We help educational institutions move towards a smarter and more connected digital ecosystem.
          </p>
          <GridTable items={DIGITAL_TX} />
          </div>
          <div>
          <SectionTitle>AZDeploy business solutions</SectionTitle>
          <p className="mb-2.5 text-justify">
            Technology solutions for startups, small businesses, local businesses, and enterprises. We have delivered{" "}
            <strong>500+ business websites, Android and iOS mobile applications, and AI automations</strong> including calling agents,
            WhatsApp agents and message agents.
          </p>
          <StatsBanner />
          <div className="mt-3">
            <GridTable items={BUSINESS} />
          </div>
          </div>
          </PageFill>
        </Sheet>

        {/* Page 6 — Automation + training */}
        <Sheet>
          <PageHead page={6} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>AI automation & intelligent systems</SectionTitle>
          <p className="mb-2.5 text-justify">
            AZDeploy helps organizations reduce repetitive manual work by implementing intelligent automation systems — saving time,
            improving response speed, and creating better customer experiences.
          </p>
          <GridTable items={AUTOMATION} />
          </div>
          <div>
          <SectionTitle>Training & skill development</SectionTitle>
          <p className="mb-2.5 text-justify">
            Practical, project-oriented programs designed to prepare learners for modern technology careers.
          </p>
          <GridTable title="Training areas" items={TRAINING} />
          </div>
          <GridTable title="Training methodology" items={METHOD} />
          </PageFill>
        </Sheet>

        {/* Page 7 — Workshops + approach */}
        <Sheet>
          <PageHead page={7} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>Workshops & institutional programs</SectionTitle>
          <p className="mb-2.5 text-justify">
            Technology workshops, seminars, faculty development programs, and practical training sessions — customized for schools,
            colleges, universities, training institutes, faculty members, and students.
          </p>
          <GridTable items={WORKSHOPS} />
          </div>
          <div>
          <SectionTitle>Our approach</SectionTitle>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-blue-800 bg-blue-50">
                <th className="w-10 px-2 py-1.5 text-left font-semibold">#</th>
                <th className="w-28 px-2 py-1.5 text-left font-semibold">Stage</th>
                <th className="px-2 py-1.5 text-left font-semibold">What we do</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "Understand", "Requirements, challenges, and objectives of the client or institution."],
                ["2", "Plan", "Design a suitable technology, training, or digital transformation strategy."],
                ["3", "Build", "Develop and implement the required solution."],
                ["4", "Integrate", "Connect systems, APIs, automation tools, and digital platforms."],
                ["5", "Train", "Guide users so they can effectively adopt the solution."],
                ["6", "Support", "Maintain and improve systems as requirements evolve."],
              ].map(([n, stage, desc]) => (
                <tr key={n} className="border-b border-neutral-200">
                  <td className="px-2 py-1.5 text-neutral-600">{n}</td>
                  <td className="px-2 py-1.5 font-semibold">{stage}</td>
                  <td className="px-2 py-1.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </PageFill>
        </Sheet>

        {/* Page 8 — Why / founder / contact */}
        <Sheet last>
          <PageHead page={8} total={PRINT_PAGES} />
          <PageFill>
          <div>
          <SectionTitle>Why choose AZDeploy?</SectionTitle>
          <StatsBanner />
          <div className="mt-2">
            <GridTable items={WHY} />
          </div>
          </div>
          <div>
          <SectionTitle>Our commitment</SectionTitle>
          <p className="text-justify">
            We are committed to creating meaningful impact through technology — whether a student learning AI, a college running a
            web-based ERP with WhatsApp and SMS fee reminders, or a business using websites, mobile apps and AI agents.
          </p>
          </div>
          <div>
          <SectionTitle>Founder / leadership</SectionTitle>
          <KvTable
            compact
            rows={[
              ["Name", COMPANY_ORG.legalName],
              ["Role", `${COMPANY_ORG.designation}, ${COMPANY_ORG.tradeName}`],
            ]}
          />
          <p className="mt-1 text-justify">
            A technology entrepreneur and educator focused on AI, software development, automation, and digital
            transformation. {COMPANY_ORG.legalName} leads AZDeploy Academy from Belagavi, Karnataka.
          </p>
          </div>
          <div>
          <SectionTitle>Contact information</SectionTitle>
          <KvTable
            compact
            rows={[
              ["Organization", COMPANY_ORG.tradeName],
              ["Authorized representative", COMPANY_ORG.legalName],
              ["Designation", COMPANY_ORG.designation],
              ["Registered address", addr],
              ["Mobile", COMPANY_ORG.phones.join(" · ")],
              ["Email", COMPANY_ORG.email],
              ["Website", COMPANY_ORG.website],
              ["GSTIN", COMPANY_ORG.gstin],
              ["PAN", COMPANY_ORG.pan],
              ["Udyam / MSME", COMPANY_ORG.udyam],
            ]}
          />
          </div>
          <div className="border-t-2 border-blue-800 pt-2 text-center">
            <p className="text-[11pt] font-bold uppercase tracking-wide text-blue-900">{COMPANY_ORG.tradeName}</p>
            <p className="text-sm italic text-neutral-700">{COMPANY_ORG.slogan}</p>
            <p className="mt-0.5 text-[10px] text-neutral-500">
              Building future-ready talent and digital solutions for a technology-driven world.
            </p>
          </div>
          </PageFill>
        </Sheet>
      </div>
    </>
  );
}
