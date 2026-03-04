/**
 * Python Full Stack — End-to-end curriculum slides (Day 1 → Job Ready).
 * Covers: Python, Django/Flask, PostgreSQL, Nginx, Docker, CI/CD, Gunicorn, VPS.
 */

export type SlideKind = "title" | "index" | "overview" | "bullet" | "theory" | "code" | "day" | "detail" | "dynamic";

export interface DynamicExampleTab {
  label: string;
  code: string;
  caption?: string;
  output?: string;
}

/** Dynamic slide: explanation + examples + optional 3D/visual (use 3D only for code/data demos) */
export interface DynamicSlide extends BaseSlide {
  kind: "dynamic";
  explanation: { body: string; points?: string[] };
  examples: { tabs: DynamicExampleTab[] };
  /** Optional scene id for 3D/visual panel. Omit for conceptual slides (e.g. Why Python). */
  visualSceneId?: string;
}

export interface BaseSlide {
  day?: string;
  title: string;
  subtitle?: string;
}

export interface DetailExampleTab {
  label: string;
  code: string;
  caption?: string;
  /** Terminal output shown below the code in the examples panel */
  output?: string;
}

export interface DetailFlowStep {
  id: string;
  label: string;
  desc?: string;
}

export interface DetailWhyItem {
  title: string;
  text: string;
}

/** One part of a detail slide (shown when sectionIndex matches). */
export interface DetailPart {
  partTitle: string;
  theory: { body: string; points?: string[] };
  exampleTabIndex: number;
  /** Indices into slide.detail.flowchartSteps to show in this part. */
  flowchartStepIndices?: number[];
  /** Indices into slide.detail.whyItems to show in this part. */
  whyItemIndices?: number[];
}

export interface DetailSlide extends BaseSlide {
  kind: "detail";
  theory: { body: string; points?: string[] };
  examples: { tabs: DetailExampleTab[] };
  detail: { flowchartSteps: DetailFlowStep[]; whyItems: DetailWhyItem[] };
  /** When set, slide has multiple parts (1/3, 2/3, 3/3); each part shows its own theory, example tab, and slice of flowchart/why. */
  parts?: DetailPart[];
}

export interface TitleSlide extends BaseSlide {
  kind: "title";
}

export interface IndexSlide extends BaseSlide {
  kind: "index";
}

export interface OverviewSlide extends BaseSlide {
  kind: "overview";
  items: string[];
}

export interface BulletSlide extends BaseSlide {
  kind: "bullet";
  items: string[];
  highlight?: string;
}

export interface TheorySlide extends BaseSlide {
  kind: "theory";
  body: string;
  points?: string[];
}

export interface CodeSlide extends BaseSlide {
  kind: "code";
  code: string;
  caption?: string;
  language?: string;
  /** Terminal output shown below code when section index is 1 */
  output?: string;
}

export interface DaySlide extends BaseSlide {
  kind: "day";
  topics: string[];
}

export type Slide =
  | TitleSlide
  | IndexSlide
  | OverviewSlide
  | BulletSlide
  | TheorySlide
  | CodeSlide
  | DaySlide
  | DetailSlide
  | DynamicSlide;

