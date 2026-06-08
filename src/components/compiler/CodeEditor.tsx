"use client";

import dynamic from "next/dynamic";
import { useCompilerTheme } from "@/components/compiler/CompilerThemeProvider";
import { defineCompilerMonacoThemes } from "@/components/compiler/monaco-themes";
import type { Monaco } from "@monaco-editor/react";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  value: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

function handleBeforeMount(monaco: Monaco) {
  defineCompilerMonacoThemes(monaco);
}

export default function CodeEditor({ value, language, onChange, readOnly }: Props) {
  const { theme } = useCompilerTheme();
  return (
    <div className="h-full min-h-0 compiler-editor-wrap">
      <Monaco
        height="100%"
        language={language}
        value={value}
        theme={theme === "dark" ? "az-onecompiler-dark" : "az-onecompiler-light"}
        beforeMount={handleBeforeMount}
        onChange={(v) => onChange(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Menlo, Monaco, 'Courier New', monospace",
          lineHeight: 21,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "off",
          tabSize: 2,
          renderLineHighlight: "line",
          padding: { top: 8, bottom: 8 },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          glyphMargin: false,
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
