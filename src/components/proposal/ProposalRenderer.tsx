import type { Proposal } from "@/data/proposals";
import { MedicalCollegeProposalDocument } from "./MedicalCollegeProposalDocument";
import { ProposalDocument } from "./ProposalDocument";

interface ProposalRendererProps {
  proposal: Proposal;
  showSharedSections?: boolean;
  compactHeader?: boolean;
}

export function ProposalRenderer({
  proposal,
  showSharedSections = true,
  compactHeader = false,
}: ProposalRendererProps) {
  if (proposal.template === "medical-college") {
    return <MedicalCollegeProposalDocument proposal={proposal} />;
  }

  return (
    <ProposalDocument
      proposal={proposal}
      showSharedSections={showSharedSections}
      compactHeader={compactHeader}
    />
  );
}