export const PYTHON_CURRICULUM_SLIDES: Slide[] = [
  {
    kind: "title",
    title: "Python Full Stack",
    subtitle: "6 months — Day 1–100 (concepts) + 3 months (training & real-time projects)",
  },
  {
    kind: "index",
    title: "Curriculum Index",
    subtitle: "Day 1 → Day 100 (Month 1–3) | Month 4–6: Projects",
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "Installing Python",
    subtitle: "Python 3.x — see docs.python.org/3",
    explanation: {
      body: "Python runs on your computer so you can write and run scripts. You need to install the Python interpreter (Python 3.x) from the official website. Once installed, you can use the terminal or an IDE like PyCharm or VS Code to run your code.",
      points: [
        "Download the installer from python.org (or docs.python.org/3).",
        "Run the installer — check “Add Python to PATH” on Windows.",
        "Verify: open a terminal and run python --version or python3 --version.",
        "Use an editor: PyCharm, VS Code, or any text editor to write .py files.",
      ],
    },
    examples: {
      tabs: [
        {
          label: "Check version",
          code: `# In terminal (macOS/Linux)
python3 --version
# Example output: Python 3.12.0

# On Windows (if added to PATH)
python --version`,
          caption: "Verify Python is installed",
          output: `$ python3 --version
Python 3.12.0`,
        },
        {
          label: "Where to download",
          code: `# Official site
https://www.python.org/downloads/

# Documentation
https://docs.python.org/3/`,
          caption: "Python 3.x — see docs.python.org/3",
        },
      ],
    },
    visualSceneId: "installing-python",
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "Installing PyCharm / VS Code",
    subtitle: "IDE for Python — PyCharm Community or VS Code",
    explanation: {
      body: "An IDE (Integrated Development Environment) helps you write, run, and debug Python code. PyCharm (JetBrains) and VS Code (Microsoft) are popular choices. Both are free for learning. Install one from the official website, then create or open a project folder to start coding.",
      points: [
        "PyCharm: jetbrains.com/pycharm/download — download Community edition (free).",
        "VS Code: code.visualstudio.com — download for your OS.",
        "Run the installer (Windows .exe, Mac .dmg/.zip, Linux .deb or snap).",
        "Open the IDE and create a new project or open an existing folder.",
      ],
    },
    examples: {
      tabs: [
        {
          label: "PyCharm",
          code: `# After installing PyCharm Community
# 1. Launch PyCharm
# 2. New Project → choose location (e.g. ~/projects/myapp)
# 3. Create → you get a project with interpreter settings
# 4. Right-click project → New → Python File → name it main.py`,
          caption: "Create a project in PyCharm",
        },
        {
          label: "VS Code",
          code: `# After installing VS Code
# 1. Install "Python" extension (ms-python.python)
# 2. File → Open Folder → choose or create a folder
# 3. New File → main.py
# 4. Run: Run Python File or F5 to debug`,
          caption: "Create a project in VS Code",
        },
      ],
    },
    visualSceneId: "installing-pycharm-vscode",
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "Why Python? Why full stack?",
    subtitle: "Motivation and career path",
    explanation: {
      body: "Python is one of the most used languages for web backends, data, and automation. Full stack means you work on both the frontend (what users see) and the backend (server, database, APIs). This course takes you from Python basics to deploying a full web application — so you can build and ship real projects.",
      points: [
        "Why Python: readable syntax, huge ecosystem (Django, Flask, pandas), used in web, data, DevOps.",
        "Why full stack: understand the whole system (UI + API + DB + deploy), more employable, can ship alone.",
        "Outcome: backend APIs (Django/Flask), database (PostgreSQL), containers (Docker), and deployment (VPS/CI).",
      ],
    },
    examples: {
      tabs: [
        {
          label: "Python in one line",
          code: `# Readable, minimal syntax — same idea in fewer lines
names = ["Alice", "Bob", "Carol"]
greetings = [f"Hello, {n}!" for n in names]
print(greetings)
# ['Hello, Alice!', 'Hello, Bob!', 'Hello, Carol!']`,
          caption: "List comprehension — typical Python style",
          output: `['Hello, Alice!', 'Hello, Bob!', 'Hello, Carol!']`,
        },
        {
          label: "Full stack layers",
          code: `# What we'll build toward:
# 1. Frontend (HTML/JS or React) — user interface
# 2. Backend (Django/Flask) — API, business logic
# 3. Database (PostgreSQL) — persistent data
# 4. Server (Nginx + Gunicorn) — serve the app
# 5. Deploy (Docker, VPS, CI/CD) — production`,
          caption: "Layers of a full stack app",
        },
      ],
    },
    visualSceneId: "why-python-fullstack",
  },
];
