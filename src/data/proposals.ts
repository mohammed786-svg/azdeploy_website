export interface CostItem {
  component: string;
  cost: string;
}

export interface ModuleGroup {
  title: string;
  items: string[];
}

export interface PricingPlan {
  title: string;
  price: string;
  originalPrice?: string;
  cadence: string;
  gstNote: string;
  features: string[];
  bestFor: string;
  highlighted?: boolean;
  badge?: string;
  offerNote?: string;
  paymentPlan?: string[];
}

export interface WebsiteAddon {
  heading: string;
  price: string;
  cadence: string;
  marketValue: string;
  include: string[];
  mention: string;
}

export interface Proposal {
  id: string;
  slug: string;
  number: number;
  template?: "standard" | "medical-college";
  title: string;
  subtitle: string;
  cost: string;
  gstNote: string;
  timeline: string;
  objective: string;
  objectiveDetails?: string[];
  modules?: ModuleGroup[];
  features?: string[];
  applications?: string[];
  aiFeatures?: string[];
  technologyHighlights?: string[];
  whiteLabelPoints: string[];
  costBreakdown: CostItem[];
  total: string;
  clientName?: string;
  clientOrganization?: string;
  clientLocation?: string;
  clientManager?: string;
  preparedFor?: string;
  proposalTagline?: string;
  preparedBy?: string;
  website?: string;
  introParagraphs?: string[];
  solutionItems?: string[];
  solutionNote?: string;
  pricingPlans?: PricingPlan[];
  websiteAddon?: WebsiteAddon;
  implementationSteps?: string[];
  paymentTermsCustom?: string[];
  whyChoosePoints?: string[];
  whyChooseDescription?: string[];
  closingNote?: string;
  contactEmail?: string;
  contactPhone?: string;
  footerNotes?: string[];
  extras?: {
    title: string;
    content: string | string[];
  }[];
}

export const company = {
  name: "AZDeploy Academy",
  tagline: "Enterprise Software Development Proposal — Attendance & End-to-End",
  documentType: "Client Proposal",
};

export const sharedSections = {
  paymentTerms: [
    "50% Advance – Before project commencement.",
    "25% Payment – After the first successful functional demonstration.",
    "25% Final Payment – Upon successful project delivery and handover.",
  ],
  demonstrationSchedule: [
    "Bi-weekly progress demonstrations.",
    "Client review and feedback after each demo.",
    "Feature approvals recorded at each milestone.",
  ],
  documentation: {
    intro:
      "Project documentation is included with delivery and covers written guides plus recorded training.",
    items: [
      "End-to-end written documentation for setup, admin usage, and operations.",
      "Video-recorded playlist covering every feature end to end (module-wise / feature-wise walkthroughs).",
      "Handover training so your team can operate the system confidently after go-live.",
    ],
  },
  maintenance: {
    intro: "Maintenance is not included in the development cost.",
    coverage: [
      "Cloud Server Management",
      "Domain Management",
      "SSL Certificates",
      "Security Monitoring",
      "Backups",
      "Software Updates",
      "Bug Fixes",
      "Performance Optimization",
      "Technical Support",
      "Infrastructure Monitoring",
    ],
    note: "AMC pricing will be finalized based on deployment scale, user count, hosting requirements, and support SLA.",
  },
  professionalNote:
    "Modern AI tools can accelerate coding, documentation, and prototyping, but they do not replace the disciplined engineering required to deliver secure, scalable, production-ready enterprise software. Successful products are built through detailed requirement analysis, user experience design, software architecture, testing, deployment, security hardening, integrations, and long-term support. The value of an enterprise solution lies not only in writing code, but in delivering a reliable system that organizations can confidently operate, maintain, and grow over many years.",
};

