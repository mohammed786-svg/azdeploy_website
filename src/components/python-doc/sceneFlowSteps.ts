/**
 * Maps 3D scene IDs to flow steps for the generic install-flow style 3D view.
 * Used for HTTP, Django MVT, data flow, etc.
 */

import type { FlowStep } from "./Scene3DInstallFlow";

export const SCENE_FLOW_STEPS: Record<string, FlowStep[]> = {
  "http-request-response": [
    { id: 1, label: "Browser / Client" },
    { id: 2, label: "Sends HTTP request (GET/POST)" },
    { id: 3, label: "Request over network" },
    { id: 4, label: "Server receives request" },
    { id: 5, label: "Server runs code (e.g. Django)" },
    { id: 6, label: "Server sends response (200, HTML/JSON)" },
    { id: 7, label: "✓ Client receives & displays" },
  ],
  "django-mvt": [
    { id: 1, label: "URL (urlpatterns)" },
    { id: 2, label: "View (function or class)" },
    { id: 3, label: "Model (ORM / database)" },
    { id: 4, label: "Template (HTML)" },
    { id: 5, label: "Response to client" },
    { id: 6, label: "✓ Page rendered" },
  ],
  "python-data-types": [
    { id: 1, label: "int — whole numbers" },
    { id: 2, label: "float — decimals" },
    { id: 3, label: "str — text" },
    { id: 4, label: "bool — True / False" },
    { id: 5, label: "list — ordered, mutable" },
    { id: 6, label: "dict — key-value" },
    { id: 7, label: "✓ Use type() to check" },
  ],
  "control-flow": [
    { id: 1, label: "Condition (True/False)" },
    { id: 2, label: "if block runs if True" },
    { id: 3, label: "elif — else-if chain" },
    { id: 4, label: "else — when all False" },
    { id: 5, label: "Nested if inside if" },
    { id: 6, label: "Ternary: x if c else y" },
    { id: 7, label: "✓ One path executed" },
  ],
  "loop-flow": [
    { id: 1, label: "for item in sequence" },
    { id: 2, label: "for i in range(n)" },
    { id: 3, label: "while condition" },
    { id: 4, label: "break — exit loop" },
    { id: 5, label: "continue — next iteration" },
    { id: 6, label: "else after loop (no break)" },
    { id: 7, label: "✓ Loop completes" },
  ],
  "function-flow": [
    { id: 1, label: "def name(params):" },
    { id: 2, label: "Parameters & arguments" },
    { id: 3, label: "return value" },
    { id: 4, label: "Default args, *args, **kwargs" },
    { id: 5, label: "Scope: local vs global" },
    { id: 6, label: "import module / from x import y" },
    { id: 7, label: "✓ Reusable logic" },
  ],
  "oop-flow": [
    { id: 1, label: "class Name:" },
    { id: 2, label: "__init__(self) — constructor" },
    { id: 3, label: "Instance attributes (self.x)" },
    { id: 4, label: "Methods (self) first arg" },
    { id: 5, label: "Inheritance: class B(A)" },
    { id: 6, label: "Override methods" },
    { id: 7, label: "✓ Objects & reuse" },
  ],
  "internet-flow": [
    { id: 1, label: "You (client)" },
    { id: 2, label: "Enter URL / click link" },
    { id: 3, label: "DNS: name → IP address" },
    { id: 4, label: "Request sent (packets)" },
    { id: 5, label: "Server receives & processes" },
    { id: 6, label: "Response (HTML, etc.)" },
    { id: 7, label: "✓ Page displayed" },
  ],
};
