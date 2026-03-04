"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { FlowStep } from "./Scene3DInstallFlow";

const Scene3DCanvasInstallFlow = dynamic(
  () => import("./Scene3DCanvasInstallFlow").then((m) => m.Scene3DCanvasInstallFlow),
  { ssr: false, loading: () => <div className="doc-framer-flowchart-3d-loading">Loading 3D flow…</div> }
);

const ACCENT = "#00d4ff";
const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
const ITEM = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

type OS = "windows" | "mac" | "linux";

const OS_LABELS: Record<OS, string> = {
  windows: "Windows",
  mac: "Mac",
  linux: "Linux",
};

const IDE_FLOW_STEPS: FlowStep[] = [
  { id: 1, label: "Open browser" },
  { id: 2, label: "Go to jetbrains.com/pycharm or code.visualstudio.com" },
  { id: 3, label: "Download PyCharm / VS Code" },
  { id: 4, label: "Run installer (Windows / Mac / Linux)" },
  { id: 5, label: "Open PyCharm or VS Code" },
  { id: 6, label: "Create or open a project" },
  { id: 7, label: "✓ IDE ready" },
];

function BrowserMockup() {
  return (
    <motion.div variants={ITEM} className="doc-framer-browser">
      <div className="doc-framer-browser-chrome">
        <span className="doc-framer-dot" style={{ background: "#ff5f56" }} />
        <span className="doc-framer-dot" style={{ background: "#ffbd2e" }} />
        <span className="doc-framer-dot" style={{ background: "#27c93f" }} />
        <div className="doc-framer-address">
          <span className="doc-framer-url">https://www.jetbrains.com/pycharm/download/</span>
        </div>
      </div>
      <div className="doc-framer-browser-body">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="doc-framer-page-title"
        >
          PyCharm — Download
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="doc-framer-download-btn"
        >
          Download PyCharm Community
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="doc-framer-hint"
        >
          Or use VS Code: code.visualstudio.com
        </motion.p>
      </div>
    </motion.div>
  );
}

function TerminalBlock({
  title,
  prompt,
  command,
  output,
  delay = 0,
}: {
  title: string;
  prompt: string;
  command: string;
  output: string;
  delay?: number;
}) {
  return (
    <motion.div variants={ITEM} className="doc-framer-terminal">
      <div className="doc-framer-terminal-head">{title}</div>
      <div className="doc-framer-terminal-body">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
          className="doc-framer-terminal-line"
        >
          <span className="doc-framer-prompt">{prompt}</span>
          <span className="doc-framer-command">{command}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="doc-framer-terminal-output"
        >
          {output}
        </motion.div>
      </div>
    </motion.div>
  );
}

function WindowsSteps() {
  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="doc-framer-steps">
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">1</span>
        <div>
          <strong>PyCharm</strong>
          <p>Run <code>pycharm-community-x.x.x.exe</code> → Next → Install. Launch from Start menu.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>VS Code</strong>
          <p>Run <code>VSCodeUserSetup-x.x.x.exe</code> → Next → Install. Open from Start or desktop.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">3</span>
        <div>
          <strong>Create a project</strong>
          <p>PyCharm: New Project → choose folder. VS Code: File → Open Folder.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MacSteps() {
  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="doc-framer-steps">
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">1</span>
        <div>
          <strong>PyCharm</strong>
          <p>Open <code>pycharm-community-xxxx.dmg</code> → drag to Applications. Open from Launchpad.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>VS Code</strong>
          <p>Open <code>VSCode-darwin-universal.zip</code> → drag to Applications. Open from Spotlight.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">3</span>
        <div>
          <strong>Create a project</strong>
          <p>PyCharm: New Project → location. VS Code: File → Open Folder.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LinuxSteps() {
  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="doc-framer-steps">
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">1</span>
        <div>
          <strong>PyCharm (e.g. Ubuntu)</strong>
          <p>Snap: <code>sudo snap install pycharm-community --classic</code>. Or download .tar.gz from jetbrains.com.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>VS Code</strong>
          <p>Download .deb from code.visualstudio.com or: <code>sudo apt install code</code> (if repo added).</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">3</span>
        <div>
          <strong>Create a project</strong>
          <p>Open folder in PyCharm or VS Code and start coding.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InstallFlow3DSection({ steps, onFullscreen }: { steps: FlowStep[]; onFullscreen: () => void }) {
  return (
    <div className="doc-framer-flowchart-wrap">
      <div className="doc-framer-flowchart-head">
        <p className="doc-framer-flowchart-title">Install flow</p>
        <button
          type="button"
          className="doc-detail-fullscreen-btn doc-installflow-fullscreen-btn"
          onClick={onFullscreen}
          title="Full screen"
        >
          Full screen
        </button>
      </div>
      <Scene3DCanvasInstallFlow className="doc-framer-flowchart-3d" steps={steps} />
    </div>
  );
}

export function InstallingPyCharmVSCodeFramerScene({ fullScreen }: { fullScreen?: boolean }) {
  const [os, setOs] = useState<OS>("windows");
  const [installFlowFullscreen, setInstallFlowFullscreen] = useState(false);

  useEffect(() => {
    if (!installFlowFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInstallFlowFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [installFlowFullscreen]);

  return (
    <motion.div
      className="doc-scene-3d doc-framer-scene"
      data-fullscreen={fullScreen ? "true" : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      <motion.div
        variants={CONTAINER}
        initial="hidden"
        animate="show"
        className="doc-framer-content"
      >
        <motion.p variants={ITEM} className="doc-framer-title">
          Installing PyCharm / VS Code: Browser → Download → Install → Open IDE
        </motion.p>

        <BrowserMockup />

        <motion.div variants={ITEM} className="doc-framer-os-tabs">
          {(Object.keys(OS_LABELS) as OS[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`doc-framer-tab ${os === key ? "active" : ""}`}
              onClick={() => setOs(key)}
              style={os === key ? { borderColor: ACCENT, color: ACCENT } : undefined}
            >
              {OS_LABELS[key]}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {os === "windows" && (
            <motion.div
              key="windows"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="doc-framer-os-panel"
            >
              <WindowsSteps />
            </motion.div>
          )}
          {os === "mac" && (
            <motion.div
              key="mac"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="doc-framer-os-panel"
            >
              <MacSteps />
            </motion.div>
          )}
          {os === "linux" && (
            <motion.div
              key="linux"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="doc-framer-os-panel"
            >
              <LinuxSteps />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!fullScreen && (
        <InstallFlow3DSection steps={IDE_FLOW_STEPS} onFullscreen={() => setInstallFlowFullscreen(true)} />
      )}

      {installFlowFullscreen && (
        <div
          className="doc-installflow-fullscreen-overlay"
          onClick={() => setInstallFlowFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Install flow full screen"
        >
          <div
            className="doc-installflow-fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="doc-detail-fullscreen-close"
              onClick={() => setInstallFlowFullscreen(false)}
              aria-label="Close"
            >
              ✕ Close
            </button>
            <Scene3DCanvasInstallFlow className="doc-installflow-fullscreen-3d" fullScreen steps={IDE_FLOW_STEPS} />
          </div>
        </div>
      )}

      <p className="doc-scene-caption">
        Open browser → jetbrains.com/pycharm or code.visualstudio.com → Download → Install (Windows/Mac/Linux) → Open IDE → Create or open project
      </p>
    </motion.div>
  );
}
