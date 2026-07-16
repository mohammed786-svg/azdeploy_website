import type { Proposal } from "@/data/proposals";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalHero } from "./ProposalHero";
import { ObjectiveSection } from "./ObjectiveSection";
import { ModulesGrid } from "./ModulesGrid";
import { FeatureList } from "./FeatureList";
import { WhiteLabelSection } from "./WhiteLabelSection";
import { CostBreakdownTable } from "./CostBreakdownTable";
import { SharedSections } from "./SharedSections";
import { SectionTitle } from "./SectionTitle";
import { TechnologyHighlights } from "./TechnologyHighlights";

interface ProposalDocumentProps {
  proposal: Proposal;
  showSharedSections?: boolean;
  compactHeader?: boolean;
}

export function ProposalDocument({
  proposal,
  showSharedSections = true,
  compactHeader = false,
}: ProposalDocumentProps) {
  return (
    <div className="proposal-document bg-[#0a0a0c] text-foreground">
      <ProposalHeader compact={compactHeader} />

      <div className="mx-auto max-w-5xl space-y-10 px-6 py-8 sm:space-y-12 sm:px-8 sm:py-10">
        <div className="pdf-block">
          {proposal.preparedFor ? (
            <div className="mb-6 space-y-4">
              <div className="rounded-xl border border-[#00d4ff]/25 bg-[#00d4ff]/10 px-5 py-4">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.28em] text-[#00d4ff]">
                  Prepared Exclusively For
                </p>
                <p className="mt-2 text-xl font-bold text-white sm:text-2xl">{proposal.preparedFor}</p>
              </div>
              {proposal.proposalTagline ? (
                <div className="rounded-xl border border-[#00d4ff]/15 bg-[#00d4ff]/10 px-5 py-4">
                  <p className="text-lg font-semibold leading-relaxed text-white sm:text-xl">
                    &ldquo;{proposal.proposalTagline}&rdquo;
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
          <ProposalHero
            number={proposal.number}
            title={proposal.title}
            subtitle={proposal.subtitle}
            cost={proposal.cost}
            gstNote={proposal.gstNote}
            timeline={proposal.timeline}
          />
        </div>

        <div className="pdf-block">
          <ObjectiveSection
            objective={proposal.objective}
            details={proposal.objectiveDetails}
          />
        </div>

        {proposal.applications && (
          <div className="pdf-block">
            <FeatureList
              title="Included Applications"
              items={proposal.applications}
              variant="apps"
            />
          </div>
        )}

        {proposal.features && (
          <div className="pdf-block">
            <FeatureList title="Features" items={proposal.features} />
          </div>
        )}

        {proposal.modules && <ModulesGrid modules={proposal.modules} />}

        {proposal.aiFeatures && (
          <div className="pdf-page">
            <FeatureList
              title="AI Automation Included"
              items={proposal.aiFeatures}
              variant="ai"
            />
          </div>
        )}

        {proposal.technologyHighlights && (
          <div className="pdf-block">
            <TechnologyHighlights items={proposal.technologyHighlights} />
          </div>
        )}

        <div className="pdf-block">
          <WhiteLabelSection points={proposal.whiteLabelPoints} />
        </div>

        <div className="pdf-page">
          <CostBreakdownTable
            items={proposal.costBreakdown}
            total={proposal.total}
          />
        </div>

        {proposal.extras?.map((extra) => (
          <section key={extra.title} className="pdf-block">
            <SectionTitle>{extra.title}</SectionTitle>
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-5">
              {(Array.isArray(extra.content) ? extra.content : [extra.content]).map(
                (paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </section>
        ))}

        {showSharedSections && (
          <div className="pdf-page">
            <SharedSections />
          </div>
        )}

        <footer className="pdf-block border-t border-border pt-6 text-center">
          <p className="text-sm font-semibold text-foreground">AZDeploy Academy</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Enterprise Software Development · White Label Solutions
          </p>
        </footer>
      </div>
    </div>
  );
}
