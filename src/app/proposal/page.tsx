import { notFound } from "next/navigation";

/** No public proposal index — clients only get their unique /proposal/[slug] link. */
export default function ProposalIndexPage() {
  notFound();
}
