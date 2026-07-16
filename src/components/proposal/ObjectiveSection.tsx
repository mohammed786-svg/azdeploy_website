import { SectionTitle } from "./SectionTitle";

interface ObjectiveSectionProps {
  objective: string;
  details?: string[];
}

export function ObjectiveSection({ objective, details }: ObjectiveSectionProps) {
  return (
    <section className="avoid-break">
      <SectionTitle>Project Objective</SectionTitle>
      <p className="text-base leading-relaxed text-foreground/90">{objective}</p>
      {details && details.length > 0 && (
        <ul className="mt-4 space-y-2">
          {details.map((detail) => (
            <li
              key={detail}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00d4ff]" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
