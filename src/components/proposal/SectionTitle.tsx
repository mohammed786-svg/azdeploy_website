interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`}>
      <div className="h-8 w-1 rounded-full bg-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.5)]" />
      <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{children}</h3>
    </div>
  );
}
