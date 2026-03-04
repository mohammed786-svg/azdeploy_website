"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

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

function BrowserMockup() {
  return (
    <motion.div
      variants={ITEM}
      className="doc-framer-browser"
    >
      <div className="doc-framer-browser-chrome">
        <span className="doc-framer-dot" style={{ background: "#ff5f56" }} />
        <span className="doc-framer-dot" style={{ background: "#ffbd2e" }} />
        <span className="doc-framer-dot" style={{ background: "#27c93f" }} />
        <div className="doc-framer-address">
          <span className="doc-framer-url">https://www.python.org/downloads/</span>
        </div>
      </div>
      <div className="doc-framer-browser-body">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="doc-framer-page-title"
        >
          Download Python
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="doc-framer-download-btn"
        >
          Download Python 3.12
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="doc-framer-hint"
        >
          Click to download the installer
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
    <motion.div
      variants={ITEM}
      className="doc-framer-terminal"
    >
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
          <strong>Run the installer</strong>
          <p>Double-click <code>python-3.12.x-amd64.exe</code> → Next → Next → Install.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>Open Command Prompt</strong>
          <p>Press Win + R, type <code>cmd</code>, press Enter.</p>
        </div>
      </motion.div>
      <TerminalBlock
        title="Command Prompt"
        prompt="C:\\Users\\You&gt; "
        command="python --version"
        output="Python 3.12.0"
        delay={0.2}
      />
    </motion.div>
  );
}

function MacSteps() {
  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="doc-framer-steps">
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">1</span>
        <div>
          <strong>Run the installer</strong>
          <p>Open <code>python-3.12.x-macos11.pkg</code> → Continue → Install → Close.</p>
        </div>
      </motion.div>
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>Open Terminal</strong>
          <p>Spotlight (Cmd + Space) → type &quot;Terminal&quot; → Enter.</p>
        </div>
      </motion.div>
      <TerminalBlock
        title="Terminal"
        prompt="$ "
        command="python3 --version"
        output="Python 3.12.0"
        delay={0.2}
      />
    </motion.div>
  );
}

function LinuxSteps() {
  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="doc-framer-steps">
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">1</span>
        <div>
          <strong>Install via terminal (e.g. Ubuntu/Debian)</strong>
          <p>Open Terminal and run the commands below.</p>
        </div>
      </motion.div>
      <TerminalBlock
        title="Terminal"
        prompt="$ "
        command="sudo apt update && sudo apt install -y python3"
        output="...\nSetting up python3 (3.12.x) ..."
        delay={0}
      />
      <motion.div variants={ITEM} className="doc-framer-step-card">
        <span className="doc-framer-step-num">2</span>
        <div>
          <strong>Check version</strong>
        </div>
      </motion.div>
      <TerminalBlock
        title="Terminal"
        prompt="$ "
        command="python3 --version"
        output="Python 3.12.0"
        delay={0.2}
      />
    </motion.div>
  );
}

const FLOW_STEPS = [
  { id: 1, label: "Open browser" },
  { id: 2, label: "Go to python.org/downloads" },
  { id: 3, label: "Download Python 3.x" },
  { id: 4, label: "Run installer (Windows / Mac / Linux)" },
  { id: 5, label: "Open CMD (Win) or Terminal (Mac/Linux)" },
  { id: 6, label: "python --version or python3 --version" },
  { id: 7, label: "✓ Python installed" },
];

function InstallFlow3DSection({ onFullscreen }: { onFullscreen: () => void }) {
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
      <Scene3DCanvasInstallFlow className="doc-framer-flowchart-3d" />
    </div>
  );
}

export function InstallingPythonFramerScene({ fullScreen }: { fullScreen?: boolean }) {
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
          Install Python: Browser → Download → Install → Verify
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

      {!fullScreen && <InstallFlow3DSection onFullscreen={() => setInstallFlowFullscreen(true)} />}

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
            <Scene3DCanvasInstallFlow className="doc-installflow-fullscreen-3d" fullScreen />
          </div>
        </div>
      )}

      <p className="doc-scene-caption">
        Open browser → python.org/downloads → Download → Install (Windows/Mac/Linux) → Verify with <code>python --version</code> or <code>python3 --version</code>
      </p>
    </motion.div>
  );
}
