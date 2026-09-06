"use client";

import { useParams } from "next/navigation";
import HqKidzzyProductEditor from "@/components/hq/HqKidzzyProductEditor";

export default function HqKidzzyEditPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  if (!id) return <p className="text-red-300">Missing product id</p>;
  return <HqKidzzyProductEditor mode="edit" productId={id} />;
}
