import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, IndianRupee, Clock } from "lucide-react";

interface ProposalHeroProps {
  number: number;
  title: string;
  subtitle: string;
  cost: string;
  gstNote: string;
  timeline: string;
}

export function ProposalHero({
  number,
  title,
  subtitle,
  cost,
  gstNote,
  timeline,
}: ProposalHeroProps) {
  return (
    <section className="avoid-break">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge className="bg-[#00d4ff]/15 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#00d4ff]">
          Project {number}
        </Badge>
        <span className="text-sm font-mono text-[#64748b]">{subtitle}</span>
      </div>

      <h2 className="mb-6 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-[#00d4ff]/25 bg-gradient-to-br from-[#00d4ff]/10 to-transparent shadow-none ring-[#00d4ff]/15">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/10">
              <IndianRupee className="h-5 w-5 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748b]">
                Project Cost
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{cost}</p>
              <p className="text-sm font-medium text-[#00d4ff]">{gstNote}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#00d4ff]/20 bg-[#0e0e14] shadow-none ring-[#00d4ff]/10">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00d4ff]/20 bg-[#12121a]">
              <Clock className="h-5 w-5 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748b]">
                Timeline
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
                <Calendar className="hidden h-5 w-5 text-[#00d4ff] sm:inline" />
                {timeline}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
