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
    subtitle: "Python 3.x",
    explanation: {
      body: "Python runs on your computer so you can write and run scripts. You need to install the Python interpreter (Python 3.x) from the official website. Once installed, you can use the terminal or an IDE like PyCharm or VS Code to run your code.",
      points: [
        "Download the installer from the official Python website.",
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
https://www.python.org/downloads/`,
          caption: "Official Python downloads",
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
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "Introduction to programming & Python",
    subtitle: "What is programming? Why Python?",
    explanation: {
      body: "Programming is giving a computer step-by-step instructions to solve a problem or automate a task. You write code in a language (like Python); a program (the interpreter or compiler) turns that code into actions. Python is a high-level language: you write readable commands, and Python runs them. No need to manage memory or low-level details — focus on logic and data.",
      points: [
        "Program = sequence of instructions the computer executes. Code is stored in text files (e.g. .py).",
        "Python is interpreted: the Python interpreter reads your code line by line and runs it. No separate compile step.",
        "You need: (1) Python installed, (2) a text editor or IDE, (3) to save files as .py and run them with python or python3.",
        "First concepts you'll use: variables (store data), functions (reusable steps), and control flow (if, loops).",
      ],
    },
    examples: {
      tabs: [
        { label: "What code looks like", code: `# Comment — Python ignores it.\nmessage = "Hello"\nprint(message)\n# Run: python intro.py`, caption: "Save as intro.py", output: "Hello" },
        { label: "Why Python is readable", code: `total = 10 + 20\nprint(total)`, caption: "Readable and concise", output: "30" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "How does the Internet work?",
    subtitle: "High-level overview",
    explanation: {
      body: "The Internet is a network of computers that talk using agreed rules (protocols). When you open a website, your device (client) asks another computer (server) for a page; the server sends back data. DNS turns names like google.com into IP addresses. When you build a web app, you run a server that listens for requests and sends responses.",
      points: [
        "Client sends a request; server sends a response. Data travels in packets (TCP/IP, HTTP).",
        "DNS: domain name → IP address so computers find each other.",
        "Your web app will be a server: listen on a port, handle requests, return HTML or JSON.",
      ],
    },
    examples: {
      tabs: [
        { label: "Request–response", code: `# 1. Browser: GET /page → server\n# 2. Server (e.g. Django): runs code, sends HTML\n# 3. Browser displays page. Same for APIs (JSON).`, caption: "Request–response cycle" },
        { label: "URL parts", code: `# https://example.com:443/path?query=1\n# protocol  host    port path  query`, caption: "Understanding URLs" },
      ],
    },
    visualSceneId: "internet-flow",
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "Client, server, HTTP — high level",
    subtitle: "Roles and the HTTP protocol",
    explanation: {
      body: "The client (browser or app) asks for something; the server listens and responds. HTTP is the protocol: client sends GET /page, server responds with status (200, 404) and content. HTTPS is encrypted HTTP. You will build servers (Django) and sometimes clients (Python calling APIs).",
      points: [
        "HTTP methods: GET (read), POST (send data), PUT/PATCH (update), DELETE.",
        "Status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error.",
      ],
    },
    examples: {
      tabs: [
        { label: "HTTP request", code: `GET /index.html HTTP/1.1\nHost: example.com\n# Server: HTTP/1.1 200 OK + content`, caption: "Django will handle such requests" },
        { label: "Python as client", code: `# Later: requests.get("https://api.example.com")\n# r.status_code, r.json()`, caption: "Python can be client and server" },
      ],
    },
    visualSceneId: "http-request-response",
  },
  {
    kind: "dynamic",
    day: "Day 1–6",
    title: "First Python program — print, running scripts",
    subtitle: "Write, save, run",
    explanation: {
      body: "Create a .py file, write print('Hello, World!'), save, then run with python filename.py or python3 filename.py. print() sends text or values to the console. You can print literals and variables. Same flow for every script: edit → save → run. Read tracebacks to fix errors.",
      points: [
        "Run from terminal: python first.py or python3 first.py.",
        "print('text'), print(42), print(a, b). Use sep= and end= for formatting.",
      ],
    },
    examples: {
      tabs: [
        { label: "first.py", code: `print("Hello, World!")\nx = 10\nprint("x is", x)\nprint(1 + 2)`, caption: "Run: python3 first.py", output: "Hello, World!\\nx is 10\\n3" },
        { label: "print options", code: `print(1, 2, 3, sep="-")\nprint("no newline", end="")\nprint(" same line")`, caption: "sep and end", output: "1-2-3\\nno newline same line" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Python syntax, statements & comments",
    subtitle: "Python syntax, statements, comments",
    explanation: {
      body: "Syntax: Python uses indentation (4 spaces or 1 tab) to define blocks; no curly braces. Statements: one per line, or semicolon to separate. Line continuation with backslash or inside parentheses.\nComments: # for single-line; triple-quoted string for multi-line docstrings. Code that isn't commented runs; comments explain intent.",
      points: [
        "Indentation must be consistent (all spaces or all tabs) within a block.",
        "Docstrings: \"\"\"First line. More lines.\"\"\" — used by help() and documentation tools.",
      ],
    },
    examples: {
      tabs: [
        { label: "Indentation", code: `if True:\n    print("indented")\n    print("block")`, output: "indented\nblock" },
        { label: "Comment", code: `# This is a comment\nx = 1  # inline comment`, caption: "Comments ignored" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Python basics — literals, variables, datatypes",
    subtitle: "int, float, str, bool",
    explanation: {
      body: "Literals are values you type directly: 42 (int), 3.14 (float), 'hello' (str), True (bool).\nVariables store values: name = value. Python is dynamically typed — no type declaration needed.\nData types: int (whole numbers), float (decimals), str (text), bool (True/False).\nType conversion: int(), float(), str(), bool() — e.g. int('42'), str(42).",
      points: [
        "Variable names: letters, digits, underscores; cannot start with a digit (see Python Reference).",
        "Keywords (if, for, def, class, etc.) are reserved — don't use as variable names.",
        "Variable names: letters, digits, underscores; keywords are reserved.",
      ],
    },
    examples: {
      tabs: [
        { label: "Literals", code: `age = 25\nname = "Alice"\nprint(age, name)`, output: "25 Alice" },
        { label: "Conversion", code: `print(int("42") + 8)\nprint(str(42) + " eggs")`, output: "50\n42 eggs" },
      ],
    },
    visualSceneId: "python-data-types",
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Operators — arithmetic, comparison, logical",
    subtitle: "Precedence and associativity",
    explanation: {
      body: "Arithmetic: + - * / (float division), // (floor), % (remainder), ** (power).\nComparison: == != < > <= >= — return True/False.\nLogical: and, or, not — combine conditions.\nAssignment: =, +=, -=, *=, /=, etc.\nOperator precedence and associativity determine order; use () to clarify.",
      points: [
        "Identity: is / is not (same object). Membership: in / not in (in sequences).",
        "Precedence: ** then * / // % then + -; comparison then not, and, or.",
      ],
    },
    examples: {
      tabs: [
        { label: "Arithmetic", code: `print(10 // 3, 10 % 3, 2 ** 4)`, output: "3 1 16" },
        { label: "Logical", code: `print(5 < 10 and 10 < 20)`, output: "True" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Python operators — identity, membership, bitwise, precedence",
    subtitle: "Identity, membership, bitwise, operator precedence",
    explanation: {
      body: "Identity: is and is not — check if two variables refer to the same object (not equality).\nMembership: in and not in — test if value is in a sequence (string, list, tuple, set, dict keys).\nBitwise: & | ^ ~ << >> — operate on bits (integers).\nOperator precedence: ** (highest), then * / // %, then + -; comparison operators; then not; then and; then or. Use parentheses to override.",
      points: [
        "x is None is preferred over x == None for identity check.",
        "Precedence: arithmetic → comparison → logical; same group left to right (except **).",
      ],
    },
    examples: {
      tabs: [
        { label: "Membership", code: `print("a" in "abc")\nprint(1 not in [2,3])`, output: "True\nTrue" },
        { label: "Precedence", code: `print(2 + 3 * 4)\nprint((2 + 3) * 4)`, output: "14\n20" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "print(), input(), f-strings",
    subtitle: "Console I/O",
    explanation: {
      body: "print() sends text or values to the console; multiple args separated by space; end= and sep= control formatting.\ninput(prompt) reads one line from the user and returns a string; use int(input()) or float(input()) for numbers.\nf-strings: f'{variable}' or f'{expr}' embed values in strings (Python 3.6+).\nOther formatting: % style, .format().",
      points: [
        "Print: print('Hello', name, sep=' ', end='\\n').",
        "Input always returns str — convert before math: age = int(input('Age? ')).",
      ],
    },
    examples: {
      tabs: [
        { label: "input", code: `name = input("Name? ")\nprint("Hello,", name)`, caption: "input returns str" },
        { label: "f-strings", code: `x, y = 3, 4\nprint(f"{x}+{y}={x+y}")`, output: "3+4=7" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Virtual environment (venv) and pip",
    subtitle: "Isolate dependencies",
    explanation: {
      body: "Virtual environment (venv) isolates project dependencies so each project has its own packages.\npython -m venv .venv creates a .venv folder. Activate: source .venv/bin/activate (Mac/Linux) or .venv\\Scripts\\activate (Windows).\npip install package installs into the active venv. pip freeze > requirements.txt saves the list; pip install -r requirements.txt restores it (essential for Django, Flask, etc.).",
      points: [
        "Always activate venv before installing or running — prompt shows (.venv).",
        "Always use a venv per project; pip install and pip freeze for dependencies.",
      ],
    },
    examples: {
      tabs: [
        { label: "venv", code: `python3 -m venv .venv\nsource .venv/bin/activate`, caption: "Create and activate" },
        { label: "pip", code: `pip install django\npip freeze > requirements.txt`, caption: "Install and save" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 7–14",
    title: "Python numbers, casting & booleans",
    subtitle: "Python numbers, casting, booleans",
    explanation: {
      body: "Numbers: int (whole numbers, unlimited length), float (decimal), complex (j for imaginary). Type with type(x).\nCasting: int(), float(), str() — int('42'), float('3.14'), str(100). Values True/False cast to 1/0.\nBooleans: bool type; True and False. Any value can be used in condition; truthy (non-zero, non-empty) vs falsy (0, 0.0, '', [], None). bool(x) converts.",
      points: [
        "Division / always returns float; // is floor division (int if operands int).",
        "Comparisons return bool; and/or return last evaluated value (short-circuit).",
      ],
    },
    examples: {
      tabs: [
        { label: "Types", code: `print(type(42), type(3.14), type(True))`, output: "<class 'int'> <class 'float'> <class 'bool'>" },
        { label: "Truthy", code: `print(bool(0), bool(1), bool(""))`, output: "False True False" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 15–18",
    title: "Strings — indexing, slicing, methods",
    subtitle: "upper, lower, strip, split, join",
    explanation: {
      body: "Strings are sequences of characters. Indexing: s[0] first, s[-1] last (negative = from end).\nSlicing: s[start:stop] or s[start:stop:step]; omit start/stop for from start / to end.\nMethods: .upper(), .lower(), .strip() (whitespace), .split(sep), .join(iterable).\nOthers: .replace(), .find(), .startswith(), .endswith(), .count() — see Python String Methods reference.",
      points: [
        "Strings are immutable — methods return new strings.",
        "Escape: \\n newline, \\t tab, \\\" quote. Multiline: triple quotes ''' or \"\"\".",
        "Membership: 'a' in s, 'x' not in s.",
      ],
    },
    examples: {
      tabs: [
        { label: "Indexing", code: `s = "Python"\nprint(s[0], s[-1], s[1:4])`, output: "P n yth" },
        { label: "Methods", code: `print("a,b,c".split(","))\nprint(" ".join(["Hello", "World"]))`, output: "['a','b','c']\nHello World" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 15–18",
    title: "Strings — formatting, escape, membership",
    subtitle: "%, .format(), f-strings",
    explanation: {
      body: "String formatting: % (old style), .format() (positional/keyword), f-strings (recommended).\nEscape sequences: \\n \\t \\\\ \\' \\\". Raw strings: r'path\\to\\file'.\nMultiline: '''line1\\nline2'''. Membership: in, not in for substrings.",
      points: [
        "f'{name} is {age}' — readable and fast.",
        "s in t checks if s is substring of t.",
      ],
    },
    examples: {
      tabs: [
        { label: "f-string", code: `name, age = "Alice", 25\nprint(f"{name} is {age}")`, output: "Alice is 25" },
        { label: "Membership", code: `print("py" in "Python")\nprint("xy" not in "Python")`, output: "True\nTrue" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 19–21",
    title: "Control statements — if, if-else, if-elif-else",
    subtitle: "Nested conditionals, ternary",
    explanation: {
      body: "if condition: block (indented). elif and else for multiple branches. Blocks are defined by indentation (4 spaces typical).\nNested conditionals: if inside if — keep logic clear.\nTernary (conditional expression): x if condition else y — one-line choice.\nShorthand: if a > b: print('big') on one line. pass for empty block.",
      points: [
        "Logical operators: and, or, not — combine conditions.",
        "Logical operators: and, or, not — combine conditions.",
      ],
    },
    examples: {
      tabs: [
        { label: "if-else", code: `n = 0\nif n > 0: print("+")\nelse: print("zero")`, output: "zero" },
        { label: "Ternary", code: `status = "adult" if 20 >= 18 else "minor"\nprint(status)`, output: "adult" },
      ],
    },
    visualSceneId: "control-flow",
  },
  {
    kind: "dynamic",
    day: "Day 22–25",
    title: "Loops — for, while, break, continue",
    subtitle: "range(), nested loops",
    explanation: {
      body: "for item in sequence: — iterate over list, string, range, etc.\nfor i in range(n) or range(start, stop, step) — numeric loops.\nwhile condition: — repeat while condition is True; avoid infinite loops.\nbreak — exit loop immediately. continue — skip to next iteration.\nelse on loop: runs when loop ends normally (not by break). Nested loops: loop inside loop.",
      points: [
        "range(5) → 0,1,2,3,4. range(2,6) → 2,3,4,5. range(0,10,2) → 0,2,4,6,8.",
      ],
    },
    examples: {
      tabs: [
        { label: "for", code: `for i in range(3): print(i)`, output: "0\n1\n2" },
        { label: "break/continue", code: `for i in range(5):\n  if i == 2: continue\n  if i == 4: break\n  print(i)`, output: "0\n1\n3" },
      ],
    },
    visualSceneId: "loop-flow",
  },
  {
    kind: "dynamic",
    day: "Day 26–29",
    title: "Lists — append, extend, comprehensions",
    subtitle: "Methods, sort",
    explanation: {
      body: "Lists are ordered, mutable sequences. Append: .append(x). Extend: .extend(iterable). Insert: .insert(i, x). Remove: .remove(x), .pop(i).\nList comprehensions: [expr for x in iterable] or [expr for x in iterable if condition].\nSort: .sort() in place, sorted(list) returns new list. Reverse: .reverse(), reversed(). Copy: .copy() or list[:]. Join lists with +.",
      points: [
        "Access: lst[0], lst[-1]. Slice: lst[1:4]. Loop: for x in lst.",
      ],
    },
    examples: {
      tabs: [
        { label: "Methods", code: `a = [1, 2, 3]\na.append(4)\nprint(a.pop())`, output: "4" },
        { label: "Comprehension", code: `print([x**2 for x in [1, 2, 3, 4]])`, output: "[1, 4, 9, 16]" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 30–35",
    title: "Tuples, sets, dictionaries",
    subtitle: "Immutable, unique, key-value",
    explanation: {
      body: "Tuples: (1, 2, 3) — ordered, immutable. Use for fixed data, unpacking, return multiple values.\nSets: {1, 2, 3} — unordered, unique elements. Add: .add(x). Remove: .remove(x). Set operations: union |, intersection &, difference -.\nDictionaries: {'key': value} — key-value pairs. Access: d['key'] or d.get('key', default). Methods: .keys(), .values(), .items(), .update(). Dict comprehensions.",
      points: [
        "Tuple unpacking: a, b = (1, 2). When to use tuple vs list: immutable vs mutable.",
      ],
    },
    examples: {
      tabs: [
        { label: "Tuple & set", code: `t = (1, 2)\ns = {1, 2, 2, 3}\nprint(s)`, output: "{1, 2, 3}" },
        { label: "Dict", code: `d = {"name": "Alice"}\nprint(d["name"], d.get("x", 0))`, output: "Alice 0" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 36–42",
    title: "Python range, match, JSON, RegEx, dates, math, None",
    subtitle: "Range, match, JSON, RegEx, dates, math, None",
    explanation: {
      body: "range(start, stop, step): immutable sequence of numbers; range(5) → 0..4. Use in for loops and to create lists.\nmatch/case: pattern matching (Python 3.10+); match value: case pattern:.\njson: import json; json.loads(s), json.dumps(obj) — parse and serialize JSON. Essential for APIs.\nre: import re; re.search(), re.findall(), re.sub() — regular expressions.\ndatetime: from datetime import datetime, date; now(), strftime(), timedelta. math: ceil, floor, sqrt, sin, etc. None: absence of value; often as default.",
      points: [
        "list(range(5)) → [0,1,2,3,4]. JSON keys must be double-quoted strings.",
      ],
    },
    examples: {
      tabs: [
        { label: "range", code: `print(list(range(2, 8, 2)))`, output: "[2, 4, 6]" },
        { label: "JSON", code: `import json\nprint(json.loads('{"a":1}'))`, output: "{'a': 1}" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 36–42",
    title: "Functions & modules",
    subtitle: "def, return, import",
    explanation: {
      body: "Define: def name(params): then indented body. return value (or None). Parameters: positional, keyword, default args, *args, **kwargs.\nScope: local vs global. Lambda: small one-line functions. Recursion, generators.\nModules: import module; from module import x. Packages: folder with __init__.py.\nStandard library: os, sys, math, datetime, json.",
      points: [
        "Default args: def greet(name='World'). *args = tuple, **kwargs = dict.",
        "from math import sqrt — use sqrt(16). import math — use math.sqrt(16).",
      ],
    },
    examples: {
      tabs: [
        { label: "Function", code: `def greet(name): return f"Hello, {name}"\nprint(greet("Alice"))`, output: "Hello, Alice" },
        { label: "import", code: `import math\nprint(math.sqrt(16))`, output: "4.0" },
      ],
    },
    visualSceneId: "function-flow",
  },
  {
    kind: "dynamic",
    day: "Day 36–42",
    title: "Python *args, **kwargs, scope, lambda, decorators, recursion, generators",
    subtitle: "Arguments, *args/**kwargs, scope, lambda, decorators, recursion, generators",
    explanation: {
      body: "*args: variable positional args as tuple. **kwargs: variable keyword args as dict. def f(*args, **kwargs):.\nScope: local (inside function), enclosing (closure), global, built-in. global and nonlocal to modify outer names.\nLambda: lambda x: x*2 — anonymous one-expression function. Often used with map, filter, sorted.\nDecorators: function that wraps another; @decorator above def. Recursion: function calls itself; base case to stop.\nGenerators: yield instead of return; produce sequence lazily.",
      points: [
        "sorted(items, key=lambda x: x.name). Generators save memory for large sequences.",
      ],
    },
    examples: {
      tabs: [
        { label: "lambda", code: `f = lambda x, y: x + y\nprint(f(2, 3))`, output: "5" },
        { label: "generator", code: `def gen(): yield 1; yield 2\nprint(list(gen()))`, output: "[1, 2]" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 43–46",
    title: "File handling & exceptions",
    subtitle: "open(), with, try/except",
    explanation: {
      body: "Open: open(path, mode) — 'r' read, 'w' write (overwrite), 'a' append. Always close or use with.\nwith open(path) as f: — context manager closes file automatically. Read: f.read(), f.readline(), f.readlines(). Write: f.write(s).\nExceptions: try: block except ExceptionType: handle. Multiple except, else, finally. raise to throw. Custom exception classes.",
      points: [
        "Best practice: with open('file.txt') as f: content = f.read().",
      ],
    },
    examples: {
      tabs: [
        { label: "File", code: `with open("f.txt","w") as f: f.write("Hi")\nwith open("f.txt") as f: print(f.read())`, output: "Hi" },
        { label: "try/except", code: `try: int("x")\nexcept ValueError: print("Invalid")`, output: "Invalid" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 43–46",
    title: "Python file handling — read line by line, write, delete",
    subtitle: "Read files, write, create, delete",
    explanation: {
      body: "Read: f.read() (whole file), f.readline() (one line), f.readlines() (list of lines). Loop: for line in f:.\nWrite: open(path, 'w') overwrites; 'a' appends. f.write(string); write doesn't add newline.\nDelete: os.remove(path) or pathlib.Path(path).unlink(). Check existence with os.path.exists before remove.\nContext manager with ensures close even on exception.",
      points: [
        "Binary mode: 'rb', 'wb'. Encoding: open(path, encoding='utf-8').",
      ],
    },
    examples: {
      tabs: [
        { label: "Line by line", code: `with open("f.txt") as f:\n  for line in f:\n    print(line.strip())`, caption: "Read lines" },
        { label: "Delete", code: `import os\nif os.path.exists("old.txt"): os.remove("old.txt")`, caption: "Remove file" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 47–55",
    title: "OOP — classes, __init__, inheritance",
    subtitle: "Attributes, methods, polymorphism",
    explanation: {
      body: "Class: blueprint for objects. class Name: then methods. __init__(self, ...) is the constructor; self.attr = value sets instance attributes.\nMethods: first param self. Class variables vs instance variables. Class methods @classmethod, static @staticmethod.\nInheritance: class Child(Parent):. Override methods. super() to call parent. Polymorphism: same interface, different behavior. Encapsulation, abstraction.",
      points: [
        "Django models are classes; you'll use OOP daily in web dev.",
      ],
    },
    examples: {
      tabs: [
        { label: "Class", code: `class Person:\n  def __init__(self, n): self.name = n\n  def greet(self): return f"Hi, {self.name}"\nprint(Person("Alice").greet())`, output: "Hi, Alice" },
        { label: "Inheritance", code: `class Dog(Animal):\n  def speak(self): return "Woof"`, caption: "Override" },
      ],
    },
    visualSceneId: "oop-flow",
  },
  {
    kind: "dynamic",
    day: "Day 47–55",
    title: "Python OOP — self, class properties, class methods, encapsulation",
    subtitle: "self, class properties, class methods, encapsulation",
    explanation: {
      body: "self: first parameter of instance methods; refers to the instance. Passed implicitly when you call obj.method().\nClass properties: instance attributes (self.x) vs class attributes (x = 0 on class). Class methods: @classmethod with cls; static: @staticmethod (no self/cls).\nEncapsulation: hide internal state; use private-by-convention _name or name-mangling __name. Properties: @property for getter/setter. Inner classes: class defined inside another class.",
      points: [
        "cls in @classmethod is the class itself; use for factory methods.",
      ],
    },
    examples: {
      tabs: [
        { label: "classmethod", code: `class C:\n  count = 0\n  @classmethod\n  def get_count(cls): return cls.count`, caption: "Class method" },
        { label: "property", code: `class C:\n  @property\n  def name(self): return self._name`, caption: "Getter" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 56–58",
    title: "HTTP basics & web intro",
    subtitle: "GET/POST, status codes — preparing for Django",
    explanation: {
      body: "HTTP: client sends request (method + URL + headers + optional body); server responds (status + headers + body).\nMethods: GET (read), POST (create/send data), PUT/PATCH (update), DELETE.\nStatus codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error. Request/response headers (Content-Type, etc.).\nBrowser ↔ server. Django will give you request.method, request.GET, request.POST.",
      points: [
        "URLs: scheme, host, port, path, query string. REST uses these methods for APIs.",
      ],
    },
    examples: {
      tabs: [
        { label: "Concepts", code: `# GET /page → 200 + HTML\n# POST /api → 201 + JSON\n# Django: request.method`, caption: "For Django" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 59–65",
    title: "Django — fundamentals",
    subtitle: "MVT, project, apps, URLs, views, templates",
    explanation: {
      body: "Django is a back-end, server-side web framework; free, open source, written in Python. It makes building web pages with Python easier.\nMVT: Model (data), View (logic), Template (HTML). django-admin startproject myproject; python manage.py startapp myapp.\nURLs: urlpatterns map paths to views. Views: functions that take request, return HttpResponse or render(request, 'template.html', context).\nTemplates: HTML with {{ variable }} and {% tag %}. Static files: CSS, JS, images. First Hello World.",
      points: [
        "Learning by doing: create project → add app → define URLs → write views → create templates.",
      ],
    },
    examples: {
      tabs: [
        { label: "View", code: `def home(request):\n  return render(request, "home.html", {"name": "User"})`, caption: "View" },
        { label: "Template", code: `{# home.html #}\n<h1>Hello, {{ name }}</h1>`, caption: "Template" },
      ],
    },
    visualSceneId: "django-mvt",
  },
  {
    kind: "dynamic",
    day: "Day 59–65",
    title: "Django get started — venv, install, create project, create app",
    subtitle: "Virtual environment, install Django, create project, create app",
    explanation: {
      body: "Create Virtual Environment: python -m venv myenv; activate it (source myenv/bin/activate or myenv\\Scripts\\activate).\nInstall Django: pip install django. Verify: django-admin --version.\nCreate Project: django-admin startproject myproject — creates myproject/ with settings.py, urls.py, wsgi.py, asgi.py.\nCreate App: python manage.py startapp myapp — creates myapp/ with models.py, views.py, apps.py. Register app in INSTALLED_APPS. Run server: python manage.py runserver.",
      points: [
        "Project = whole site; app = reusable component (e.g. blog, users). One project, many apps.",
      ],
    },
    examples: {
      tabs: [
        { label: "startproject", code: `django-admin startproject myproject\ncd myproject`, caption: "Creates project folder" },
        { label: "startapp", code: `python manage.py startapp myapp`, caption: "Creates app folder" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 59–65",
    title: "Django — Views, URLs, templates syntax",
    subtitle: "Django variables, tags, if/else, for loop",
    explanation: {
      body: "Views: function-based views; receive request, return render() or HttpResponse. Pass data via context dict.\nURLs: path('url/', view_function) or path('member/<int:id>/', detail_view). Include other urlconfs with include().\nTemplates: {{ variable }} for output; {% if %} {% endif %}, {% for x in list %} {% endfor %}. Filters: {{ name|upper }}. Comments: {# ... #}. {% include 'partial.html' %}. Template inheritance: {% extends 'base.html' %}, {% block content %}.",
      points: [
        "Templates: {{ variable }}, {% if %}, {% for %}, {% include %}, {% extends %}.",
      ],
    },
    examples: {
      tabs: [
        { label: "For loop", code: `{% for x in mymembers %}\n  <li>{{ x.firstname }}</li>\n{% endfor %}`, caption: "Django template" },
        { label: "If", code: `{% if name %}\n  <p>Hello, {{ name }}</p>\n{% endif %}`, caption: "Conditional" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 59–65",
    title: "Django display data — prep template & view, details link, master template, index, 404",
    subtitle: "Prep template & view, details link, master template, index, 404",
    explanation: {
      body: "Prep Template and View: create template file; in view pass QuerySet or object in context; render(request, 'template.html', context).\nAdd Link to Details: <a href=\"{% url 'detail' member.id %}\"> — url tag with name and args. Detail view: get object by pk or slug; return 404 if not found (get_object_or_404).\nAdd Master Template: base.html with {% block content %}; child templates {% extends 'base.html' %} {% block content %} ... {% endblock %}.\nAdd Main Index Page: list view; template loops over members. 404 Template: create 404.html; Django uses it when Http404 raised. Add Test View: simple view for testing.",
      points: [
        "get_object_or_404(Model, pk=id) raises Http404 if not found; cleaner than try/except.",
      ],
    },
    examples: {
      tabs: [
        { label: "detail link", code: `<a href="{% url 'member_detail' member.id %}">{{ member.firstname }}</a>`, caption: "Link to detail" },
        { label: "404", code: `from django.shortcuts import get_object_or_404\nobj = get_object_or_404(Post, pk=pk)`, caption: "Get or 404" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 66–72",
    title: "Django — forms & models",
    subtitle: "Form, ModelForm, ORM, migrations, admin",
    explanation: {
      body: "HTML forms: GET (read) and POST (submit). Django Form class: define fields, validation, render in template.\nModelForm: form from a model; save to DB. Validation: is_valid(), cleaned_data.\nModels: class inheriting models.Model. Fields: CharField, IntegerField, DateTimeField, ForeignKey, TextField. Migrations: makemigrations, migrate.\nAdmin: register models; create superuser; list_display, customise. CRUD with ORM: create(), get(), filter(), update(), delete().",
      points: [
        "ORM: Post.objects.create(title='Hi', body='...'); Post.objects.all(); Post.objects.filter(pk=1).",
      ],
    },
    examples: {
      tabs: [
        { label: "Model", code: `class Post(models.Model):\n  title = models.CharField(max_length=200)\n  body = models.TextField()`, caption: "Model" },
        { label: "CRUD", code: `Post.objects.create(title="Hi", body="...")\nPost.objects.all()`, caption: "ORM" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 66–72",
    title: "Django admin — create user, include models, list display, update add delete",
    subtitle: "Create user, include models, list display, update, add, delete",
    explanation: {
      body: "Django Admin: built-in CRUD UI for models. Create superuser: python manage.py createsuperuser (email, password).\nInclude Models: in myapp/admin.py register each model — admin.site.register(MyModel) or @admin.register(MyModel) class MyModelAdmin(admin.ModelAdmin):.\nSet List Display: list_display = ['field1', 'field2'] — columns in list view. list_filter, search_fields, list_editable.\nUpdate Members: change view; add member: add view; delete: delete confirmation. Customise with ModelAdmin options.",
      points: [
        "Admin is for staff only; restrict with permissions and is_staff.",
      ],
    },
    examples: {
      tabs: [
        { label: "register", code: `from django.contrib import admin\nfrom .models import Member\n@admin.register(Member)\nclass MemberAdmin(admin.ModelAdmin):\n  list_display = ["firstname", "lastname"]`, caption: "Admin" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 66–72",
    title: "Django — QuerySets & static files",
    subtitle: "Filter, order; WhiteNoise, collectstatic",
    explanation: {
      body: "QuerySets: Model.objects.all(), .filter(field=value), .exclude(), .order_by('field'), .get(pk=id). Chaining: Post.objects.filter(published=True).order_by('-date').\nStatic files: CSS, JS, images. Add in app's static/ folder. In settings: STATIC_URL, STATICFILES_DIRS. collectstatic for production. WhiteNoise: serve static in production without separate server. Add to template: {% load static %}, <link href=\"{% static 'css/style.css' %}\">.",
      points: [
        "Field lookups: filter(name__contains='x'), filter(date__year=2024).",
      ],
    },
    examples: {
      tabs: [
        { label: "QuerySet", code: `Post.objects.filter(published=True).order_by("-date")[:10]`, caption: "Filter and order" },
        { label: "Static", code: `{% load static %}\n<img src="{% static 'img/logo.png' %}">`, caption: "In template" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 66–72",
    title: "Django references & deploy — template tags, filters, field lookups; slug, Bootstrap",
    subtitle: "Template tags, filters, field lookups; slug, Bootstrap; deploy",
    explanation: {
      body: "Template Tag Reference: {% if %}, {% for %}, {% block %}, {% extends %}, {% include %}, {% url %}, {% load static %}, {% csrf_token %}, etc.\nFilter Reference: {{ value|default:\"N/A\" }}, {{ name|upper }}, {{ list|length }}, {{ date|date:\"Y-m-d\" }}. Field lookups: filter(field__exact), __iexact, __contains, __in, __gt, __gte, __startswith, __range, __year.\nAdd Slug Field: SlugField for readable URLs; slugify in save() or use prepopulated_fields in admin. Add Bootstrap 5: include Bootstrap CSS/JS in base template. Deploy: requirements.txt, django.config (e.g. for Elastic Beanstalk), create .zip, deploy; or use Gunicorn + Nginx.",
      points: [
        "Slug: URL-safe version of title; unique per model for detail URLs.",
      ],
    },
    examples: {
      tabs: [
        { label: "filter", code: `{{ name|upper }}\n{{ created|date:"M d, Y" }}`, caption: "Template filters" },
        { label: "lookup", code: `Post.objects.filter(title__contains="Django")`, caption: "Field lookup" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 73–78",
    title: "PostgreSQL — schema & SQL",
    subtitle: "Tables, SELECT/INSERT, JOINs",
    explanation: {
      body: "PostgreSQL is an advanced relational database; free, open source. Supports both SQL and JSON.\nSchema: CREATE TABLE, columns, data types. Primary key, foreign key. INSERT, SELECT, UPDATE, DELETE.\nSELECT with WHERE, ORDER BY, LIMIT. Aggregations: COUNT, SUM, AVG, MIN, MAX. GROUP BY, HAVING.\nJOINs: INNER, LEFT, RIGHT, FULL — combine tables. Indexes: CREATE INDEX. Transactions: BEGIN, COMMIT, ROLLBACK (ACID).\nDjango: connect via settings DATABASES; run raw SQL with connection.cursor(). Backup: pg_dump, pg_restore.",
      points: [
        "Schema: CREATE TABLE, INSERT, SELECT, WHERE, ORDER BY, Joins (INNER, LEFT, RIGHT).",
      ],
    },
    examples: {
      tabs: [
        { label: "SQL", code: `SELECT * FROM posts WHERE user_id = 1;\nINSERT INTO posts (title) VALUES ('Hi');`, caption: "SQL" },
        { label: "JOIN", code: `SELECT p.title, u.name FROM posts p\nINNER JOIN users u ON p.user_id = u.id;`, caption: "Join tables" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 73–78",
    title: "PostgreSQL intro, install, get started, pgAdmin 4",
    subtitle: "Intro, install, get started, pgAdmin 4",
    explanation: {
      body: "PostgreSQL Intro: advanced relational database; free, open source; supports SQL and JSON. Used by many production apps.\nInstall: download from the official PostgreSQL site; install server and client tools (psql). Linux: apt/yum package; Mac: Homebrew; Windows: installer.\nGet Started: start server (e.g. pg_ctl or systemctl); connect with psql -U postgres. Create database: CREATE DATABASE mydb;\npgAdmin 4: GUI for PostgreSQL; manage databases, run queries, backup/restore.",
      points: [
        "Default superuser: postgres. Create application user and database for Django.",
      ],
    },
    examples: {
      tabs: [
        { label: "connect", code: `psql -U postgres -d mydb`, caption: "Connect to database" },
        { label: "create db", code: `CREATE DATABASE mydb;\n\\c mydb`, caption: "Create and connect" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 73–78",
    title: "PostgreSQL database — CREATE TABLE, INSERT, fetch, ADD COLUMN, UPDATE, DELETE, DROP",
    subtitle: "CREATE TABLE, INSERT, fetch, ADD COLUMN, UPDATE, DELETE, DROP",
    explanation: {
      body: "CREATE TABLE: table name, column names and types (INTEGER, VARCHAR(n), TEXT, DATE, TIMESTAMP, BOOLEAN). PRIMARY KEY, FOREIGN KEY REFERENCES.\nINSERT INTO table (col1, col2) VALUES (v1, v2); multiple rows with comma-separated values.\nFetch Data: SELECT * FROM table; SELECT col1, col2 FROM table.\nADD COLUMN: ALTER TABLE table ADD COLUMN col TYPE; ALTER COLUMN: change type; DROP COLUMN: remove column.\nUPDATE table SET col = value WHERE condition; DELETE FROM table WHERE condition; DROP TABLE table; Create demo database for practice.",
      points: [
        "Always use WHERE with UPDATE and DELETE to avoid updating/deleting all rows.",
      ],
    },
    examples: {
      tabs: [
        { label: "CREATE", code: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);`, caption: "Create table" },
        { label: "INSERT", code: `INSERT INTO users (name) VALUES ('Alice'), ('Bob');`, caption: "Insert rows" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 73–78",
    title: "PostgreSQL syntax — SELECT, WHERE, ORDER BY, LIMIT, MIN/MAX, COUNT, SUM, AVG",
    subtitle: "Operators, SELECT, WHERE, ORDER BY, LIMIT, MIN/MAX, COUNT, SUM, AVG",
    explanation: {
      body: "Operators: = <> < > <= >=; AND, OR, NOT; LIKE (pattern), IN (list), BETWEEN a AND b.\nSELECT: SELECT * FROM t; SELECT col1, col2; SELECT DISTINCT col to remove duplicates.\nWHERE: filter rows — WHERE col = value, WHERE col IN (1,2,3), WHERE col BETWEEN 1 AND 10, WHERE col LIKE 'A%'.\nORDER BY col ASC/DESC; LIMIT n OFFSET m for pagination.\nAggregates: MIN(col), MAX(col), COUNT(*), SUM(col), AVG(col).",
      points: [
        "GROUP BY col groups rows; use with aggregates. HAVING filters after GROUP BY.",
      ],
    },
    examples: {
      tabs: [
        { label: "WHERE", code: `SELECT * FROM cars WHERE year > 2020 ORDER BY year DESC LIMIT 5;`, caption: "Filter and sort" },
        { label: "aggregates", code: `SELECT COUNT(*), AVG(price) FROM cars;`, caption: "Count and average" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 73–78",
    title: "PostgreSQL — LIKE, IN, BETWEEN, AS, joins, UNION, GROUP BY, HAVING, EXISTS, ANY, ALL, CASE",
    subtitle: "LIKE, IN, BETWEEN, AS, joins, UNION, GROUP BY, HAVING, EXISTS, ANY, ALL, CASE",
    explanation: {
      body: "LIKE: pattern match — % (any chars), _ (one char). IN: value IN (list). BETWEEN: col BETWEEN a AND b. AS: column alias.\nJoins: INNER JOIN (match both), LEFT JOIN (all left + matched right), RIGHT JOIN, FULL JOIN, CROSS JOIN. ON condition.\nUNION: combine result sets (remove duplicates); UNION ALL keeps duplicates.\nGROUP BY: group rows; HAVING: filter groups (e.g. HAVING COUNT(*) > 1).\nEXISTS: subquery returns rows. ANY/ALL: compare to subquery. CASE: conditional expression.",
      points: [
        "LEFT JOIN keeps all left rows; right side NULL where no match. Use for optional relations.",
      ],
    },
    examples: {
      tabs: [
        { label: "JOIN", code: `SELECT p.title, u.name FROM posts p\nLEFT JOIN users u ON p.user_id = u.id;`, caption: "Left join" },
        { label: "GROUP BY", code: `SELECT user_id, COUNT(*) FROM posts GROUP BY user_id HAVING COUNT(*) > 1;`, caption: "Group and filter" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 79–84",
    title: "REST APIs with Django",
    subtitle: "DRF, serializers, ViewSets, auth",
    explanation: {
      body: "REST: use HTTP methods (GET, POST, PUT, PATCH, DELETE) for resources. JSON request/response.\nDjango REST framework: serializers turn models to JSON; ViewSets provide CRUD; Routers map URLs. Authentication: session, token (e.g. TokenAuthentication). Permissions: IsAuthenticated, custom. Design endpoints (e.g. /api/posts/); versioning. Test with Postman or curl. Unit tests with pytest.",
      points: [
        "ViewSet: queryset + serializer_class; get list/create/detail/update/delete automatically.",
      ],
    },
    examples: {
      tabs: [
        { label: "ViewSet", code: `class PostViewSet(viewsets.ModelViewSet):\n  queryset = Post.objects.all()\n  serializer_class = PostSerializer`, caption: "DRF" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 85–88",
    title: "Frontend — HTML, CSS, JavaScript",
    subtitle: "DOM, Fetch API",
    explanation: {
      body: "HTML: structure — tags, attributes, forms. CSS: selectors, box model, layout (flexbox, grid).\nJavaScript: variables, functions, DOM manipulation (select elements, change content, events). Fetch API: fetch(url).then(r => r.json()).then(data => ...) to call your backend API. Server-side templates: Django templates or Jinja2 for server-rendered HTML. Forms: frontend validation + backend validation.",
      points: [
        "For full-stack: either server-rendered pages (Django templates) or SPA (e.g. React) calling your API.",
      ],
    },
    examples: {
      tabs: [
        { label: "Fetch", code: `fetch("/api/posts").then(r=>r.json()).then(console.log)`, caption: "Call API" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 89–90",
    title: "Web scraping",
    subtitle: "requests, BeautifulSoup — extract and save data",
    explanation: {
      body: "Web scraping: programmatically fetch web pages and extract data. Use cases: listings, news, data aggregation.\nrequests: fetch HTML from URLs (get(url), status_code, text). BeautifulSoup: parse HTML — find tags, extract text, links, tables. Save to CSV, JSON, or database. Respectful scraping: check robots.txt; rate limit requests; identify your bot.",
      points: [
        "Pipeline: requests.get() → BeautifulSoup(html) → find/find_all → extract text/attrs → save.",
      ],
    },
    examples: {
      tabs: [
        { label: "Scrape", code: `import requests\nfrom bs4 import BeautifulSoup\nr = requests.get(url)\nsoup = BeautifulSoup(r.text)\nprint(soup.find("title").text)`, caption: "Fetch and parse" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 91–93",
    title: "WebSockets & real-time",
    subtitle: "Django Channels, chat app",
    explanation: {
      body: "HTTP: request–response; client asks, server answers once. WebSockets: persistent, bidirectional connection; server can push updates.\nUse WebSockets for: chat, live notifications, dashboards. Django Channels: ASGI-based; consumers handle WebSocket connections; groups for broadcasting. Build a simple chat app: multiple users, rooms. Chatbot: rule-based or API (e.g. Q&A). Integrate chatbot into chat app.",
      points: [
        "Channels: routing → consumer; group_add, group_send for broadcasting to room.",
      ],
    },
    examples: {
      tabs: [
        { label: "Concept", code: `# WebSocket: persistent, bidirectional\n# Channels: ASGI, consumers, groups`, caption: "Real-time" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 94–95",
    title: "Git & Linux",
    subtitle: "Version control, CLI",
    explanation: {
      body: "Git: version control. init, add, commit. Branching: branch, checkout, merge. Remote: origin, push, pull. Collaboration: pull requests, code review.\nLinux CLI: ls, cd, pwd, mkdir, cp, mv, rm. File permissions: chmod. Processes: ps, kill. Deployment: server, domain, port. Essential for managing a VPS and running your app.",
      points: [
        "Typical workflow: branch → commit → push → open PR → merge to main.",
      ],
    },
    examples: {
      tabs: [
        { label: "Git", code: `git add .\ngit commit -m "msg"\ngit push origin main`, caption: "Git" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 96–98",
    title: "Gunicorn, VPS & Nginx",
    subtitle: "WSGI, reverse proxy, HTTPS",
    explanation: {
      body: "Gunicorn: production WSGI server for Django; run: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000.\nVPS: rent a server (Linux); SSH in; install Python, PostgreSQL, Nginx. Deploy your app; point domain to server IP.\nNginx: web server and reverse proxy. Receives client requests; forwards to Gunicorn (proxy_pass); serves static files. Config: server block, location, proxy_pass. SSL/TLS: HTTPS with Let's Encrypt (certbot).\nTopics: installing nginx, building from sources, Beginner's Guide, Admin's Guide, controlling nginx (reload, stop), connection processing methods (multi-worker), setting up hashes, debugging log, logging to syslog, configuration file measurement units (k, m), command-line parameters. How nginx processes a request (server names, location), server names (regex, wildcard), using nginx as HTTP load balancer (upstream, proxy_pass), configuring HTTPS servers (ssl_certificate, ssl_protocols). Core modules: server, location, listen; proxy_pass, proxy_set_header; WebSocket proxying (Upgrade, Connection headers).",
      points: [
        "Typical flow: Client → Nginx (port 80/443) → Gunicorn (e.g. 8000) → Django.",
        "Static files: Nginx serves /static/ and /media/; proxy_pass sends / to Gunicorn.",
      ],
    },
    examples: {
      tabs: [
        { label: "Gunicorn", code: `gunicorn myproject.wsgi:application --bind 0.0.0.0:8000`, caption: "Run Django" },
        { label: "Nginx", code: `location / { proxy_pass http://127.0.0.1:8000;\n  proxy_set_header Host $host; }`, caption: "Reverse proxy" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 99",
    title: "Docker",
    subtitle: "Containers, Dockerfile, docker-compose",
    explanation: {
      body: "Containers: packaged app + dependencies; same run everywhere. Dockerfile: FROM base image, COPY files, RUN commands, CMD or ENTRYPOINT. .dockerignore to keep images small. docker build, docker run. Docker Compose: define app + PostgreSQL + Nginx in YAML; one command to start all. Volumes for persistent data; networks for service communication. Multi-stage builds for smaller images. Use same setup in dev and production.",
      points: [
        "Typical stack: web service (Django + Gunicorn), db (PostgreSQL), nginx — in one docker-compose.yml.",
      ],
    },
    examples: {
      tabs: [
        { label: "Dockerfile", code: `FROM python:3.12-slim\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCMD ["gunicorn", "myproject.wsgi:application"]`, caption: "Django image" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 100",
    title: "CI/CD — Continuous Integration & Delivery",
    subtitle: "Build, test, deploy",
    explanation: {
      body: "CI/CD = Continuous Integration and Continuous Delivery/Deployment. Automates building, testing, and releasing software.\nContinuous Integration (CI): merge code often; on every commit run automated build and tests. If tests fail, reject the build; developers get fast feedback (fix broken builds first).\nContinuous Delivery (CD): after CI, code is deployable; release to production is a manual step (e.g. Deploy button).\nContinuous Deployment (CD): same as delivery but production deploy is automatic when tests pass. Requires very reliable test suites. Tools: Jenkins, GitHub Actions, GitLab CI.",
      points: [
        "Before CI/CD: long-lived branches, manual testing, big risky releases. After: small frequent commits, automated tests, smaller releases.",
      ],
    },
    examples: {
      tabs: [
        { label: "CI", code: `# On every commit:\n# 1. Build code\n# 2. Run tests (pytest)\n# 3. Notify pass/fail`, caption: "CI pipeline" },
        { label: "CD", code: `# After CI passes:\n# Deploy to staging → test\n# Then deploy to production (manual or auto)`, caption: "Delivery/Deployment" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 100",
    title: "CI/CD pipeline — GitHub Actions & best practices",
    subtitle: "Pipeline components",
    explanation: {
      body: "Pipeline components: (1) Commit — developer pushes to Git. (2) Trigger build — VCS triggers pipeline. (3) Build — compile/package (e.g. Docker image). (4) Notify build outcome. (5) Run tests — unit, integration. (6) Notify test outcome. (7) Deploy to staging. (8) Deploy to production (manual or auto).\nGitHub Actions: .github/workflows/*.yml; on: push/pull_request; jobs with steps (checkout, install, test, deploy). Fast feedback; fix broken builds immediately; environment parity (staging ≈ production). Rollback strategy.",
      points: [
        "Best practices: commit early and often; fix broken builds first; staging should mirror production.",
      ],
    },
    examples: {
      tabs: [
        { label: "Actions", code: `on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install -r requirements.txt\n      - run: pytest`, caption: "Test on push" },
      ],
    },
  },
  {
    kind: "dynamic",
    day: "Day 100",
    title: "CI/CD tools & best practices — Jenkins, GitHub Actions, pipeline health",
    subtitle: "Common CI/CD tools, Jenkins workflow, best practices",
    explanation: {
      body: "Common CI/CD tools: Jenkins (open source; handles all types; design CI server and CD hub). Jenkins workflow: Developer Commit → Trigger (webhook/polling) → Build (Maven, Gradle, Docker) → Test → Deploy (staging/production) → Feedback (email, Slack). Other tools: Concourse (open-source CI/CD mechanics), GoCD (modeling and visualization), Screwdriver (CD building platform), Spinnaker (multi-cloud CD).\nBest practices: (1) Fast feedback — developer should know build failed within minutes. (2) Commit early and often — large merge conflicts are the enemy of CI. (3) Fix broken builds immediately — main branch broken blocks everyone; top priority. (4) Environment parity — staging should look exactly like production; if they differ, tests are unreliable. (5) Infrastructure as Code (IaC) — use Terraform or CloudFormation to provision environments.",
      points: [
        "GitHub Actions / GitLab CI: YAML workflows; on push → build → test → notify → deploy.",
      ],
    },
    examples: {
      tabs: [
        { label: "Jenkins", code: `# Pipeline: checkout → install deps → test → deploy\n# Webhook from Git triggers on push`, caption: "Typical pipeline" },
        { label: "IaC", code: `# Terraform/CloudFormation: define staging & prod\n# Same config, different env`, caption: "Environment parity" },
      ],
    },
  },
  { kind: "dynamic", title: "Month 4–6: Training & projects", subtitle: "Build, portfolio, interviews, job ready", explanation: { body: "Build 2–3 full-stack projects. Code reviews. Resume, portfolio. Mock interviews. Job ready.", points: ["Projects: Dev Diary, Task API, Scrape It, Chat, Deploy, Docker, CI/CD, Portfolio."] }, examples: { tabs: [{ label: "Goals", code: `# Ship projects\n# Portfolio & resume\n# Mock interviews\n# Land job`, caption: "Month 4–6" }] } },
];