export const erpProposal: Proposal = {
  id: "erp",
  slug: "educational-erp-madhu-mam",
  number: 1,
  title: "Custom Educational ERP Platform",
  subtitle: "White Label SaaS",
  preparedFor: "Madhu Mam",
  clientName: "Madhu Mam",
  proposalTagline:
    "A one-time investment in enterprise software — built for lasting institutional value and sustained long-term returns.",
  cost: "₹8,95,000",
  gstNote: "+ 18% GST",
  timeline: "45–60 Working Days",
  objective:
    "Develop a fully customized Educational ERP Software under your own company branding.",
  objectiveDetails: [
    "The software will become your intellectual property (white-labelled), allowing your organization to market and resell it to schools, colleges, universities, coaching institutes, and educational organizations under your own brand.",
    "AZDeploy Academy will remain your technical implementation and maintenance partner.",
  ],
  modules: [
    {
      title: "Student Management",
      items: [
        "Student Admissions",
        "Student Profiles",
        "Document Management",
        "Student Promotion",
        "Student Transfers",
        "Alumni Management",
      ],
    },
    {
      title: "Academic Management",
      items: [
        "Courses",
        "Departments",
        "Subjects",
        "Timetable",
        "Academic Calendar",
        "Semester Management",
      ],
    },
    {
      title: "Attendance",
      items: [
        "Student Attendance",
        "Teacher Attendance",
        "Biometric Integration",
        "RFID Support",
        "Face Recognition Machine Integration",
        "Face Enrollment & Attendance Sync",
        "Device API Integration (biometric/face scanners)",
        "Real-time Attendance Capture",
        "Offline Queue Sync (auto-retry on reconnect)",
        "Face Data Management & Enrollment Logs",
        "Attendance Reports",
      ],
    },
    {
      title: "Examination",
      items: [
        "Exam Creation",
        "Hall Tickets",
        "Marks Entry",
        "Grade Cards",
        "Result Publishing",
        "Rank Lists",
        "Analytics",
      ],
    },
    {
      title: "Fees Management",
      items: [
        "Fee Structure",
        "Online Fee Collection",
        "Scholarships",
        "Fine Calculation",
        "Due Reports",
        "GST Ready Invoices",
      ],
    },
    {
      title: "Finance",
      items: [
        "Income",
        "Expenses",
        "Salary Management",
        "Budget",
        "Accounting Reports",
        "Dashboard",
      ],
    },
    {
      title: "Human Resource (HRMS)",
      items: [
        "Employee Records",
        "Leave Management",
        "Payroll",
        "Recruitment",
        "Performance Review",
      ],
    },
    {
      title: "Library",
      items: [
        "Book Inventory",
        "Barcode Support",
        "Issue & Return",
        "Fine Calculation",
      ],
    },
    {
      title: "Hostel",
      items: [
        "Hostel Allocation",
        "Room Management",
        "Hostel Fees",
        "Visitor Records",
      ],
    },
    {
      title: "Transport",
      items: [
        "Vehicle Management",
        "Driver Records",
        "Route Management",
        "GPS Integration Ready",
      ],
    },
    {
      title: "Parent Portal (Web)",
      items: [
        "Attendance",
        "Results",
        "Fees",
        "Homework",
        "Notices",
        "Live Reports",
      ],
    },
    {
      title: "Teacher Portal",
      items: [
        "Attendance",
        "Marks Entry",
        "Homework",
        "Student Reports",
        "Timetable",
      ],
    },
    {
      title: "Student Portal",
      items: [
        "Attendance",
        "Assignments",
        "Results",
        "Fee Status",
        "Certificates",
      ],
    },
    {
      title: "Principal Dashboard",
      items: [
        "Real-time analytics",
        "Student Strength",
        "Fee Collection",
        "Attendance %",
        "Performance",
        "Defaulters",
        "Teacher Performance",
        "AI Reports",
      ],
    },
    {
      title: "Administration",
      items: [
        "Role Based Access",
        "Permissions",
        "Audit Logs",
        "Security",
        "Backups",
        "Master Settings",
      ],
    },
  ],
  aiFeatures: [
    "AI Student Performance Analysis",
    "AI Attendance Risk Detection",
    "AI Fee Defaulter Prediction",
    "AI Report Generation",
    "AI Notice & Circular Drafting",
    "AI Parent Communication Assistance",
    "AI Admission Enquiry Response",
    "AI Timetable Suggestions",
    "AI Data Insights Dashboard",
    "AI Search Across ERP Records",
    "AI-powered chatbot for common queries",
  ],
  technologyHighlights: [
    "Next.js",
    "Django",
    "Python",
    "PostgreSQL",
    "Linux",
    "Nginx",
    "PgBouncer",
    "Redis",
    "Celery",
    "Daphne",
    "Java",
    "SwiftUI",
    "Docker",
    "REST APIs",
    "JWT Authentication",
    "CI/CD Pipelines",
  ],
  whiteLabelPoints: [
    "The software will carry only your company branding.",
    "Your organization may market, license, and resell it under your own brand identity.",
    "AZDeploy Academy will act as your long-term technical partner for enhancements, maintenance, infrastructure, and support.",
  ],
  costBreakdown: [
    { component: "Requirement Analysis", cost: "₹55,000" },
    { component: "UI/UX Design", cost: "₹95,000" },
    { component: "Frontend Development", cost: "₹2,30,000" },
    { component: "Backend Development", cost: "₹2,10,000" },
    { component: "Database Design", cost: "₹65,000" },
    { component: "API Development", cost: "₹75,000" },
    { component: "AI Automation", cost: "₹85,000" },
    { component: "Authentication & Security", cost: "₹40,000" },
    { component: "Server Deployment & DevOps Setup", cost: "₹70,000" },
    { component: "Documentation, Training & Feature-wise Video Playlist", cost: "₹40,000" },
    { component: "Project Management", cost: "₹30,000" },
  ],
  total: "₹8,95,000",
};

