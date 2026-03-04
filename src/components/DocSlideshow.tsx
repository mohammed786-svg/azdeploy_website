"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { PYTHON_CURRICULUM_SLIDES } from "@/components/python-doc/curriculum";
import { renderSlide, getSectionCount } from "@/components/python-doc/SlideRenderer";
import { getSectionSlideIndices } from "@/components/python-doc/DocCurriculumIndex";

const STORAGE_KEY_INDEX = "python-doc-slide-index";
const STORAGE_KEY_SECTION = "python-doc-section-index";

function getStoredIndex(total: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const s = localStorage.getItem(STORAGE_KEY_INDEX);
    if (s == null) return 0;
    const n = parseInt(s, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(total - 1, n));
  } catch {
    return 0;
  }
}

function getStoredSectionIndex(slideIndex: number, total: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const s = localStorage.getItem(STORAGE_KEY_SECTION);
    if (s == null) return 0;
    const n = parseInt(s, 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    const slide = PYTHON_CURRICULUM_SLIDES[slideIndex];
    const maxSection = slide ? getSectionCount(slide) - 1 : 0;
    return Math.min(maxSection, n);
  } catch {
    return 0;
  }
}

export default function DocSlideshow() {
  const total = PYTHON_CURRICULUM_SLIDES.length;

  const [index, setIndexState] = useState(0);
  const [sectionIndex, setSectionIndexState] = useState(0);

  const slide = PYTHON_CURRICULUM_SLIDES[index];
  const sectionCount = slide ? getSectionCount(slide) : 1;

  const sectionSlideIndices = useMemo(
    () => getSectionSlideIndices(PYTHON_CURRICULUM_SLIDES),
    []
  );

  // Restore slide/section from localStorage on mount
  useEffect(() => {
    const savedIndex = getStoredIndex(total);
    setIndexState(savedIndex);
    const savedSection = getStoredSectionIndex(savedIndex, total);
    setSectionIndexState(savedSection);
  }, [total]);

  const setIndex = useCallback((i: number) => {
    setIndexState(i);
    try {
      localStorage.setItem(STORAGE_KEY_INDEX, String(i));
    } catch {}
  }, []);

  const setSectionIndex = useCallback((s: number) => {
    setSectionIndexState(s);
    try {
      localStorage.setItem(STORAGE_KEY_SECTION, String(s));
    } catch {}
  }, []);

  const go = useCallback((delta: number) => {
    if (delta > 0) {
      if (sectionIndex < sectionCount - 1) {
        setSectionIndex(sectionIndex + 1);
      } else {
        setSectionIndex(0);
        const next = Math.min(total - 1, index + 1);
        setIndex(next);
      }
    } else {
      if (sectionIndex > 0) {
        setSectionIndex(sectionIndex - 1);
      } else {
        const newIndex = Math.max(0, index - 1);
        setIndex(newIndex);
        const prevSlide = PYTHON_CURRICULUM_SLIDES[newIndex];
        const prevSection = prevSlide ? getSectionCount(prevSlide) - 1 : 0;
        setSectionIndex(prevSection);
      }
    }
  }, [sectionIndex, sectionCount, index, total, setIndex, setSectionIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      className="doc-slideshow"
      data-index-slide={index === 1 ? "true" : undefined}
      data-detail-slide={slide?.kind === "detail" || slide?.kind === "dynamic" ? "true" : undefined}
    >
      <div className="doc-slide-container">
        {slide && renderSlide(slide, {
          onGoToSlide: (i) => { setIndex(i); setSectionIndex(0); },
          sectionSlideIndices,
          sectionIndex,
        })}
      </div>
      <div className="doc-nav">
        <button type="button" onClick={() => go(-1)} disabled={index === 0 && sectionIndex === 0} className="doc-nav-btn">
          ← Prev
        </button>
        <span className="doc-nav-counter font-mono text-white/60 text-xs">
          {sectionCount > 1 ? `${sectionIndex + 1}/${sectionCount} · ` : ""}{index + 1} / {total}
        </span>
        <button type="button" onClick={() => go(1)} disabled={index === total - 1 && sectionIndex === sectionCount - 1} className="doc-nav-btn">
          Next →
        </button>
      </div>
    </div>
  );
}
