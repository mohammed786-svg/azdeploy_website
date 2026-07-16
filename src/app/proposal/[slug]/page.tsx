import { notFound } from "next/navigation";
import { ProposalPageLayout } from "@/components/proposal/ProposalPageLayout";
import { allProposals } from "@/data/proposals";

interface ProposalPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allProposals.map((proposal) => ({
    slug: proposal.slug,
  }));
}

export async function generateMetadata({ params }: ProposalPageProps) {
  const { slug } = await params;
  const proposal = allProposals.find((p) => p.slug === slug);

  if (!proposal) return { title: "Proposal Not Found" };

  const title = proposal.clientName
    ? `${proposal.title} — ${proposal.clientName}`
    : proposal.title;

  return {
    title,
    description: proposal.objective,
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { slug } = await params;
  const proposal = allProposals.find((p) => p.slug === slug);

  if (!proposal) {
    notFound();
  }

  return <ProposalPageLayout proposal={proposal} />;
}
