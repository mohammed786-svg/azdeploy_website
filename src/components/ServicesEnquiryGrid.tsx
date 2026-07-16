"use client";

import { useState } from "react";
import {
  Globe,
  Smartphone,
  Building2,
  UsersRound,
  Workflow,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { ACADEMY_CONTACT_NUMBERS } from "@/lib/contact-info";

type ServiceItem = {
  id: string;
  label: string;
  blurb: string;
  startingPrice: string;
  uptoPrice: string;
  features: string[];
  Icon: LucideIcon;
};

const SERVICES: ServiceItem[] = [
  {
    id: "website",
    label: "Website",
    blurb: "Corporate sites, portals & conversion-led web platforms.",
    startingPrice: "₹45,000",
    uptoPrice: "₹8,00,000",
    features: [
      "Responsive UI/UX + CMS",
      "SEO, analytics & lead forms",
      "Admin panel & SSL hosting setup",
      "Multi-page / multi-language options",
    ],
    Icon: Globe,
  },
  {
    id: "mobile-apps",
    label: "Mobile Apps",
    blurb: "Android & iOS apps with secure APIs and store-ready delivery.",
    startingPrice: "₹1,75,000",
    uptoPrice: "₹25,00,000",
    features: [
      "Android / iOS (native or cross-platform)",
      "Auth, push notifications & offline sync",
      "Backend APIs + admin dashboard",
      "Play Store / App Store deployment",
    ],
    Icon: Smartphone,
  },
  {
    id: "customised-erp",
    label: "Customised ERP",
    blurb: "Role-based ERP for education, healthcare & business ops.",
    startingPrice: "₹3,50,000",
    uptoPrice: "₹45,00,000",
    features: [
      "Admissions, fees, attendance, HR modules",
      "Role-based access & audit trails",
      "Reports, analytics & multi-branch",
      "Custom workflows mapped to your process",
    ],
    Icon: Building2,
  },
  {
    id: "crm",
    label: "CRM",
    blurb: "Enterprise lead-to-close CRM with pipelines & follow-ups.",
    startingPrice: "₹1,25,000",
    uptoPrice: "₹18,00,000",
    features: [
      "Lead capture, scoring & assignment",
      "Sales pipeline & task reminders",
      "WhatsApp / email integrations",
      "Team dashboards & conversion reports",
    ],
    Icon: UsersRound,
  },
  {
    id: "business-automation",
    label: "Business Automation",
    blurb: "End-to-end workflow automation for ops & approvals.",
    startingPrice: "₹95,000",
    uptoPrice: "₹15,00,000",
    features: [
      "Approval & document workflows",
      "ERP / CRM / API integrations",
      "Alerts, SLAs & audit logs",
      "Reduce manual ops & human error",
    ],
    Icon: Workflow,
  },
  {
    id: "ai-automation",
    label: "AI Automation",
    blurb: "AI chatbots, document intelligence & process copilots.",
    startingPrice: "₹1,50,000",
    uptoPrice: "₹22,00,000",
    features: [
      "AI chatbots & support assistants",
      "Document / invoice intelligence",
      "LLM workflows with human review",
      "Secure API + knowledge-base setup",
    ],
    Icon: Bot,
  },
];

const WA_PHONE = ACADEMY_CONTACT_NUMBERS[0].raw;

function whatsappHref(service: ServiceItem): string {
  const text = `Hi AZDeploy Academy, I am interested in your ${service.label} service (starting ${service.startingPrice}, up to ${service.uptoPrice}). Please share a detailed quote and next steps.`;
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

export default function ServicesEnquiryGrid() {
  const [selectedId, setSelectedId] = useState(SERVICES[0].id);
  const selected = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0];

  return (
    <div className="mb-14 sm:mb-16">
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#7dd3fc] mb-2">
          Software &amp; digital solutions · MNC-grade scope
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-glow-teal">
          What do you need built?
        </h2>
        <p className="mt-2 text-sm text-white/65 max-w-2xl mx-auto">
          Transparent starting-to-enterprise pricing. Select a service, review features, then enquire on WhatsApp for a scoped quote.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {SERVICES.map((service) => {
          const { id, label, blurb, startingPrice, uptoPrice, Icon } = service;
          const active = id === selectedId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedId(id)}
              aria-pressed={active}
              className={`group relative text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/70 ${
                active
                  ? "border-[#00d4ff] bg-[#00d4ff]/12 shadow-[0_0_28px_rgba(0,212,255,0.18)]"
                  : "border-white/10 bg-black/35 hover:border-[#00d4ff]/45 hover:bg-[#00d4ff]/[0.06]"
              }`}
            >
              <div
                className={`mb-3 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border transition-colors ${
                  active
                    ? "border-[#00d4ff]/60 bg-[#00d4ff]/20 text-[#00d4ff]"
                    : "border-white/10 bg-white/[0.04] text-[#94a3b8] group-hover:text-[#00d4ff] group-hover:border-[#00d4ff]/35"
                }`}
              >
                <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.75} aria-hidden />
              </div>
              <p className={`text-sm sm:text-base font-semibold ${active ? "text-white" : "text-white/90"}`}>
                {label}
              </p>
              <p className="mt-1 text-[11px] sm:text-xs text-white/55 leading-relaxed hidden sm:block">
                {blurb}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                <p className="text-[10px] sm:text-[11px] font-mono text-white/45 uppercase tracking-wider">
                  Investment
                </p>
                <p className="text-xs sm:text-sm text-white/90">
                  <span className="text-[#00f5d4] font-semibold">{startingPrice}</span>
                  <span className="text-white/40 mx-1.5">→</span>
                  <span className="text-[#7dd3fc] font-medium">upto {uptoPrice}</span>
                </p>
              </div>
              {active && (
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/10 via-transparent to-[#00f5d4]/10 px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/75">
              Selected:{" "}
              <span className="font-semibold text-[#00d4ff]">{selected.label}</span>
              <span className="text-white/40 mx-2">·</span>
              <span className="font-mono text-xs sm:text-sm">
                <span className="text-[#00f5d4]">{selected.startingPrice}</span>
                <span className="text-white/40"> – upto </span>
                <span className="text-[#7dd3fc]">{selected.uptoPrice}</span>
              </span>
            </p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {selected.features.map((f) => (
                <li key={f} className="text-xs text-white/70 flex items-start gap-2">
                  <span className="text-[#00d4ff] mt-0.5 shrink-0 font-mono">▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] font-mono text-white/40">
              Prices excl. GST · Final quote depends on modules, users & integrations
            </p>
          </div>
          <a
            href={whatsappHref(selected)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl border border-[#25D366]/70 bg-[#25D366]/15 px-6 py-3 text-sm font-semibold text-[#86efac] hover:bg-[#25D366]/25 hover:border-[#25D366] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
