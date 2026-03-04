"use client";

import { useState, useCallback } from "react";
import type { DynamicSlide as DynamicSlideType } from "./curriculum";
import { DynamicScene } from "./DynamicScene";

const ACCENT = "#00d4ff";

type FullScreenPanel = "explanation" | "examples" | "visual" | null;

export default function DynamicSlideView({ slide }: { slide: DynamicSlideType }) {
  const [activeTab, setActiveTab] = useState(0);
  const [fullScreen, setFullScreen] = useState<FullScreenPanel>(null);
  const { explanation, examples, visualSceneId } = slide;
  const hasVisual = Boolean(visualSceneId);

  const openFull = useCallback((panel: FullScreenPanel) => () => setFullScreen(panel), []);
  const closeFull = useCallback(() => setFullScreen(null), []);

  const currentTab = examples.tabs[activeTab];

  return (
    <div className="doc-detail-slide">
      <div className="doc-detail-header">
        {slide.day && <span className="doc-detail-badge">{slide.day}</span>}
        <h1 className="doc-detail-title">{slide.title}</h1>
        {slide.subtitle && <p className="doc-detail-part-title">{slide.subtitle}</p>}
      </div>

      <div className="doc-detail-grid" data-no-visual={hasVisual ? undefined : "true"}>
        {/* 1. Explanation */}
        <section className="doc-detail-panel doc-detail-theory doc-dynamic-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">Explanation</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("explanation")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          <div className="doc-detail-scroll">
            <p className="doc-detail-theory-body">{explanation.body}</p>
            {explanation.points && (
              <ul className="doc-detail-list">
                {explanation.points.map((point, i) => (
                  <li key={i}>
                    <span className="doc-detail-dot" style={{ background: ACCENT }} />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 2. Examples */}
        <section className="doc-detail-panel doc-detail-examples doc-dynamic-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">Examples</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("examples")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          <div className="doc-detail-tabs">
            {examples.tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                className={`doc-detail-tab ${activeTab === i ? "active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="doc-detail-tab-content">
            <div className="doc-detail-code-wrap">
              <pre className="doc-detail-code">{currentTab?.code}</pre>
              {currentTab?.caption && <p className="doc-detail-code-caption">{currentTab.caption}</p>}
              {currentTab?.output && (
                <div className="doc-detail-terminal">
                  <div className="doc-terminal-head">Output</div>
                  <pre className="doc-terminal-output">{currentTab.output}</pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. 3D / Visual — only when visualSceneId is set */}
        {hasVisual && (
        <section className="doc-detail-panel doc-detail-detail doc-dynamic-panel doc-dynamic-visual-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">3D Explanation</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("visual")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          <div className="doc-detail-scroll doc-dynamic-scene-wrap">
            <DynamicScene sceneId={visualSceneId!} />
          </div>
        </section>
        )}
      </div>

      {/* Full-screen overlays */}
      {fullScreen === "explanation" && (
        <div className="doc-detail-fullscreen-overlay" onClick={closeFull} role="dialog" aria-modal="true">
          <div className="doc-detail-fullscreen-content doc-dynamic-fullscreen" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-detail-fullscreen-close" onClick={closeFull} aria-label="Close">✕ Close</button>
            <h2 className="doc-detail-panel-head">Explanation</h2>
            <p className="doc-detail-theory-body">{explanation.body}</p>
            {explanation.points && (
              <ul className="doc-detail-list">
                {explanation.points.map((point, i) => (
                  <li key={i}><span className="doc-detail-dot" style={{ background: ACCENT }} />{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {fullScreen === "examples" && (
        <div className="doc-detail-fullscreen-overlay" onClick={closeFull} role="dialog" aria-modal="true">
          <div className="doc-detail-fullscreen-content doc-dynamic-fullscreen" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-detail-fullscreen-close" onClick={closeFull} aria-label="Close">✕ Close</button>
            <h2 className="doc-detail-panel-head">Examples</h2>
            <pre className="doc-detail-code doc-detail-code-fullscreen">{currentTab?.code}</pre>
            {currentTab?.output && (
              <div className="doc-terminal-wrap" style={{ marginTop: "1rem" }}>
                <div className="doc-terminal-head">Output</div>
                <pre className="doc-terminal-output">{currentTab.output}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {fullScreen === "visual" && hasVisual && visualSceneId && (
        <div className="doc-detail-fullscreen-overlay doc-fullscreen-visual-overlay" onClick={closeFull} role="dialog" aria-modal="true">
          <div className="doc-fullscreen-visual doc-detail-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-detail-fullscreen-close" onClick={closeFull} aria-label="Close">✕ Close</button>
            <div className="doc-fullscreen-visual-body">
              <h2 className="doc-detail-panel-head doc-fullscreen-visual-title">3D Explanation</h2>
              <DynamicScene sceneId={visualSceneId} fullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
