export type EbookWorksheetField = {
  label: string;
  lines?: number;
};

export type EbookPage =
  | {
      type: "cover";
      title: string;
      subtitle: string;
      badge: string;
      bullets: string[];
    }
  | {
      type: "intro";
      title: string;
      body: string[];
      howToUse: string[];
    }
  | {
      type: "roadmap";
      title: string;
      stages: { name: string; topics: string[] }[];
    }
  | {
      type: "module";
      moduleNo: number;
      title: string;
      goal: string;
      concepts: string[];
      tips: string[];
    }
  | {
      type: "worksheet";
      title: string;
      instructions: string;
      fields: EbookWorksheetField[];
    }
  | {
      type: "fillblank";
      title: string;
      prompts: { q: string; blanks: number }[];
    }
  | {
      type: "diagram";
      title: string;
      caption: string;
      boxes: string[];
      notes: string[];
    }
  | {
      type: "checklist";
      title: string;
      items: string[];
    }
  | {
      type: "interview";
      title: string;
      pairs: { q: string; a: string }[];
    }
  | {
      type: "notes";
      title: string;
      lines: number;
    };

export const AI_ENGINEERING_META = {
  slug: "ai-engineering",
  title: "AI Engineering Playbook",
  subtitle: "Industry-ready LLM systems · RAG · evaluation · shipping to production",
  edition: "Edition 1 · Job-ready workbook",
  priceInr: 4999,
} as const;

