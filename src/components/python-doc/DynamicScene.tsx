"use client";

import { InstallingPythonFramerScene } from "./InstallingPythonFramerScene";
import { InstallingPyCharmVSCodeFramerScene } from "./InstallingPyCharmVSCodeFramerScene";
import { WhyPythonFullStackScene } from "./WhyPythonFullStackScene";

/** Framer Motion scene: browser → download → install (Windows/Mac/Linux) → verify in CMD/Terminal */
function InstallingPythonScene({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <div
      className="doc-scene-3d doc-scene-three"
      data-fullscreen={fullScreen ? "true" : undefined}
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <InstallingPythonFramerScene fullScreen={fullScreen} />
    </div>
  );
}

function InstallingPyCharmVSCodeScene({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <div
      className="doc-scene-3d doc-scene-three"
      data-fullscreen={fullScreen ? "true" : undefined}
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <InstallingPyCharmVSCodeFramerScene fullScreen={fullScreen} />
    </div>
  );
}

export function DynamicScene({ sceneId, fullScreen }: { sceneId: string; fullScreen?: boolean }) {
  if (sceneId === "installing-python") {
    return <InstallingPythonScene fullScreen={fullScreen} />;
  }
  if (sceneId === "installing-pycharm-vscode") {
    return <InstallingPyCharmVSCodeScene fullScreen={fullScreen} />;
  }
  if (sceneId === "why-python-fullstack") {
    return <WhyPythonFullStackScene fullScreen={fullScreen} />;
  }
  return (
    <div className="doc-scene-3d doc-scene-placeholder">
      <p>Scene: {sceneId}</p>
    </div>
  );
}
