import type { Metadata } from "next";
import { CompilerThemeProvider } from "@/components/compiler/CompilerThemeProvider";
import "@/components/compiler/compiler.css";

export const metadata: Metadata = {
  title: "Academy Compiler | AZ Deploy Academy",
  robots: { index: false, follow: false },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <CompilerThemeProvider>{children}</CompilerThemeProvider>;
}
