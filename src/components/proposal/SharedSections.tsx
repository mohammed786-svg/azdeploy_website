import { sharedSections } from "@/data/proposals";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";
import { CreditCard, Presentation, Wrench, Quote, BookOpen } from "lucide-react";

export function SharedSections() {
  return (
    <div className="space-y-10">
      <section className="avoid-break">
        <SectionTitle>Payment Terms</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {sharedSections.paymentTerms.map((term, index) => (
            <Card key={term} className="border-border/80 shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00d4ff]/15 text-sm font-bold text-[#00d4ff]">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{term}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="avoid-break">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-[#00d4ff]" />
            Demonstration Schedule
          </span>
        </SectionTitle>
        <ul className="space-y-2 rounded-xl border border-border bg-muted/20 p-5">
          {sharedSections.demonstrationSchedule.map((item) => (
            <li key={item} className="flex gap-3 text-sm sm:text-base">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="avoid-break">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#00d4ff]" />
            Documentation &amp; Training
          </span>
        </SectionTitle>
        <div className="space-y-4 rounded-xl border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">{sharedSections.documentation.intro}</p>
          <ul className="space-y-2">
            {sharedSections.documentation.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm sm:text-base text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00d4ff]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="avoid-break">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-[#00d4ff]" />
            Maintenance & Support
          </span>
        </SectionTitle>
        <div className="space-y-4 rounded-xl border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">{sharedSections.maintenance.intro}</p>
          <p className="text-sm text-muted-foreground">
            Annual Maintenance Charges (AMC) cover:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {sharedSections.maintenance.coverage.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground">
            {sharedSections.maintenance.note}
          </p>
        </div>
      </section>

      <section className="avoid-break">
        <SectionTitle>
          <span className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-[#00d4ff]" />
            Professional Note
          </span>
        </SectionTitle>
        <blockquote className="rounded-xl border-l-4 border-[#00d4ff] bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground italic sm:text-base sm:leading-relaxed">
          {sharedSections.professionalNote}
        </blockquote>
      </section>
    </div>
  );
}