export const trackingProposal: Proposal = {
  id: "tracking",
  slug: "student-tracking-madhu-mam",
  number: 2,
  title: "Student Safety & Live Location Tracking System",
  subtitle: "GPS-Integrated Safety Platform",
  preparedFor: "Madhu Mam",
  clientName: "Madhu Mam",
  proposalTagline:
    "A one-time investment in enterprise software — built for lasting institutional value and sustained long-term returns.",
  cost: "₹3,56,000",
  gstNote: "+ 18% GST",
  timeline: "45–60 Working Days",
  objective:
    "Develop a complete student safety platform integrated with GPS tracking devices, allowing schools and parents to monitor student locations in real time.",
  objectiveDetails: [
    "The system includes Android and iOS mobile applications for parents and school staff, along with a centralized web-based administration portal.",
    "Tracking devices are NOT included in this software development cost.",
  ],
  applications: [
    "Parent Android App",
    "Parent iOS App",
    "School Android App",
    "School iOS App",
    "Admin Web Portal",
  ],
  features: [
    "Real-Time GPS Tracking",
    "Live Route Playback",
    "SOS Emergency Button Alerts",
    "Geo-Fencing",
    "Safe Zone Alerts",
    "Pickup Notification",
    "Drop Notification",
    "Battery Level Monitoring",
    "Device Health Status",
    "Historical Travel Reports",
    "Attendance Using Device Presence",
    "Guardian Notifications",
    "School Dashboard",
    "Driver Dashboard",
    "Emergency Contact Management",
    "Push Notifications",
    "Email Alerts",
    "SMS Integration Ready",
  ],
  technologyHighlights: [
    "Next.js",
    "Django",
    "Python",
    "PostgreSQL",
    "Linux",
    "Nginx",
    "PgBouncer",
    "Redis",
    "Celery",
    "Daphne",
    "Java",
    "SwiftUI",
    "Docker",
    "REST APIs",
    "JWT Authentication",
    "CI/CD Pipelines",
  ],
  whiteLabelPoints: [
    "Complete white-labelled solution",
    "Own Branding",
    "Own Logo",
    "Own Domain",
    "Resell Rights",
    "Future Expansion",
  ],
  costBreakdown: [
    { component: "Requirement Analysis", cost: "₹25,000" },
    { component: "UI/UX Design", cost: "₹40,000" },
    { component: "Parent Mobile Apps (Android & iOS)", cost: "₹60,000" },
    { component: "School Mobile Apps (Android & iOS)", cost: "₹55,000" },
    { component: "Admin Web Portal", cost: "₹68,000" },
    { component: "Backend APIs", cost: "₹45,000" },
    { component: "GPS Device Integration APIs", cost: "₹25,000" },
    { component: "AI Automation", cost: "₹25,000" },
    { component: "Deployment, Documentation & Feature-wise Video Playlist", cost: "₹13,000" },
  ],
  total: "₹3,56,000",
  extras: [
    {
      title: "GPS Tracking Device Procurement",
      content: [
        "The GPS tracking hardware is not included in the software development budget.",
        "The client may procure compatible devices independently, or AZDeploy Academy can recommend and assist with sourcing suitable models.",
        "For affordable, API-capable student tracking devices, manufacturers in Shenzhen, China are often the best option. Reliable sourcing platforms include Alibaba (OEM/ODM manufacturers), Made-in-China, and Global Sources.",
        "Look for devices that support: 4G LTE connectivity, Built-in GPS + Wi-Fi + LBS positioning, SOS emergency button, Geofencing, Remote configuration, REST API or MQTT integration, Battery status reporting, and OTA firmware updates.",
        "Well-known chipset and ecosystem providers include Concox, Jimi IoT (Jointech), Queclink, and Meitrack, all of which have extensive experience with fleet and personal GPS tracking solutions and offer devices suitable for education deployments through OEM partners.",
      ],
    },
  ],
};

