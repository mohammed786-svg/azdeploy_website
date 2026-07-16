export type CityFaq = {
  question: string;
  answer: string;
};

export type CityLanding = {
  slug: string;
  city: string;
  /** Official / alternate spellings shown in copy */
  aliases?: string[];
  region: string;
  state: string;
  nearbyCopy: string;
  focusKeywords: string[];
  /** SEO title without site suffix */
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
  whyBullets: string[];
  localAngle: string;
  commuteNote: string;
  programs: string[];
  faqs: CityFaq[];
};

export const CITY_LANDINGS: CityLanding[] = [
  {
    slug: "software-training-in-belagavi",
    city: "Belagavi",
    aliases: ["Belgaum"],
    region: "North Karnataka",
    state: "Karnataka",
    nearbyCopy: "Tilakwadi, Shahapur, Ramteerth Nagar, Auto Nagar, Angol, and greater Belagavi",
    focusKeywords: [
      "best software training institute in belagavi",
      "best academy in belagavi",
      "best software institute in belagavi",
      "full stack course in belagavi",
      "python django training belagavi",
      "devops training belagavi",
      "ai training academy belagavi",
      "software training institute near me belagavi",
    ],
    seoTitle: "Best Software Training Institute in Belagavi | AZDeploy Academy",
    seoDescription:
      "AZDeploy Academy is Belagavi’s job-ready software training academy for Full Stack, AI & DevOps. Real projects, deployment, interview prep & placement support at Auto Nagar, Belagavi.",
    headline: "Best Software Training Academy in Belagavi",
    intro:
      "AZDeploy Academy is a Belagavi-based software training academy built for students who want to become real software engineers — not certificate collectors. Our campus at Ramteerth Nagar / Auto Nagar serves learners across Belagavi (Belgaum) with a 6-month Full-Stack + AI + DevOps program.",
    whyBullets: [
      "Local Belagavi campus with online + offline batches (morning, afternoon, evening).",
      "Mentors with 8+ years industry experience and 500+ products deployed.",
      "Placement-oriented training: projects, GitHub portfolio, resume & interview prep.",
      "One integrated track — React, Django, PostgreSQL, Linux, Nginx, Docker, CI/CD, AWS, AI.",
    ],
    localAngle:
      "If you are searching for the best academy in Belagavi or Belgaum for software engineering, look for production skills: APIs, databases, deployment, and interview-ready projects. That is exactly how AZDeploy Academy trains — in Belagavi, for Belagavi.",
    commuteNote:
      "Convenient for students from Tilakwadi, Shahapur, Auto Nagar, Angol, and nearby Belagavi localities. Visit Plot 516, Ramteerth Nagar, Belagavi 590016.",
    programs: [
      "Full-Stack + AI + DevOps (6 months — flagship)",
      "Specialized tracks: AI, Full Stack, Android, DevOps",
      "Job assistance for students who complete the program",
    ],
    faqs: [
      {
        question: "Is AZDeploy Academy the best software training institute in Belagavi?",
        answer:
          "AZDeploy Academy is Belagavi’s placement-focused software academy offering an integrated Full-Stack + AI + DevOps program with real projects, deployment training, and interview preparation — designed for students who want industry-ready skills, not theory-only coaching.",
      },
      {
        question: "Where is AZDeploy Academy located in Belagavi?",
        answer:
          "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590016 (VFF GROUP — First Floor).",
      },
      {
        question: "Do you offer online and offline classes in Belagavi?",
        answer:
          "Yes. Students can join online or offline batches. Morning 9–11, Afternoon 3–5, and Evening 6–8 slots are available.",
      },
    ],
  },
  {
    slug: "software-training-in-belgaum",
    city: "Belgaum",
    aliases: ["Belagavi"],
    region: "North Karnataka",
    state: "Karnataka",
    nearbyCopy: "Belgaum city and surrounding localities (officially Belagavi)",
    focusKeywords: [
      "best software training institute in belgaum",
      "best academy in belgaum",
      "software institute in belgaum",
      "full stack training belgaum",
      "python course in belgaum",
      "it training institute belgaum",
      "software coaching classes belgaum",
    ],
    seoTitle: "Best Software Training Institute in Belgaum | AZDeploy Academy",
    seoDescription:
      "Looking for the best software training institute in Belgaum? AZDeploy Academy (Belagavi) offers Full Stack, AI & DevOps with real projects, mentors, and job-focused learning.",
    headline: "Best Software Training Institute in Belgaum",
    intro:
      "Belgaum (officially Belagavi) learners choose AZDeploy Academy for job-ready software training. Same city, same campus — Full Stack, AI, and DevOps taught the way product teams actually work.",
    whyBullets: [
      "Known locally as Belgaum; our academy operates in Belagavi with clear NAP on Google Maps.",
      "Small batches — code reviews, mentorship, and accountability.",
      "Build and deploy real systems: frontend, backend, database, DevOps, and AI features.",
      "Ideal if you searched “best academy in Belgaum” or “software institute near Belgaum”.",
    ],
    localAngle:
      "Many students still search “Belgaum” even though the official name is Belagavi. AZDeploy Academy ranks and serves both — one campus, one program, Belgaum’s practical path to becoming a software engineer.",
    commuteNote:
      "Campus in Belagavi (Belgaum): Plot 516, Ramteerth Nagar, Auto Nagar. Easy to reach from central Belgaum localities and nearby towns.",
    programs: [
      "6-month Full-Stack + AI + DevOps",
      "Online + offline modes for Belgaum students",
      "Interview prep and placement support roadmap",
    ],
    faqs: [
      {
        question: "Is software training in Belgaum the same as Belagavi?",
        answer:
          "Yes. Belgaum is the former / commonly used name for Belagavi. AZDeploy Academy is based in Belagavi and serves everyone searching for software training in Belgaum.",
      },
      {
        question: "What courses are available for Belgaum students?",
        answer:
          "Our flagship is a 6-month Full-Stack + AI + DevOps program, plus specialized tracks in AI, Full Stack, Android, and DevOps — all with online or offline options.",
      },
      {
        question: "How do I enroll from Belgaum?",
        answer:
          "Enquire on WhatsApp (+91 82965 65587), submit the online form, or visit the Auto Nagar campus. Mention your preferred batch timing.",
      },
    ],
  },
  {
    slug: "software-training-in-hubli",
    city: "Hubli",
    aliases: ["Hubballi"],
    region: "North Karnataka",
    state: "Karnataka",
    nearbyCopy: "Hubli–Dharwad twin cities, Vidyanagar, Unkal, and surrounding areas",
    focusKeywords: [
      "software training institute in hubli",
      "best software institute hubli",
      "full stack training hubli",
      "software institute hubballi",
      "it training hubli dharwad",
      "devops course hubli",
      "python full stack hubli",
    ],
    seoTitle: "Best Software Training for Hubli / Hubballi Students | AZDeploy Academy",
    seoDescription:
      "Students from Hubli (Hubballi) join AZDeploy Academy Belagavi for Full Stack, AI & DevOps — job-ready training with online batches or campus visits from Hubli–Dharwad.",
    headline: "Software Training Institute for Hubli & Hubballi Students",
    intro:
      "Hubli (Hubballi) students looking for serious software engineering training often outgrow short tutorial courses. AZDeploy Academy in Belagavi offers a complete Full-Stack + AI + DevOps path — join online from Hubli or attend offline batches.",
    whyBullets: [
      "Trusted option for Hubli–Dharwad learners who want production-grade skills.",
      "Online live classes so you can train from Hubli without relocating immediately.",
      "Weekend / evening-friendly batch options for college and working professionals.",
      "Curriculum matches what Hubli IT employers and product teams expect: ship, deploy, explain.",
    ],
    localAngle:
      "Hubballi–Dharwad is a major education hub. Pair that academic base with AZDeploy’s Belagavi industry program — React, Django, PostgreSQL, Linux, Docker, CI/CD, AWS, and applied AI.",
    commuteNote:
      "Online learning from Hubli is fully supported. Campus visits to Belagavi (Auto Nagar) are available for mentoring, assessments, and placement guidance.",
    programs: [
      "Full-Stack + AI + DevOps (online from Hubli)",
      "Specialized AI / DevOps / Full Stack tracks",
      "Placement-oriented projects and interview prep",
    ],
    faqs: [
      {
        question: "Can I join AZDeploy Academy from Hubli / Hubballi?",
        answer:
          "Yes. Many Hubli–Dharwad students join online batches. You can also visit our Belagavi campus for offline sessions and mentoring.",
      },
      {
        question: "Is there a software institute in Hubli like AZDeploy?",
        answer:
          "AZDeploy Academy’s campus is in Belagavi, with online delivery designed for Hubli and Hubballi students who want the same job-ready Full Stack + AI + DevOps curriculum.",
      },
      {
        question: "What is the program duration for Hubli students?",
        answer:
          "The flagship program is 6 months, with morning, afternoon, and evening batch choices — including options that fit Hubli college and office schedules.",
      },
    ],
  },
  {
    slug: "software-training-in-dharwad",
    city: "Dharwad",
    aliases: ["Hubli-Dharwad"],
    region: "North Karnataka",
    state: "Karnataka",
    nearbyCopy: "Dharwad city, Hubli–Dharwad, and nearby college localities",
    focusKeywords: [
      "software training institute in dharwad",
      "best it institute dharwad",
      "full stack course dharwad",
      "software coaching dharwad",
      "python training dharwad",
      "devops institute near dharwad",
    ],
    seoTitle: "Best Software Training for Dharwad Students | AZDeploy Academy",
    seoDescription:
      "Dharwad students: learn Full Stack, AI & DevOps with AZDeploy Academy Belagavi. Online + campus options, real projects, and placement-focused mentorship.",
    headline: "Software Training Institute Serving Dharwad Students",
    intro:
      "Dharwad is known for education. AZDeploy Academy turns that academic strength into employable software engineering skills — Full Stack, AI, and DevOps with deployment and interview readiness.",
    whyBullets: [
      "Built for Dharwad college students and fresh graduates targeting IT roles.",
      "Online batches from Dharwad; offline mentoring at Belagavi campus when needed.",
      "Focus on fundamentals + shipping: not crash-course fluff.",
      "Strong fit if you searched “best IT institute near Dharwad” for real engineering skills.",
    ],
    localAngle:
      "From Dharwad to Belagavi, North Karnataka needs engineers who can own a feature end-to-end. Our 6-month track covers UI, APIs, databases, Linux, Docker, CI/CD, and AI integration.",
    commuteNote:
      "Train online from Dharwad, or plan campus visits to Belagavi (Ramteerth Nagar / Auto Nagar) for labs and placement support.",
    programs: [
      "6-month industry-ready Full-Stack + AI + DevOps",
      "Specialized tracks for AI-focused or DevOps-focused learners",
      "Resume, GitHub, and interview preparation",
    ],
    faqs: [
      {
        question: "Does AZDeploy Academy have a center in Dharwad?",
        answer:
          "Our main campus is in Belagavi. Dharwad students join via live online classes and can visit Belagavi for offline mentoring and assessments.",
      },
      {
        question: "What makes this suitable for Dharwad engineering / CS students?",
        answer:
          "We bridge campus theory with production practice — system design habits, deployment, debugging, and portfolio projects that interview panels respect.",
      },
      {
        question: "How do Dharwad students enquire?",
        answer:
          "WhatsApp +91 82965 65587 or the enquiry form on azdeploy.com. Mention you are from Dharwad and your preferred batch timing.",
      },
    ],
  },
  {
    slug: "software-training-in-kolhapur",
    city: "Kolhapur",
    aliases: ["Kholapur"],
    region: "Western Maharashtra",
    state: "Maharashtra",
    nearbyCopy: "Kolhapur city (also searched as Kholapur) and nearby towns toward Belagavi",
    focusKeywords: [
      "software training institute in kolhapur",
      "software institute in kholapur",
      "full stack institute kolhapur",
      "best software course kolhapur",
      "it training near kolhapur",
      "python full stack kolhapur",
    ],
    seoTitle: "Best Software Training for Kolhapur Students | AZDeploy Academy",
    seoDescription:
      "Kolhapur (Kholapur) students: join AZDeploy Academy’s Full Stack, AI & DevOps program online or via Belagavi campus — job-ready training with real projects.",
    headline: "Software Training Institute for Kolhapur (Kholapur) Students",
    intro:
      "Kolhapur learners searching for serious IT training can join AZDeploy Academy’s Belagavi program online — Full Stack, AI, and DevOps with mentorship that matches industry hiring.",
    whyBullets: [
      "Serves Kolhapur / Kholapur searchers with clear online enrollment.",
      "Maharashtra–Karnataka corridor students train without waiting for local theory-only institutes.",
      "Marathi / English friendly support; curriculum in practical English.",
      "Same placement-oriented outcomes as Belagavi campus students.",
    ],
    localAngle:
      "Whether you searched “software institute in Kolhapur” or “Kholapur”, AZDeploy Academy gives you a structured 6-month path to ship software — not just watch videos.",
    commuteNote:
      "Most Kolhapur students join online. Campus visits to Belagavi are optional for intensive mentoring. Contact us on WhatsApp for batch fit.",
    programs: [
      "Full-Stack + AI + DevOps (online from Kolhapur)",
      "Specialized AI, Android, DevOps tracks",
      "Job assistance roadmap after program completion",
    ],
    faqs: [
      {
        question: "Can Kolhapur students join AZDeploy Academy?",
        answer:
          "Yes. Online live batches are designed for Kolhapur and nearby Maharashtra learners. Offline campus access is in Belagavi when you want in-person mentoring.",
      },
      {
        question: "Do you cover “Kholapur” searches?",
        answer:
          "Yes — Kholapur is a common misspelling of Kolhapur. Our Kolhapur landing and content are written for both spellings.",
      },
      {
        question: "What should I ask on WhatsApp from Kolhapur?",
        answer:
          "Share your city (Kolhapur), education background, preferred batch (morning/afternoon/evening), and whether you want online or hybrid learning.",
      },
    ],
  },
];

export function cityLandingUrl(slug: string): string {
  return `/${slug}`;
}

export function getCityLanding(slug: string): CityLanding | undefined {
  return CITY_LANDINGS.find((c) => c.slug === slug);
}
