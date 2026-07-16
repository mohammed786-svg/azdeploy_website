import { FeatureList } from "./FeatureList";

interface TechnologyHighlightsProps {
  items: string[];
}

export function TechnologyHighlights({ items }: TechnologyHighlightsProps) {
  return <FeatureList title="Technology Highlights" items={items} />;
}
