import type { CostItem } from "@/data/proposals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionTitle } from "./SectionTitle";

interface CostBreakdownTableProps {
  items: CostItem[];
  total: string;
  gstNote?: string;
}

export function CostBreakdownTable({
  items,
  total,
  gstNote = "GST (18%) Extra",
}: CostBreakdownTableProps) {
  return (
    <section className="avoid-break">
      <SectionTitle>Cost Breakdown</SectionTitle>
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold">Component</TableHead>
              <TableHead className="text-right font-bold">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.component}
                className={index % 2 === 0 ? "bg-[#0e0e14]" : "bg-[#12121a]/80"}
              >
                <TableCell className="font-medium">{item.component}</TableCell>
                <TableCell className="text-right font-semibold">{item.cost}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-[#00d4ff]/30 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/10">
              <TableCell className="text-base font-bold">Total</TableCell>
              <TableCell className="text-right text-base font-bold text-[#00d4ff]">
                {total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="border-t bg-muted/30 px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
          {gstNote}
        </div>
      </div>
    </section>
  );
}
