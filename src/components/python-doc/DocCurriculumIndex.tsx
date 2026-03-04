"use client";

import { useState } from "react";
import { CURRICULUM_INDEX_DAYS } from "./curriculumIndex";
import { PYTHON_CURRICULUM_SLIDES } from "./curriculum";

const ACCENT = "#00d4ff";

/** Compute slide index for each index section (by linkToTitle or linkToDay). */
export function getSectionSlideIndices(slides: { title?: string; day?: string }[]): (number | null)[] {
  return CURRICULUM_INDEX_DAYS.map((section) => {
    if (section.linkToTitle) {
      const i = slides.findIndex((s) => s.title === section.linkToTitle);
      return i >= 0 ? i : null;
    }
    if (section.linkToDay) {
      const i = slides.findIndex((s) => s.day === section.linkToDay);
      return i >= 0 ? i : null;
    }
    return null;
  });
}

export default function DocCurriculumIndex({
  onGoToSlide,
  sectionSlideIndices,
}: {
  onGoToSlide?: (index: number) => void;
  sectionSlideIndices?: (number | null)[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const mid = Math.ceil(CURRICULUM_INDEX_DAYS.length / 2);
  const leftSections = CURRICULUM_INDEX_DAYS.slice(0, mid);
  const rightSections = CURRICULUM_INDEX_DAYS.slice(mid);

  const handleToggle = (sectionIndex: number) => {
    setOpenIndex(openIndex === sectionIndex ? null : sectionIndex);
  };

  const handleGoToSlide = (slideIndex: number) => {
    if (onGoToSlide) onGoToSlide(slideIndex);
  };

  return (
    <div className="doc-slide doc-index-slide">
      <div className="doc-slide-inner w-full max-w-5xl mx-auto">
        <h1 className="doc-title doc-anim-fade">Python Full Stack — Curriculum</h1>
        <p className="doc-subtitle doc-anim-fade doc-delay-1 mb-6">Day 1 → Day 100 (Month 1–3) | Month 4–6: Training & real-time projects</p>

        <div className="doc-index-grid doc-anim-fade doc-delay-2">
          <div className="doc-index-column">
            {leftSections.map((section, i) => {
              const slideIndex = sectionSlideIndices?.[i];
              return (
              <IndexAccordion
                key={i}
                section={section}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
                onGoToSlide={slideIndex != null ? () => handleGoToSlide(slideIndex) : undefined}
                accent={ACCENT}
              />
              );
            })}
          </div>
          <div className="doc-index-column">
            {rightSections.map((section, i) => {
              const slideIndex = sectionSlideIndices?.[mid + i];
              return (
              <IndexAccordion
                key={i}
                section={section}
                isOpen={openIndex === mid + i}
                onToggle={() => handleToggle(mid + i)}
                onGoToSlide={slideIndex != null ? () => handleGoToSlide(slideIndex) : undefined}
                accent={ACCENT}
              />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndexAccordion({
  section,
  isOpen,
  onToggle,
  onGoToSlide,
  accent,
}: {
  section: { title: string; days: string; items: string[] };
  isOpen: boolean;
  onToggle: () => void;
  onGoToSlide?: () => void;
  accent: string;
}) {
  return (
    <div className="doc-index-accordion">
      <button
        type="button"
        onClick={onToggle}
        className="doc-index-accordion-head"
        style={{ borderColor: `${accent}40` }}
      >
        <span className="doc-index-accordion-title">{section.title}</span>
        <span className="doc-index-accordion-days">{section.days}</span>
        <span className={`doc-index-accordion-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className="doc-index-accordion-body" style={{ borderColor: `${accent}30` }}>
          <ul className="doc-index-accordion-list">
            {section.items.map((item, j) => (
              <li key={j} className="doc-index-item">
                <span className="doc-index-item-dot" style={{ background: accent }} />
                {item}
              </li>
            ))}
          </ul>
          {onGoToSlide && (
            <button type="button" onClick={onGoToSlide} className="doc-index-go-btn" style={{ borderColor: `${accent}60`, color: accent }}>
              Go to section →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
