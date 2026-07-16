import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface FeatureListProps {
  title: string;
  items: string[];
  variant?: "default" | "ai" | "apps";
}

export function FeatureList({ title, items, variant = "default" }: FeatureListProps) {
  return (
    <section className="avoid-break">
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className={
              variant === "ai"
                ? "border-[#00d4ff]/30 bg-[#00d4ff]/10 px-3 py-1.5 text-xs font-medium text-foreground sm:text-sm"
                : variant === "apps"
                  ? "border-foreground/20 bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground sm:text-sm"
                  : "px-3 py-1.5 text-xs font-medium text-muted-foreground sm:text-sm"
            }
          >
            {variant === "ai" && <Sparkles className="mr-1.5 h-3 w-3 text-[#00d4ff]" />}
            {item}
          </Badge>
        ))}
      </div>
    </section>
  );
}
