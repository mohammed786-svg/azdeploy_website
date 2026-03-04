"use client";

import type {
  Slide,
  TitleSlide,
  IndexSlide,
  OverviewSlide,
  BulletSlide,
  TheorySlide,
  CodeSlide,
  DaySlide,
  DetailSlide,
  DynamicSlide,
} from "./curriculum";
import DocCurriculumIndex from "./DocCurriculumIndex";
import DetailSlideView from "./DetailSlideView";
import DynamicSlideView from "./DynamicSlideView";

const ACCENT = "#00d4ff";

/** Number of sub-sections for section-by-section reveal (0 = single view). */
export function getSectionCount(slide: Slide): number {
  switch (slide.kind) {
    case "day":
      return Math.max(1, slide.topics.length);
    case "theory":
      return 2; // body, then points
    case "code":
      return slide.output ? 2 : 1; // code, then terminal output
    case "detail":
      return slide.parts?.length ? slide.parts.length : 1;
    default:
      return 1;
  }
}

function DocTitleSlide({ slide }: { slide: TitleSlide }) {
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        {slide.day && (
          <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        )}
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        {slide.subtitle && (
          <p className="doc-subtitle doc-anim-fade doc-delay-2">{slide.subtitle}</p>
        )}
      </div>
    </div>
  );
}

function DocOverviewSlide({ slide }: { slide: OverviewSlide }) {
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        {slide.day && (
          <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        )}
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        <ul className="doc-overview-list doc-anim-fade doc-delay-2">
          {slide.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DocBulletSlide({ slide }: { slide: BulletSlide }) {
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        {slide.day && (
          <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        )}
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        {slide.subtitle && (
          <p className="doc-subtitle doc-anim-fade doc-delay-1">{slide.subtitle}</p>
        )}
        <ul className="doc-bullet-list doc-anim-fade doc-delay-2">
          {slide.items.map((item, i) => (
            <li key={i}>
              <span className="doc-bullet-dot" style={{ background: ACCENT }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DocTheorySlide({ slide, sectionIndex = 0 }: { slide: TheorySlide; sectionIndex?: number }) {
  const showBody = sectionIndex >= 0;
  const showPoints = sectionIndex >= 1;
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        {slide.day && (
          <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        )}
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        {slide.subtitle && (
          <p className="doc-subtitle doc-anim-fade doc-delay-1">{slide.subtitle}</p>
        )}
        {showBody && (
          <p className="doc-theory-body doc-anim-fade doc-delay-2">{slide.body}</p>
        )}
        {showPoints && slide.points && (
          <ul className={`doc-bullet-list doc-anim-fade ${showBody ? 'doc-delay-3 mt-4' : 'doc-delay-2'}`}>
            {slide.points.map((point, i) => (
              <li key={i} className="doc-section-item">
                <span className="doc-bullet-dot" style={{ background: ACCENT }} />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DocCodeSlide({ slide, sectionIndex = 0 }: { slide: CodeSlide; sectionIndex?: number }) {
  const showCode = sectionIndex >= 0;
  const showOutput = sectionIndex >= 1 && slide.output;
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        {slide.day && (
          <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        )}
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        {slide.subtitle && (
          <p className="doc-subtitle doc-anim-fade doc-delay-1">{slide.subtitle}</p>
        )}
        {showCode && (
          <>
            <pre className="doc-code doc-anim-slide-left doc-delay-2">
              {slide.code}
            </pre>
            {slide.caption && (
              <p className="doc-code-caption doc-anim-fade doc-delay-3">{slide.caption}</p>
            )}
          </>
        )}
        {showOutput && (
          <div className="doc-terminal-wrap doc-anim-fade doc-delay-2">
            <div className="doc-terminal-head">Output</div>
            <pre className="doc-terminal-output">{slide.output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function DocDaySlide({ slide, sectionIndex = 0 }: { slide: DaySlide; sectionIndex?: number }) {
  const topicIndex = Math.min(sectionIndex, slide.topics.length - 1);
  const topic = slide.topics[topicIndex];
  return (
    <div className="doc-slide">
      <div className="doc-slide-inner">
        <p className="doc-day-badge doc-anim-fade">{slide.day}</p>
        <h1 className="doc-title doc-anim-fade doc-delay-1">{slide.title}</h1>
        {slide.subtitle && (
          <p className="doc-subtitle doc-anim-fade doc-delay-1">{slide.subtitle}</p>
        )}
        <ul className="doc-day-topics doc-anim-fade doc-delay-2">
          {slide.topics.map((t, i) => (
            <li
              key={i}
              className={i === topicIndex ? "doc-day-topic-active" : "doc-day-topic-inactive"}
            >
              <span className="doc-bullet-dot" style={{ background: ACCENT }} />
              {t}
            </li>
          ))}
        </ul>
        <p className="doc-day-focus doc-anim-fade doc-delay-3">{topic}</p>
      </div>
    </div>
  );
}

export interface SlideRenderOptions {
  onGoToSlide?: (index: number) => void;
  sectionSlideIndices?: (number | null)[];
  sectionIndex?: number;
}

export function renderSlide(slide: Slide, options?: SlideRenderOptions) {
  switch (slide.kind) {
    case "title":
      return <DocTitleSlide slide={slide} />;
    case "index":
      return (
        <DocCurriculumIndex
          onGoToSlide={options?.onGoToSlide}
          sectionSlideIndices={options?.sectionSlideIndices}
        />
      );
    case "overview":
      return <DocOverviewSlide slide={slide} />;
    case "bullet":
      return <DocBulletSlide slide={slide} />;
    case "theory":
      return <DocTheorySlide slide={slide} sectionIndex={options?.sectionIndex ?? 0} />;
    case "code":
      return <DocCodeSlide slide={slide} sectionIndex={options?.sectionIndex ?? 0} />;
    case "day":
      return <DocDaySlide slide={slide} sectionIndex={options?.sectionIndex ?? 0} />;
    case "detail":
      return <DetailSlideView slide={slide} sectionIndex={options?.sectionIndex ?? 0} />;
    case "dynamic":
      return <DynamicSlideView slide={slide} />;
    default:
      return null;
  }
}
