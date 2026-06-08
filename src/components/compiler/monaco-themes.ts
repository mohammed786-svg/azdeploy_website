import type { Monaco } from "@monaco-editor/react";

export function defineCompilerMonacoThemes(monaco: Monaco) {
  monaco.editor.defineTheme("az-onecompiler-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a9955", fontStyle: "italic" },
      { token: "keyword", foreground: "569cd6" },
      { token: "string", foreground: "ce9178" },
      { token: "number", foreground: "b5cea8" },
      { token: "type", foreground: "4ec9b0" },
      { token: "delimiter", foreground: "d4d4d4" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
      "editor.selectionBackground": "#264f78",
      "editor.inactiveSelectionBackground": "#3a3d41",
      "editor.lineHighlightBackground": "#2a2d2e",
      "editorCursor.foreground": "#aeafad",
      "editorWhitespace.foreground": "#3b3b3b",
    },
  });

  monaco.editor.defineTheme("az-onecompiler-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "008000", fontStyle: "italic" },
      { token: "keyword", foreground: "0000ff" },
      { token: "string", foreground: "a31515" },
      { token: "number", foreground: "098658" },
      { token: "type", foreground: "267f99" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#333333",
      "editorLineNumber.foreground": "#999999",
      "editorLineNumber.activeForeground": "#333333",
      "editor.selectionBackground": "#add6ff",
      "editor.lineHighlightBackground": "#f5f5f5",
    },
  });
}
