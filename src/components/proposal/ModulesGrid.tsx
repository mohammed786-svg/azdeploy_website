import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModuleGroup } from "@/data/proposals";
import { SectionTitle } from "./SectionTitle";

interface ModulesGridProps {
  modules: ModuleGroup[];
}

export function ModulesGrid({ modules }: ModulesGridProps) {
  return (
    <section className="pdf-page">
      <SectionTitle>Major Modules</SectionTitle>
      <div className="modules-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card
            key={module.title}
            className="border-border/80 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5">
                {module.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#00d4ff]/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
