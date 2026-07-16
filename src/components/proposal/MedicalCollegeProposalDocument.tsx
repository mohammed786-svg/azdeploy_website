import Image from "next/image";
import {
  BadgeCheck,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Globe,
  Hospital,
  Layers3,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { Proposal } from "@/data/proposals";
import { company } from "@/data/proposals";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";

interface MedicalCollegeProposalDocumentProps {
  proposal: Proposal;
}

function MedicalGlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-[#00d4ff]/20 bg-[#0e0e14]/90 p-6 shadow-[0_18px_60px_-24px_rgba(0,212,255,0.35)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export function MedicalCollegeProposalDocument({
  proposal,
}: MedicalCollegeProposalDocumentProps) {
  const pricingPlans = proposal.pricingPlans ?? [];
  const websiteAddon = proposal.websiteAddon;
  const implementationSteps = proposal.implementationSteps ?? [];
  const paymentTerms = proposal.paymentTermsCustom ?? [];
  const whyChoosePoints = proposal.whyChoosePoints ?? [];
  const whyChooseDescription = proposal.whyChooseDescription ?? [];
  const solutionItems = proposal.solutionItems ?? [];
  const introParagraphs = proposal.introParagraphs ?? [];
  const footerNotes = proposal.footerNotes ?? [];

  return (
    <div className="proposal-document relative overflow-visible bg-[#0a0a0c] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.12),transparent_38%),radial-gradient(circle_at_top_right,rgba(0,229,204,0.1),transparent_34%),linear-gradient(180deg,rgba(10,10,14,0.95),rgba(10,10,12,1))]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(135deg,rgba(0,212,255,0.1),rgba(0,229,204,0.08),transparent)]" />

      <div className="relative mx-auto max-w-5xl space-y-10 px-6 py-8 sm:space-y-12 sm:px-8 sm:py-10">
        <MedicalGlassCard className="pdf-block overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00d4ff] via-[#00e5cc] to-[#ffd700]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <Badge className="bg-[#00d4ff]/15 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#00d4ff]">
                Premium SaaS Proposal
              </Badge>
              <div className="space-y-4">
                <Image
                  src="/logo_gold.png"
                  alt={`${company.name} logo`}
                  width={220}
                  height={110}
                  className="h-auto w-auto max-w-[min(80vw,220px)] object-contain"
                  priority
                />
                <div className="space-y-2">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.35em] text-[#00d4ff]">
                    Prepared Exclusively For
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {proposal.title}
                  </h1>
                  <div className="space-y-1 text-base text-foreground/85 sm:text-lg">
                    <p className="font-semibold">{proposal.clientName}</p>
                    <p>{proposal.clientOrganization}</p>
                    <p>{proposal.clientLocation}</p>
                    {proposal.clientManager ? (
                      <p>
                        <span className="text-muted-foreground">Manager:</span>{" "}
                        <span className="font-semibold">{proposal.clientManager}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#00d4ff]/15 bg-[#00d4ff]/10 p-4">
                <p className="text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
                  &ldquo;{proposal.proposalTagline}&rdquo;
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:w-[320px]">
              <div className="rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00d4ff]">
                  Prepared By
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {proposal.preparedBy}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#00d4ff]">
                  Website
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {proposal.website}
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Delivery
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{proposal.timeline}</p>
                  <p className="text-sm text-muted-foreground">
                    From one month plan upfront payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MedicalGlassCard>

        <section className="pdf-block">
          <SectionTitle>Introduction</SectionTitle>
          <MedicalGlassCard>
            <div className="space-y-4 text-base leading-relaxed text-foreground/90">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </MedicalGlassCard>
        </section>

        <section className="pdf-page">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-[#00d4ff]" />
              Our Solution
            </span>
          </SectionTitle>
          <div className="solution-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {solutionItems.map((item) => (
              <div
                key={item}
                className="flex min-h-20 items-center gap-3 rounded-xl border border-border/70 bg-[#0e0e14] p-3 shadow-sm sm:min-h-24 sm:p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00d4ff]/10 text-[#00d4ff] sm:h-10 sm:w-10 sm:rounded-2xl">
                  <Hospital className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <p className="text-xs font-semibold leading-snug text-foreground sm:text-sm">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <MedicalGlassCard className="pdf-block mt-4 border-[#00d4ff]/20 bg-gradient-to-r from-[#00d4ff]/10 to-[#00e5cc]/10">
            <p className="text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
              {proposal.solutionNote}
            </p>
          </MedicalGlassCard>
        </section>

        <section className="pdf-page">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#00d4ff]" />
              Pricing Options
            </span>
          </SectionTitle>
          <div className="pricing-grid grid gap-5 xl:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card
                key={plan.title}
                className={`pdf-pricing-card border bg-[#0e0e14]/90 shadow-[0_18px_45px_-28px_rgba(0,212,255,0.25)] backdrop-blur ${
                  plan.highlighted
                    ? "pricing-card-recommended border-[#c9a227] ring-1 ring-[#c9a227]/50"
                    : "border-[#00d4ff]/20"
                } ${index > 0 ? "pricing-card-page" : ""}`}
              >
                <div className="pdf-pricing-card-header">
                  <CardHeader className="space-y-3">
                    {plan.badge ? (
                      <Badge className="w-fit bg-[#c9a227] px-3 py-1 text-white hover:bg-[#c9a227]">
                        <Sparkles className="h-3 w-3" />
                        {plan.badge}
                      </Badge>
                    ) : null}
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {plan.title}
                    </CardTitle>
                    <div>
                      {plan.originalPrice ? (
                        <p className="text-sm font-medium text-muted-foreground">
                          Standard pricing for a 500-student institution:{" "}
                          <span className="line-through">{plan.originalPrice}</span>
                        </p>
                      ) : null}
                      <p className="text-4xl font-extrabold tracking-tight text-[#00d4ff]">
                        {plan.price}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground/80">{plan.cadence}</p>
                      <p className="text-sm font-semibold text-[#00d4ff]">{plan.gstNote}</p>
                    </div>
                  </CardHeader>

                  {plan.offerNote ? (
                    <CardContent className="pt-0">
                      <div className="rounded-2xl border border-[#00d4ff]/20 bg-[#00d4ff]/10 p-4">
                        <p className="text-sm font-medium leading-relaxed text-foreground/90">
                          {plan.offerNote}
                        </p>
                      </div>
                    </CardContent>
                  ) : null}
                </div>

                <CardContent className="space-y-5">
                  {plan.paymentPlan && plan.paymentPlan.length > 0 ? (
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Payment Plan
                      </p>
                      <ul className="mt-3 grid gap-2">
                        {plan.paymentPlan.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <ul className="grid gap-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex gap-3 rounded-xl px-3 py-2 text-sm leading-relaxed sm:text-base ${
                          feature.includes("First Year Free") || feature.includes("Free Server")
                            ? "border border-emerald-200 bg-emerald-50/80 shadow-[0_10px_24px_-18px_rgba(16,185,129,0.9)]"
                            : feature.includes("Second Year") ||
                                feature.includes("Next Year") ||
                                feature.includes("Additional Charges")
                              ? "border border-amber-200 bg-amber-50/80"
                              : ""
                        }`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            feature.includes("First Year Free") || feature.includes("Free Server")
                              ? "text-emerald-600"
                              : feature.includes("Second Year") ||
                                  feature.includes("Next Year") ||
                                  feature.includes("Additional Charges")
                                ? "text-amber-600"
                                : "text-[#00d4ff]"
                          }`}
                        />
                        <span className="flex flex-wrap items-center gap-2">
                          {(feature.includes("First Year Free") ||
                            feature.includes("Free Server")) && (
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white shadow-sm">
                              FREE
                            </span>
                          )}
                          <span>{feature}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Best For
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
                      {plan.bestFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {websiteAddon ? (
          <section className="pdf-page">
            <SectionTitle>
              <span className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#00d4ff]" />
                Website Add-On
              </span>
            </SectionTitle>
            <MedicalGlassCard className="pdf-block border-[#00d4ff]/20 bg-gradient-to-br from-[#00d4ff]/10 via-[#0e0e14]/90 to-[#00e5cc]/10">
              <div className="website-grid grid gap-6 lg:grid-cols-[1.05fr_1.45fr]">
                <div className="space-y-3">
                  <Badge className="w-fit bg-[#00d4ff] text-[#00d4ff]-foreground hover:bg-[#00d4ff]">
                    Exclusive Offer
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">{websiteAddon.heading}</h3>
                  <p className="text-4xl font-extrabold tracking-tight text-[#00d4ff]">
                    {websiteAddon.price}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80">{websiteAddon.cadence}</p>
                  <p className="text-sm text-muted-foreground">{websiteAddon.marketValue}</p>
                  <div className="rounded-2xl bg-[#0e0e14]/85 p-4">
                    <p className="text-sm font-medium leading-relaxed text-foreground/90">
                      {websiteAddon.mention}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {websiteAddon.include.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 px-4 py-3 text-sm font-medium text-foreground"
                    >
                      <BadgeCheck className="h-4 w-4 shrink-0 text-[#00d4ff]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MedicalGlassCard>
          </section>
        ) : null}

        <section className="pdf-page">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-[#00d4ff]" />
              Implementation Process
            </span>
          </SectionTitle>
          <MedicalGlassCard className="pdf-block">
            <div className="implementation-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {implementationSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00d4ff]/12 text-sm font-bold text-[#00d4ff]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step}</p>
                      {index < implementationSteps.length - 1 ? (
                        <ChevronDown className="mt-3 h-4 w-4 text-[#00d4ff]" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-[#00d4ff]/10 p-4">
              <p className="text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
                Complete delivery within 45 Days from the date of one month plan
                upfront payment and final feature approval.
              </p>
            </div>
          </MedicalGlassCard>
        </section>

        <section className="pdf-section">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#00d4ff]" />
              Payment Terms
            </span>
          </SectionTitle>
          <MedicalGlassCard className="pdf-block">
            <div className="grid gap-3">
              {paymentTerms.map((term, index) => (
                <div
                  key={term}
                  className="flex gap-4 rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00d4ff]/12 text-sm font-bold text-[#00d4ff]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    {term}
                  </p>
                </div>
              ))}
            </div>
          </MedicalGlassCard>
        </section>

        <section className="pdf-page">
          <SectionTitle>
            <span className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-[#00d4ff]" />
              Why Choose AZDeploy
            </span>
          </SectionTitle>
          <div className="why-choose-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoosePoints.map((point) => (
              <Card
                key={point}
                className="pdf-block border-[#00d4ff]/20 bg-[#0e0e14]/90 shadow-[0_16px_36px_-28px_rgba(0,229,204,0.25)]"
              >
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#00d4ff]/10">
                    <Bot className="h-5 w-5 text-[#00d4ff]" />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                    {point}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <MedicalGlassCard className="pdf-block mt-4">
            <div className="space-y-3 text-base leading-relaxed text-foreground/90">
              {whyChooseDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </MedicalGlassCard>
        </section>

        <footer className="pdf-block pdf-section">
          <MedicalGlassCard className="border-[#00d4ff]/20 bg-gradient-to-r from-[#00d4ff]/10 via-[#0e0e14]/90 to-[#00e5cc]/10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00d4ff]">
                  Thank You
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  We look forward to partnering with {proposal.clientName}.
                </h3>
                <p className="text-base leading-relaxed text-foreground/90">
                  {proposal.closingNote}
                </p>
              </div>
              <div className="space-y-3 rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/85 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00d4ff]/10">
                    <Building2 className="h-5 w-5 text-[#00d4ff]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{proposal.preparedBy}</p>
                    <p className="text-sm text-muted-foreground">{proposal.contactEmail}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-foreground/90">
                  <p>Phone: {proposal.contactPhone}</p>
                  <p>Website: {proposal.website}</p>
                </div>
                <div className="space-y-1 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  {footerNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>
            </div>
          </MedicalGlassCard>
        </footer>
      </div>
    </div>
  );
}
