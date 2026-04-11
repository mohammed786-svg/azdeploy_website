"use client";

import dynamic from "next/dynamic";
import { InstallingPythonFramerScene } from "./InstallingPythonFramerScene";
import { InstallingPyCharmVSCodeFramerScene } from "./InstallingPyCharmVSCodeFramerScene";
import { WhyPythonFullStackScene } from "./WhyPythonFullStackScene";
import { SCENE_FLOW_STEPS } from "./sceneFlowSteps";

const Scene3DCanvasInstallFlow = dynamic(
  () => import("./Scene3DCanvasInstallFlow").then((m) => m.Scene3DCanvasInstallFlow),
  { ssr: false }
);

function GenericFlowScene({ sceneId, fullScreen }: { sceneId: string; fullScreen?: boolean }) {
  const steps = SCENE_FLOW_STEPS[sceneId];
  if (!steps) return null;
  return (
    <div
      className="doc-scene-3d doc-scene-three doc-framer-flowchart-3d"
      data-fullscreen={fullScreen ? "true" : undefined}
      style={{ width: "100%", height: "100%", minHeight: fullScreen ? undefined : 240, position: "relative" }}
    >
      <Scene3DCanvasInstallFlow fullScreen={fullScreen} steps={steps} />
    </div>
  );
}

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
  if (SCENE_FLOW_STEPS[sceneId]) {
    return <GenericFlowScene sceneId={sceneId} fullScreen={fullScreen} />;
  }
  return (
    <div className="doc-scene-3d doc-scene-placeholder">
      <p>Scene: {sceneId}</p>
    </div>
  );
}
