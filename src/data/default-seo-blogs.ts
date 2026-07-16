import type { BlogPostRow } from "@/lib/hq-blog-types";

const AUTHOR = "AZ Deploy Academy";
const NOW = Date.UTC(2026, 6, 1, 10, 0, 0);

function words(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

function post(
  partial: Omit<BlogPostRow, "id" | "published" | "createdAt" | "updatedAt" | "publishedAt" | "authorName" | "readingTimeMin"> & {
    id: string;
    publishedAt?: number;
  }
): BlogPostRow {
  const publishedAt = partial.publishedAt ?? NOW;
  return {
    ...partial,
    published: true,
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
    authorName: AUTHOR,
    readingTimeMin: words(partial.body),
  };
}

/**
 * Default SEO posts for short-tail + long-tail ranking.
 * Shown on /blog when the slug is not already published from HQ/Django.
 * HQ can create the same slug (via seed or new post) to override/edit.
 */
export const DEFAULT_SEO_BLOG_POSTS: BlogPostRow[] = [
  post({
    id: "seo-best-software-training-belagavi",
    title: "Best Software Training Institute in Belagavi — Why AZDeploy Academy",
    slug: "best-software-training-institute-in-belagavi",
    excerpt:
      "Looking for the best software training institute in Belagavi? Compare what actually matters: projects, deployment, mentors, and placement readiness.",
    seoTitle: "Best Software Training Institute in Belagavi | AZDeploy Academy",
    seoDescription:
      "AZDeploy Academy is Belagavi’s job-ready software training academy for Full Stack, AI & DevOps. Real projects, deployment, and interview prep.",
    keywords:
      "best software training institute in belagavi, best academy in belagavi, software institute belagavi, full stack course belagavi",
    body: `## Best software training institute in Belagavi

If you are searching for the **best software training institute in Belagavi** or the **best academy in Belagavi**, look past flashy ads. Ask: Will you ship real software? Can you explain your project in an interview? Have you deployed anything?

### What “best” should mean in Belagavi

- **Production skills** — React, Django/APIs, PostgreSQL, Linux, Nginx, Docker, CI/CD
- **AI that helps, not hides gaps** — use AI after you understand fundamentals
- **Small batches** — code reviews and mentorship, not anonymous recorded lectures
- **Job assistance** — resume, GitHub portfolio, and interview practice for serious completers

### Why students choose AZDeploy Academy in Belagavi

AZDeploy Academy is based at **Ramteerth Nagar / Auto Nagar, Belagavi**. Our flagship is a **6-month Full-Stack + AI + DevOps** program with morning, afternoon, and evening batches — online and offline.

Explore the [courses page](/courses) or our Belagavi landing: [software training in Belagavi](/software-training-in-belagavi).

Also searching **Belgaum**? Same city, same campus — see [software training in Belgaum](/software-training-in-belgaum).

### Next step

Enquire on WhatsApp or visit the campus. Mention your preferred batch timing and whether you want online or offline learning.`,
  }),

  post({
    id: "seo-best-software-training-belgaum",
    title: "Best Software Training Institute in Belgaum (Belagavi)",
    slug: "best-software-training-institute-in-belgaum",
    excerpt:
      "Belgaum students: find job-ready Full Stack, AI, and DevOps training at AZDeploy Academy — Belagavi’s practical software academy.",
    seoTitle: "Best Software Training Institute in Belgaum | AZDeploy Academy",
    seoDescription:
      "Best software training institute in Belgaum (Belagavi): Full Stack + AI + DevOps with real projects, mentors, and placement-focused learning.",
    keywords:
      "best software training institute in belgaum, software institute belgaum, best academy in belgaum, it training belgaum",
    body: `## Best software training institute in Belgaum

**Belgaum** is still how many people search — even though the official name is **Belagavi**. If you want the **best software training institute in Belgaum**, you need a program that builds engineers, not certificate collectors.

### AZDeploy Academy for Belgaum learners

- Campus in Belagavi (Belgaum region)
- Full-Stack + AI + DevOps in one coherent track
- Online + offline options
- Placement-oriented projects and interview prep

Read more on [software training in Belgaum](/software-training-in-belgaum) and [courses](/courses).

### Short-tail vs long-tail searches we help with

- Short: software institute Belgaum, IT training Belgaum
- Long: best software training institute in Belgaum for placement, Python full stack course in Belgaum with job assistance`,
    publishedAt: Date.UTC(2026, 6, 2, 10, 0, 0),
  }),

  post({
    id: "seo-full-stack-developer-course",
    title: "Full Stack Developer Course: What You Must Learn in 2026",
    slug: "full-stack-developer-course-what-to-learn",
    excerpt:
      "A practical full stack developer course covers frontend, backend, database, and deployment — not just tutorials. Here’s the checklist.",
    seoTitle: "Full Stack Developer Course Guide | AZDeploy Academy",
    seoDescription:
      "What a real full stack developer course should include: React, APIs, databases, auth, and deployment. AZDeploy Academy Belagavi curriculum overview.",
    keywords:
      "full stack developer course, full stack course, full stack training, react django course, full stack developer",
    body: `## Full stack developer course — the non-negotiables

A **full stack developer course** should train you to own a feature end-to-end:

1. **Frontend** — React components, routing, forms, API consumption  
2. **Backend** — Django/REST, auth, validation, business logic  
3. **Database** — PostgreSQL schema design, queries, indexes  
4. **Ops basics** — Linux, Nginx, env vars, Docker, simple CI/CD  

### Avoid toy-only courses

Todo apps alone will not get you hired. Employers ask about failures, scaling, and deployment.

AZDeploy Academy’s program combines full stack with **AI** and **DevOps** so you can ship and operate software. See [courses](/courses).`,
    publishedAt: Date.UTC(2026, 6, 3, 10, 0, 0),
  }),

  post({
    id: "seo-python-full-stack-belagavi",
    title: "Python Full Stack Course in Belagavi — Django + React Path",
    slug: "python-full-stack-course-in-belagavi",
    excerpt:
      "Python full stack in Belagavi: Django APIs, React UI, PostgreSQL, and deployment. How AZDeploy Academy structures the learning path.",
    seoTitle: "Python Full Stack Course in Belagavi | Django + React",
    seoDescription:
      "Join a Python full stack course in Belagavi covering Django, React, PostgreSQL, and deployment. Job-ready training at AZDeploy Academy.",
    keywords:
      "python full stack course in belagavi, django training belagavi, python django institute belagavi, react django course",
    body: `## Python full stack course in Belagavi

Python remains one of the strongest backends for product teams. A serious **Python full stack course in Belagavi** should include:

- Python fundamentals and debugging discipline  
- **Django** for APIs and server-side apps  
- **React** for modern UIs  
- **PostgreSQL** for real data modeling  
- Deploying behind **Nginx** on a Linux VPS  

### Learn in Belagavi with AZDeploy

Our mentors teach the stack they use in production. Browse [courses](/courses) or enquire from the Belagavi campus page: [software training in Belagavi](/software-training-in-belagavi).`,
    publishedAt: Date.UTC(2026, 6, 4, 10, 0, 0),
  }),

  post({
    id: "seo-devops-course-belagavi",
    title: "DevOps Course in Belagavi: Linux, Docker, CI/CD, AWS Basics",
    slug: "devops-course-in-belagavi",
    excerpt:
      "DevOps training in Belagavi that goes beyond buzzwords — shell, Nginx, containers, pipelines, and cloud VPS deployment.",
    seoTitle: "DevOps Course in Belagavi | Linux Docker CI/CD",
    seoDescription:
      "DevOps course in Belagavi: Linux, Nginx, Docker, CI/CD, and AWS VPS deployment. Part of AZDeploy Academy’s industry-ready program.",
    keywords:
      "devops course in belagavi, devops institute belagavi, docker training belagavi, linux devops course",
    body: `## DevOps course in Belagavi

Companies hire engineers who can **deploy and operate**, not only write features. A useful **DevOps course in Belagavi** covers:

- Linux users, processes, networking basics  
- Nginx as reverse proxy  
- Docker images and compose  
- CI/CD so every change is tested  
- Deploying to a cloud VPS with HTTPS  

At AZDeploy Academy, DevOps is integrated with Full Stack and AI — not a disconnected mini-course. Details on [courses](/courses).`,
    publishedAt: Date.UTC(2026, 6, 5, 10, 0, 0),
  }),

  post({
    id: "seo-ai-training-belagavi",
    title: "AI Training in Belagavi: Practical Gen AI for Software Engineers",
    slug: "ai-training-in-belagavi-for-software-engineers",
    excerpt:
      "AI training in Belagavi focused on real product use — APIs, prompts, guardrails — after you have strong engineering fundamentals.",
    seoTitle: "AI Training in Belagavi | Practical Gen AI Course",
    seoDescription:
      "AI training academy in Belagavi for software engineers. Learn practical Gen AI integration with Full Stack & DevOps at AZDeploy Academy.",
    keywords:
      "ai training belagavi, ai training academy belagavi, gen ai course belagavi, artificial intelligence course belagavi",
    body: `## AI training in Belagavi that employers respect

**AI training in Belagavi** should not replace fundamentals. The winning pattern:

1. Strong full-stack and systems basics  
2. Then applied AI — prompts, APIs, structured outputs, safe fallbacks  
3. Ship an AI-assisted feature in a real app  

AZDeploy Academy combines AI with Full Stack and DevOps so you stay hireable when tools change. See specialized tracks on [courses](/courses).`,
    publishedAt: Date.UTC(2026, 6, 6, 10, 0, 0),
  }),

  post({
    id: "seo-become-software-engineer-6-months",
    title: "How to Become a Software Engineer in 6 Months (Belagavi Guide)",
    slug: "how-to-become-a-software-engineer-in-6-months",
    excerpt:
      "A realistic 6-month path to become a software engineer: stack, projects, deployment, and interview habits — from Belagavi’s AZDeploy Academy.",
    seoTitle: "Become a Software Engineer in 6 Months | Belagavi Guide",
    seoDescription:
      "How to become a software engineer in 6 months with Full Stack, AI & DevOps. Practical roadmap from AZDeploy Academy Belagavi.",
    keywords:
      "how to become a software engineer in 6 months, become software engineer, software engineer training, job ready software course",
    body: `## How to become a software engineer in 6 months

Short answer: **depth + shipping**, not random tutorials.

### Month-by-month mindset

- **Months 1–2** — language, Git, HTTP, SQL basics  
- **Months 3–4** — full-stack features with reviews  
- **Months 5–6** — deployment, DevOps, AI features, interview drills  

### Belagavi program

AZDeploy Academy’s flagship is built exactly for this arc. Read [courses](/courses) and enquire with your batch preference (9–11 / 3–5 / 6–8).`,
    publishedAt: Date.UTC(2026, 6, 7, 10, 0, 0),
  }),

  post({
    id: "seo-software-training-hubli-dharwad",
    title: "Software Training for Hubli & Dharwad Students (Online + Campus)",
    slug: "software-training-for-hubli-dharwad-students",
    excerpt:
      "Hubli and Dharwad students can join AZDeploy Academy’s Full Stack + AI + DevOps program online, with Belagavi campus mentoring when needed.",
    seoTitle: "Software Training Hubli Dharwad | AZDeploy Academy",
    seoDescription:
      "Best software training option for Hubli, Hubballi & Dharwad students — Full Stack, AI, DevOps online from AZDeploy Academy Belagavi.",
    keywords:
      "software training hubli, software institute hubballi, software institute dharwad, it training hubli dharwad, full stack hubli",
    body: `## Software training for Hubli & Dharwad

Hubli (**Hubballi**) and Dharwad students often want industry-grade training without relocating on day one.

### How AZDeploy helps

- Live **online** batches from Hubli–Dharwad  
- Optional visits to **Belagavi** campus  
- Same curriculum: Full Stack + AI + DevOps  

City pages: [Hubli](/software-training-in-hubli) · [Dharwad](/software-training-in-dharwad) · [courses](/courses)`,
    publishedAt: Date.UTC(2026, 6, 8, 10, 0, 0),
  }),

  post({
    id: "seo-software-training-kolhapur",
    title: "Software Training for Kolhapur (Kholapur) Students — Online Program",
    slug: "software-training-for-kolhapur-students",
    excerpt:
      "Kolhapur / Kholapur learners: join AZDeploy Academy online for Full Stack, AI, and DevOps with Belagavi mentors.",
    seoTitle: "Software Training Kolhapur | Online Full Stack AI DevOps",
    seoDescription:
      "Software institute option for Kolhapur (Kholapur) students — online Full Stack, AI & DevOps with AZDeploy Academy Belagavi.",
    keywords:
      "software training kolhapur, software institute kholapur, full stack course kolhapur, it training near kolhapur",
    body: `## Software training for Kolhapur students

Whether you searched **Kolhapur** or **Kholapur**, you need a structured path to ship software.

AZDeploy Academy delivers **online** Full-Stack + AI + DevOps training with mentors based in Belagavi. Optional campus visits available.

More: [software training in Kolhapur](/software-training-in-kolhapur) · [courses](/courses)`,
    publishedAt: Date.UTC(2026, 6, 9, 10, 0, 0),
  }),

  post({
    id: "seo-job-oriented-software-course",
    title: "Job Oriented Software Course in Belagavi with Placement Support",
    slug: "job-oriented-software-course-belagavi-placement",
    excerpt:
      "What a job-oriented software course in Belagavi should include: projects, deployment, interviews, and honest placement guidance.",
    seoTitle: "Job Oriented Software Course Belagavi | Placement Support",
    seoDescription:
      "Job oriented software course in Belagavi with placement support roadmap. Full Stack + AI + DevOps at AZDeploy Academy.",
    keywords:
      "job oriented software course, software course with placement belagavi, placement software training, job ready it course belagavi",
    body: `## Job oriented software course in Belagavi

“Placement guarantee” ads are common. A real **job-oriented software course** focuses on:

- Client-style projects and code quality  
- Deployment experience  
- Resume + GitHub portfolio  
- Mock interviews and system-design basics  
- Placement assistance for students who complete the program seriously  

That’s the AZDeploy Academy model. Start at [courses](/courses) or [enquiry](/enquiry).`,
    publishedAt: Date.UTC(2026, 6, 10, 10, 0, 0),
  }),

  post({
    id: "seo-online-offline-software-training",
    title: "Online vs Offline Software Training in Belagavi — Which Should You Choose?",
    slug: "online-vs-offline-software-training-belagavi",
    excerpt:
      "Compare online and offline software training in Belagavi. AZDeploy Academy offers both with the same curriculum depth.",
    seoTitle: "Online vs Offline Software Training Belagavi",
    seoDescription:
      "Online and offline software training in Belagavi from AZDeploy Academy. Same Full Stack + AI + DevOps curriculum — pick your mode.",
    keywords:
      "online software training belagavi, offline software training belagavi, online full stack course, hybrid it training belagavi",
    body: `## Online vs offline software training in Belagavi

### Choose offline if you want
- Campus accountability and peer energy  
- Easier mentoring conversations  

### Choose online if you are in
- Hubli, Dharwad, Kolhapur, or another city  
- A job with fixed office hours (evening batch)

AZDeploy Academy keeps **curriculum quality consistent** in both modes. Batches: morning 9–11, afternoon 3–5, evening 6–8. See [courses](/courses).`,
    publishedAt: Date.UTC(2026, 6, 11, 10, 0, 0),
  }),

  post({
    id: "seo-software-institute-near-me",
    title: "Software Institute Near Me in Belagavi — How to Pick the Right One",
    slug: "software-institute-near-me-belagavi",
    excerpt:
      "Searching ‘software institute near me’ in Belagavi? Use this checklist before you pay — then visit AZDeploy Academy at Auto Nagar.",
    seoTitle: "Software Institute Near Me Belagavi | How to Choose",
    seoDescription:
      "Software institute near me in Belagavi — checklist for quality training. Visit AZDeploy Academy, Auto Nagar, Belagavi for Full Stack + AI + DevOps.",
    keywords:
      "software institute near me, software training near me, software coaching near belagavi, it institute near me belagavi",
    body: `## Software institute near me — Belagavi checklist

When Google shows “**software institute near me**”, verify:

1. Do they teach deployment or only slideshows?  
2. Are batch sizes small enough for reviews?  
3. Is the stack current (React, Django/APIs, Postgres, Linux/Docker)?  
4. Is NAP clear on Maps?

### Visit AZDeploy Academy

**Plot 516, Ramteerth Nagar, Auto Nagar, Belagavi 590016**  
WhatsApp: +91 82965 65587  

[Contact](/contact) · [Courses](/courses) · [Belagavi training page](/software-training-in-belagavi)`,
    publishedAt: Date.UTC(2026, 6, 12, 10, 0, 0),
  }),
];

export function getDefaultSeoBlogBySlug(slug: string): BlogPostRow | null {
  const norm = slug.toLowerCase();
  return DEFAULT_SEO_BLOG_POSTS.find((p) => p.slug.toLowerCase() === norm) ?? null;
}