export const samruddhiMedicalProposal: Proposal = {
  id: "samruddhi-medical",
  slug: "samruddhi-medical-college-erp",
  number: 3,
  template: "medical-college",
  title: "Custom Medical College ERP Proposal",
  subtitle: "Prepared exclusively for Samruddhi College of Nursing",
  cost: "₹60",
  gstNote: "+ 18% GST",
  timeline: "45–60 Working Days",
  objective:
    "Build a fully customized ERP ecosystem for Samruddhi College of Nursing to automate operations, reduce paperwork, and give management complete visibility through one unified platform.",
  objectiveDetails: [],
  features: [],
  whiteLabelPoints: [],
  costBreakdown: [],
  total: "Custom subscription plans",
  clientName: "Samruddhi College of Nursing",
  clientOrganization: "Shri Allamprabhu Foundation",
  clientLocation: "Gokak, Belagavi, Karnataka",
  clientManager: "Mahadev",
  proposalTagline:
    "Transforming Medical Education Through Intelligent Digital Infrastructure",
  preparedBy: "AZDeploy Academy",
  website: "www.azdeploy.com",
  introParagraphs: [
    "At AZDeploy Academy, we do not sell generic ERP software.",
    "We build fully customized ERP ecosystems designed specifically around your institution's workflow.",
    "Every module can be customized according to your existing processes at no additional customization cost.",
    "Our objective is to reduce paperwork, automate daily operations, improve communication, and provide complete visibility to management through one unified platform.",
    "Entire implementation will be completed within 45–60 working days from the date of one month plan upfront payment and final feature discussion.",
  ],
  solutionItems: [
    "Student Management",
    "Admission Management",
    "Attendance",
    "Faculty Management",
    "HRMS",
    "Payroll",
    "Timetable",
    "Fees Management",
    "Online Payments",
    "Examination",
    "Marks & Results",
    "Library",
    "Hostel",
    "Transport",
    "Inventory",
    "Notifications",
    "WhatsApp Integration",
    "Parents App",
    "Student App",
    "Faculty App",
    "Management Dashboard",
    "AI Reports",
    "Role Based Access",
    "Analytics",
    "Hospital Posting",
    "Clinical Rotation",
    "Internship Tracking",
    "Document Management",
    "Biometric Integration",
    "Face Recognition Ready",
    "API Integrations",
    "Unlimited Future Module Expansion",
  ],
  solutionNote:
    "Modules can be enabled or disabled as per your institutional requirements at no extra customization cost.",
  pricingPlans: [
    {
      title: "Per Student Plan",
      price: "₹60",
      originalPrice: "₹65",
      cadence: "Per Student / Month",
      gstNote: "+18% GST",
      features: [
        "All ERP Modules Included",
        "Own Brand Labelling",
        "Android & iOS Apps",
        "Parent App",
        "Student App",
        "Faculty App",
        "Unlimited Staff Accounts",
        "Unlimited Admin Accounts",
        "Unlimited Storage*",
        "Free Module Customization",
        "Regular Updates",
        "Technical Support",
        "Secure Cloud Hosting",
      ],
      bestFor: "Institutions with around 500 students preferring pricing based on student strength.",
      highlighted: true,
      badge: "MOST RECOMMENDED",
      offerNote:
        "We normally charge ₹65 per student/month for a 500-student institution, but we are offering ₹60 specially for your institution.",
    },
    {
      title: "Unlimited Institutional Plan",
      price: "₹40,000",
      cadence: "Per Month",
      gstNote: "+18% GST",
      features: [
        "Unlimited Students",
        "Unlimited Courses",
        "Unlimited Branches",
        "Unlimited Departments",
        "Unlimited Faculty",
        "Unlimited Staff",
        "Unlimited Mobile App Users",
        "All ERP Modules Included",
        "Own Brand Labelling",
        "AI Dashboard",
        "Priority Support",
        "Lifetime Customization",
        "Future Feature Expansion",
        "Cloud Hosting Included",
        "Advanced Analytics",
        "WhatsApp Integration Ready",
      ],
      bestFor:
        "Growing institutions planning long-term digital transformation.",
    },
    {
      title: "One-Time Unlimited Ownership Plan",
      price: "₹7,00,000",
      cadence: "One Time Cost",
      gstNote: "+18% GST",
      features: [
        "Unlimited Students",
        "Unlimited Institutional Usage",
        "Unlimited ERP Features Included",
        "All Core Web & Mobile Modules Included",
        "Own Brand Labelling",
        "Full Institution-Wide Deployment",
        "One-Time Ownership-Based Pricing",
        "First Year Free Maintenance",
        "Free Server & Domain for First Year",
        "Only 10% Yearly Maintenance from Second Year",
        "Long-Term Scalability",
        "Source Enhancements Within Agreed Scope",
        "Server & Domain Charges Applicable from Next Year",
        "Additional Charges Only for New Requirements",
      ],
      bestFor:
        "Institutions that prefer a one-time investment with unlimited usage and low yearly maintenance.",
      offerNote:
        "This option includes unlimited students, unlimited institutional usage, first year free maintenance, and free server/domain for the first year. From the second year onward, 10% yearly maintenance applies and server/domain costs will be charged separately. Any completely new requirement outside the agreed scope will be charged separately.",
      paymentPlan: [
        "50% advance payment",
        "25% on first demo",
        "25% on final handover",
      ],
    },
  ],
  websiteAddon: {
    heading: "Exclusive Website Offer",
    price: "₹25,000",
    cadence: "One Time",
    marketValue: "Market Value ₹50,000 – ₹1,00,000",
    include: [
      "Premium Responsive Website",
      "Dynamic CMS",
      "Admin Dashboard",
      "Admission Enquiry Forms",
      "Course Management",
      "Faculty Profiles",
      "Gallery",
      "News & Events",
      "Placement Section",
      "SEO Ready",
      "Mobile Optimized",
      "Unlimited Pages",
      "Easy Content Management",
    ],
    mention: "Available only with ERP implementation.",
  },
  implementationSteps: [
    "Requirement Gathering",
    "Workflow Discussion",
    "UI/UX Design",
    "Development",
    "Testing",
    "Training + Feature-wise Video Playlist Handover",
    "Go Live",
  ],
  paymentTermsCustom: [
    "One month plan amount + 18% GST must be paid upfront to get started on the project.",
    "Development begins immediately after payment confirmation.",
    "Feature discussions and customization workshops will be conducted before development.",
    "Unlimited customization within agreed project scope is included at no additional cost.",
    "Additional future modules outside agreed scope can be developed separately upon request.",
  ],
  whyChoosePoints: [
    "Fully Customized ERP",
    "No Per Module Charges",
    "Modern Mobile Applications",
    "Fast Deployment",
    "Affordable Pricing",
    "Long-Term Technology Partner",
  ],
  whyChooseDescription: [
    "Unlike traditional ERP providers, we believe software should adapt to your institution, not the other way around.",
    "Our commitment is to become your long-term technology partner by continuously improving your ERP as your institution grows.",
  ],
  closingNote:
    "We look forward to partnering with Samruddhi College of Nursing in building a modern, intelligent, and scalable digital campus.",
  contactEmail: "info@azdeploy.com",
  contactPhone: "+91 8296565587",
  footerNotes: [
    "All prices are exclusive of 18% GST.",
    "Proposal validity: 3 Days.",
    "Documentation includes a video-recorded playlist covering every feature end to end (feature-wise walkthroughs).",
  ],
};

export const allProposals = [erpProposal, trackingProposal, samruddhiMedicalProposal];
