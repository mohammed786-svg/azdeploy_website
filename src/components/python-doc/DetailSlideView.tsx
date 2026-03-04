"use client";

import { useState, useCallback, useMemo } from "react";
import type { DetailSlide as DetailSlideType } from "./curriculum";

const ACCENT = "#00d4ff";

type FullScreenPanel = "theory" | "examples" | "detail" | null;

export default function DetailSlideView({ slide, sectionIndex = 0 }: { slide: DetailSlideType; sectionIndex?: number }) {
  const [fullScreen, setFullScreen] = useState<FullScreenPanel>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { theory, examples, detail } = slide;

  const part = slide.parts?.length ? slide.parts[Math.min(sectionIndex, slide.parts.length - 1)] : null;

  const displayTheory = useMemo(() => part?.theory ?? theory, [part, theory]);
  const displayTabIndex = part != null ? part.exampleTabIndex : activeTab;
  const displayFlowSteps = useMemo(() => {
    if (part?.flowchartStepIndices?.length) {
      return part.flowchartStepIndices.map((i) => detail.flowchartSteps[i]).filter(Boolean);
    }
    return detail.flowchartSteps;
  }, [part, detail.flowchartSteps]);
  const displayWhyItems = useMemo(() => {
    if (part?.whyItemIndices?.length) {
      return part.whyItemIndices.map((i) => detail.whyItems[i]).filter(Boolean);
    }
    return detail.whyItems;
  }, [part, detail.whyItems]);

  const openFull = useCallback((panel: FullScreenPanel) => () => setFullScreen(panel), []);
  const closeFull = useCallback(() => setFullScreen(null), []);

  const currentTab = examples.tabs[displayTabIndex];
  const hasParts = Boolean(slide.parts?.length);

  return (
    <div className="doc-detail-slide">
      <div className="doc-detail-header">
        {slide.day && <span className="doc-detail-badge">{slide.day}</span>}
        <h1 className="doc-detail-title">{slide.title}</h1>
        {part && (
          <p className="doc-detail-part-title">{part.partTitle}</p>
        )}
      </div>

      <div className="doc-detail-grid">
        {/* Part 1: Theory */}
        <section className="doc-detail-panel doc-detail-theory doc-dynamic-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">Theory</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("theory")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          <div className="doc-detail-scroll">
            <p className="doc-detail-theory-body">{displayTheory.body}</p>
            {displayTheory.points && (
              <ul className="doc-detail-list">
                {displayTheory.points.map((point, i) => (
                  <li key={i}>
                    <span className="doc-detail-dot" style={{ background: ACCENT }} />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Part 2: Examples */}
        <section className="doc-detail-panel doc-detail-examples doc-dynamic-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">Examples</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("examples")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          {hasParts ? (
            <div className="doc-detail-tabs">
              <span className="doc-detail-tab doc-detail-tab-static active">{currentTab?.label ?? "Example"}</span>
            </div>
          ) : (
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
          )}
          <div className="doc-detail-tab-content">
            <div className="doc-detail-code-wrap">
              <pre className="doc-detail-code">
                {currentTab?.code}
              </pre>
              {currentTab?.caption && (
                <p className="doc-detail-code-caption">{currentTab.caption}</p>
              )}
              {currentTab?.output && (
                <div className="doc-detail-terminal">
                  <div className="doc-terminal-head">Output</div>
                  <pre className="doc-terminal-output">{currentTab.output}</pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Part 3: In detail — flowchart + why */}
        <section className="doc-detail-panel doc-detail-detail doc-dynamic-panel">
          <div className="doc-dynamic-panel-head">
            <h2 className="doc-detail-panel-head">In detail — How it works</h2>
            <button type="button" className="doc-detail-fullscreen-btn" onClick={openFull("detail")} title="Full screen">
              ⛶ Full screen
            </button>
          </div>
          <div className="doc-detail-scroll">
            <div className="doc-detail-flowchart">
              {displayFlowSteps.map((step, i) => (
                <div key={step.id} className="doc-flow-step doc-flow-step-anim" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="doc-flow-icon" aria-hidden>
                    <span className="doc-flow-icon-inner">{step.id}</span>
                  </div>
                  <div className="doc-flow-content">
                    <div className="doc-flow-label">{step.label}</div>
                    {step.desc && <div className="doc-flow-desc">{step.desc}</div>}
                  </div>
                  {i < displayFlowSteps.length - 1 && (
                    <div className="doc-flow-arrow" aria-hidden>↓</div>
                  )}
                </div>
              ))}
            </div>
            <div className="doc-detail-why">
              <h3 className="doc-detail-why-head">Why / What is used</h3>
              {displayWhyItems.map((item, i) => (
                <div key={i} className="doc-detail-why-item">
                  <span className="doc-detail-why-icon" aria-hidden>▸</span>
                  <div>
                    <strong className="doc-detail-why-title">{item.title}</strong>
                    <p className="doc-detail-why-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Full-screen overlays for each section */}
      {fullScreen === "theory" && (
        <div className="doc-detail-fullscreen-overlay" onClick={closeFull} role="dialog" aria-modal="true">
          <div className="doc-detail-fullscreen-content doc-dynamic-fullscreen" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-detail-fullscreen-close" onClick={closeFull} aria-label="Close">✕ Close</button>
            <h2 className="doc-detail-panel-head">Theory</h2>
            <p className="doc-detail-theory-body">{displayTheory.body}</p>
            {displayTheory.points && (
              <ul className="doc-detail-list">
                {displayTheory.points.map((point, i) => (
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
            {currentTab?.caption && <p className="doc-detail-code-caption">{currentTab.caption}</p>}
            {currentTab?.output && (
              <div className="doc-terminal-wrap" style={{ marginTop: "1rem" }}>
                <div className="doc-terminal-head">Output</div>
                <pre className="doc-terminal-output">{currentTab.output}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {fullScreen === "detail" && (
        <div className="doc-detail-fullscreen-overlay" onClick={closeFull} role="dialog" aria-modal="true">
          <div className="doc-detail-fullscreen-content doc-dynamic-fullscreen" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="doc-detail-fullscreen-close" onClick={closeFull} aria-label="Close">✕ Close</button>
            <h2 className="doc-detail-panel-head">In detail — How it works</h2>
            <div className="doc-detail-flowchart">
              {displayFlowSteps.map((step, i) => (
                <div key={step.id} className="doc-flow-step">
                  <div className="doc-flow-icon" aria-hidden>
                    <span className="doc-flow-icon-inner">{step.id}</span>
                  </div>
                  <div className="doc-flow-content">
                    <div className="doc-flow-label">{step.label}</div>
                    {step.desc && <div className="doc-flow-desc">{step.desc}</div>}
                  </div>
                  {i < displayFlowSteps.length - 1 && <div className="doc-flow-arrow" aria-hidden>↓</div>}
                </div>
              ))}
            </div>
            <div className="doc-detail-why">
              <h3 className="doc-detail-why-head">Why / What is used</h3>
              {displayWhyItems.map((item, i) => (
                <div key={i} className="doc-detail-why-item">
                  <span className="doc-detail-why-icon" aria-hidden>▸</span>
                  <div>
                    <strong className="doc-detail-why-title">{item.title}</strong>
                    <p className="doc-detail-why-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