export const AI_ENGINEERING_PAGES: EbookPage[] = [
  {
    type: "cover",
    title: "AI Engineering Playbook",
    subtitle: "Build, evaluate, and ship LLM-powered products — not just demos",
    badge: "AZ Deploy Academy · Job-ready workbook",
    bullets: [
      "Prompt patterns that survive production",
      "RAG pipelines, embeddings & retrieval checklists",
      "Evaluation, cost, latency & safety worksheets",
      "Interview Q&A + portfolio mini-project tracker",
    ],
  },
  {
    type: "intro",
    title: "How to use this playbook",
    body: [
      "This is a practice workbook — not a theory dump. Each module has concepts, then a worksheet you fill by hand.",
      "Work in order for your first pass. On revision, jump to worksheets and interview pages.",
      "Treat every blank as interview practice: write short, precise answers you can say out loud.",
    ],
    howToUse: [
      "Use a pen — handwriting sticks better than highlighting.",
      "Complete one module + worksheet per session (45–60 min).",
      "After Module 5, start the mini-project checklist with a real repo.",
      "Revisit Interview Q&A weekly until answers feel natural.",
    ],
  },
  {
    type: "roadmap",
    title: "AI Engineering learning roadmap",
    stages: [
      {
        name: "Foundations",
        topics: ["Tokens & context", "Chat vs completion", "Temperature / top-p", "System vs user prompts"],
      },
      {
        name: "Prompt craft",
        topics: ["Role + constraints", "Few-shot", "Structured outputs", "Tool-calling intent"],
      },
      {
        name: "RAG systems",
        topics: ["Chunking", "Embeddings", "Vector DBs", "Hybrid retrieval", "Citations"],
      },
      {
        name: "Ship & operate",
        topics: ["Eval sets", "Cost budgets", "Latency SLOs", "Safety rails", "Observability"],
      },
    ],
  },
  {
    type: "module",
    moduleNo: 1,
    title: "AI Engineering foundations",
    goal: "Explain how LLMs generate text and what product constraints that creates.",
    concepts: [
      "Token ≈ piece of text the model reads/writes; context window is the hard limit.",
      "System message sets rules; user message is the task; assistant is the model reply.",
      "Higher temperature → more variety; lower → more deterministic (prefer low for tools).",
      "Hallucinations are confident wrong answers — design for verification, not trust.",
      "AI Engineering = product + data + model APIs + eval + ops — not notebooks alone.",
    ],
    tips: [
      "Never put secrets in prompts that get logged.",
      "Prefer JSON / schema outputs for anything an app must parse.",
      "Measure tokens and cost on day one — surprise bills kill demos.",
    ],
  },
  {
    type: "fillblank",
    title: "Worksheet · Foundations",
    prompts: [
      { q: "Context window means ________________________________________________", blanks: 1 },
      { q: "I would set temperature low when _____________________________________", blanks: 1 },
      { q: "A hallucination is ___________________________________________________", blanks: 1 },
      { q: "Three layers of an AI feature: ________ / ________ / ________", blanks: 1 },
      { q: "Why system prompts matter: __________________________________________", blanks: 1 },
    ],
  },
  {
    type: "module",
    moduleNo: 2,
    title: "Prompt engineering that ships",
    goal: "Write prompts that are testable, constrained, and safe for production apps.",
    concepts: [
      "Pattern: Role → Goal → Constraints → Format → Examples → Refusal rules.",
      "Few-shot examples beat long vague instructions for style and schema.",
      "Chain-of-thought is useful for reasoning tasks; hide it from end users if needed.",
      "Tool calling: model proposes actions; your backend validates and executes.",
      "Version prompts like code — name, changelog, owner, eval score.",
    ],
    tips: [
      "One prompt = one job. Split complex flows into steps.",
      "Add explicit “if unsure, say so” for customer-facing assistants.",
      "Escape / separate untrusted user input to reduce prompt injection.",
    ],
  },
  {
    type: "worksheet",
    title: "Worksheet · Prompt design sheet",
    instructions: "Design a production prompt for: “College ERP chatbot that answers fee & timetable questions from approved docs only.”",
    fields: [
      { label: "Role (who is the assistant?)", lines: 2 },
      { label: "Goal (what success looks like)", lines: 2 },
      { label: "Hard constraints (must / must-not)", lines: 3 },
      { label: "Output format (JSON / bullets / citation rules)", lines: 3 },
      { label: "Two few-shot examples (Q → A)", lines: 5 },
      { label: "Refusal / escalation rule", lines: 2 },
    ],
  },
  {
    type: "module",
    moduleNo: 3,
    title: "RAG & knowledge grounding",
    goal: "Ground answers in your documents so the product is useful and auditable.",
    concepts: [
      "RAG = Retrieve relevant chunks → Augment prompt → Generate answer.",
      "Chunking strategy (size + overlap) controls recall quality more than model choice often.",
      "Embeddings map text to vectors; similarity search finds nearest neighbors.",
      "Hybrid retrieval (keyword + vector) helps names, IDs, and rare terms.",
      "Always return sources / citations when answers affect money, grades, or legal risk.",
    ],
    tips: [
      "Garbage docs → garbage RAG. Clean and structure knowledge first.",
      "Re-index when content changes; stale vectors lose trust.",
      "Evaluate retrieval separately from generation (hit rate @k).",
    ],
  },
  {
    type: "diagram",
    title: "Diagram · RAG pipeline (draw & label)",
    caption: "Sketch arrows between boxes. Annotate where chunking, embedding, and citations happen.",
    boxes: [
      "1. User question",
      "2. Query rewrite / filters",
      "3. Vector + keyword search",
      "4. Top-k chunks",
      "5. Prompt + context",
      "6. LLM answer + citations",
      "7. Logs / feedback",
    ],
    notes: [
      "Mark the trust boundary: which steps see PII?",
      "Circle the step you would monitor for latency first.",
      "Write one failure mode next to each box (empty retrieval, wrong chunk, etc.).",
    ],
  },
  {
    type: "module",
    moduleNo: 4,
    title: "Evaluation, safety & quality",
    goal: "Prove the feature works before you scale traffic.",
    concepts: [
      "Golden set: fixed Q&A pairs you re-run on every prompt/model change.",
      "Metrics: accuracy / groundedness / refusal correctness / latency / cost per request.",
      "Human review for edge cases; LLM-as-judge only with calibration.",
      "Safety: PII redaction, jailbreak resistance, topic allowlists, rate limits.",
      "Regression = silent quality drop after a “small” prompt tweak — catch it with CI evals.",
    ],
    tips: [
      "Ship with a kill switch and a fallback (FAQ / human handoff).",
      "Log prompts & outputs with retention policy — privacy first.",
      "Track cost per successful answer, not just API spend.",
    ],
  },
  {
    type: "checklist",
    title: "Checklist · Pre-launch AI feature",
    items: [
      "Golden eval set (≥30 cases) covering happy path + refusals",
      "Prompt versioned in repo with owner name",
      "Retrieval hit-rate measured on sample queries",
      "PII / secrets not stored in prompts or vector metadata",
      "Rate limits + auth on the AI endpoint",
      "Latency budget documented (p50 / p95)",
      "Cost budget per day / per user",
      "User-visible “AI can make mistakes” + citation where needed",
      "Incident playbook: how to disable the model path",
      "Feedback button wired to a review queue",
    ],
  },
  {
    type: "module",
    moduleNo: 5,
    title: "Shipping AI into real products",
    goal: "Integrate LLM APIs into web/backend systems with production habits.",
    concepts: [
      "Backend owns keys — never call paid LLM APIs from the browser with secrets.",
      "Async jobs for long generations; stream when UX needs it.",
      "Cache deterministic answers; debounce identical requests.",
      "Feature flags: model A/B, prompt canary, region rollout.",
      "Observability: request id, model, tokens in/out, latency, error class.",
    ],
    tips: [
      "Start with one workflow that saves users time — not a general chatbot.",
      "Prefer structured tool calls over free-form “do everything” agents at first.",
      "Document failure UX as carefully as success UX.",
    ],
  },
  {
    type: "checklist",
    title: "Mini project · Job-ready build",
    items: [
      "Pick a domain you know (ERP fees, campus FAQ, resume coach, support triage)",
      "Write 20 golden questions + expected answers / citations",
      "Ingest ≥15 docs; implement chunk + embed + retrieve",
      "Build a Django/Next API that keeps keys server-side",
      "Return answer + sources in the UI",
      "Add simple eval script that scores golden set",
      "Deploy to VPS with HTTPS; add basic rate limiting",
      "Write a 1-page README: architecture diagram + cost notes",
      "Record a 3-minute demo for interviews",
      "Push code to GitHub with clean commits",
    ],
  },
  {
    type: "interview",
    title: "Interview Q&A cheat sheet",
    pairs: [
      {
        q: "What is RAG and when would you not use it?",
        a: "RAG retrieves external knowledge into the prompt. Skip it when answers must come only from model weights, data is tiny/static in-prompt, or latency/cost cannot afford retrieval.",
      },
      {
        q: "How do you reduce hallucinations?",
        a: "Ground with RAG + citations, constrain formats, lower temperature, require “I don’t know”, evaluate on golden sets, and verify tool outputs before showing users.",
      },
      {
        q: "How do you choose chunk size?",
        a: "Balance context vs precision: too large mixes topics; too small loses meaning. Tune with retrieval metrics (recall@k) and answer quality on real queries.",
      },
      {
        q: "What would you monitor in production?",
        a: "Latency, token cost, error rates, empty retrieval rate, user thumbs-down, jailbreak attempts, and eval score drift after prompt/model changes.",
      },
      {
        q: "Explain prompt injection briefly.",
        a: "Untrusted text tries to override system instructions. Mitigate with separation of data vs instructions, allowlists, output filters, and never blindly executing tool calls.",
      },
    ],
  },
  {
    type: "notes",
    title: "Practice notes · Your own examples",
    lines: 22,
  },
];
