export type CompilerLanguage = {
  id: string;
  label: string;
  category: "programming" | "web" | "database";
  piston?: { language: string; version: string };
  extension: string;
  starter?: string;
  previewHtml?: boolean;
};

export const COMPILER_LANGUAGES: CompilerLanguage[] = [
  { id: "python", label: "Python", category: "programming", piston: { language: "python", version: "3.10.0" }, extension: "py", starter: 'print("Hello from AZ Deploy Academy")\n' },
  { id: "java", label: "Java", category: "programming", piston: { language: "java", version: "15.0.2" }, extension: "java", starter: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}\n' },
  { id: "c", label: "C", category: "programming", piston: { language: "c", version: "10.2.0" }, extension: "c", starter: '#include <stdio.h>\n\nint main() {\n  printf("Hello\\n");\n  return 0;\n}\n' },
  { id: "cpp", label: "C++", category: "programming", piston: { language: "c++", version: "10.2.0" }, extension: "cpp", starter: '#include <iostream>\n\nint main() {\n  std::cout << "Hello" << std::endl;\n  return 0;\n}\n' },
  { id: "javascript", label: "JavaScript", category: "programming", piston: { language: "javascript", version: "18.15.0" }, extension: "js", starter: 'console.log("Hello from AZ Deploy Academy");\n' },
  { id: "lua", label: "Lua", category: "programming", piston: { language: "lua", version: "5.4.4" }, extension: "lua", starter: 'print("Hello")\n' },
  { id: "php", label: "PHP", category: "programming", piston: { language: "php", version: "8.2.3" }, extension: "php", starter: '<?php\necho "Hello";\n' },
  { id: "nodejs", label: "NodeJS", category: "programming", piston: { language: "javascript", version: "18.15.0" }, extension: "js", starter: 'console.log("Hello from Node");\n' },
  { id: "csharp", label: "C#", category: "programming", piston: { language: "csharp", version: "6.12.0" }, extension: "cs", starter: 'using System;\nclass Program { static void Main() { Console.WriteLine("Hello"); } }\n' },
  { id: "assembly", label: "Assembly", category: "programming", extension: "asm", starter: "; Assembly lab — use C for runnable examples in this sandbox.\n" },
  { id: "bash", label: "Bash", category: "programming", piston: { language: "bash", version: "5.2.0" }, extension: "sh", starter: '#!/bin/bash\necho "Hello"\n' },
  { id: "tkinter", label: "Tkinter", category: "programming", extension: "py", starter: "# Tkinter GUI labs run locally; use Python print labs here.\nprint('Tkinter preview not available in browser sandbox')\n" },
  { id: "html", label: "HTML", category: "web", extension: "html", previewHtml: true, starter: '<!DOCTYPE html>\n<html>\n  <body><h1>AZ Deploy Academy</h1></body>\n</html>\n' },
  { id: "react", label: "React", category: "web", extension: "jsx", starter: "export default function App() {\n  return <h1>AZ Deploy Academy</h1>;\n}\n" },
  { id: "vue", label: "Vue", category: "web", extension: "vue", starter: "<template><h1>AZ Deploy Academy</h1></template>\n" },
  { id: "angular", label: "Angular", category: "web", extension: "ts", starter: "// Angular snippets — use TypeScript/JavaScript runner for logic labs.\nconsole.log('Angular lab');\n" },
  { id: "bootstrap", label: "Bootstrap", category: "web", extension: "html", previewHtml: true, starter: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container py-4"><h1 class="text-primary">Bootstrap Lab</h1></div>\n' },
  { id: "tailwind", label: "Tailwind CSS", category: "web", extension: "html", previewHtml: true, starter: '<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-6 text-xl font-bold text-indigo-600">Tailwind Lab</div>\n' },
  { id: "jquery", label: "JQuery", category: "web", extension: "html", previewHtml: true, starter: '<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>\n<div id="app"></div>\n<script>$("#app").text("jQuery ready");</script>\n' },
  { id: "mysql", label: "MySQL", category: "database", extension: "sql", starter: "-- MySQL syntax lab\nSELECT 'Hello' AS message;\n" },
  { id: "postgresql", label: "PostgreSQL", category: "database", piston: { language: "postgresql", version: "15.1.0" }, extension: "sql", starter: "SELECT 'Hello from PostgreSQL' AS message;\n" },
  { id: "mongodb", label: "MongoDB", category: "database", extension: "js", starter: "// MongoDB shell-style notes\nprint('Use enrolled database labs shared by your instructor.');\n" },
  { id: "sqlite", label: "SQLite", category: "database", piston: { language: "sqlite3", version: "3.39.4" }, extension: "sql", starter: "SELECT 'Hello from SQLite' AS message;\n" },
  { id: "redis", label: "Redis", category: "database", extension: "redis", starter: "# Redis command practice\nSET academy:greeting \"Hello\"\nGET academy:greeting\n" },
  { id: "mariadb", label: "MariaDB", category: "database", extension: "sql", starter: "SELECT 'MariaDB lab' AS message;\n" },
  { id: "plsql", label: "Oracle PL/SQL", category: "database", extension: "sql", starter: "BEGIN\n  DBMS_OUTPUT.PUT_LINE('PL/SQL lab');\nEND;\n/" },
  { id: "mssql", label: "Microsoft SQL Server", category: "database", extension: "sql", starter: "SELECT 'SQL Server lab' AS message;\n" },
  { id: "cassandra", label: "Cassandra", category: "database", extension: "cql", starter: "-- CQL practice\nSELECT now() FROM system.local;\n" },
  { id: "questdb", label: "QuestDB", category: "database", extension: "sql", starter: "SELECT 'QuestDB lab';\n" },
  { id: "duckdb", label: "DuckDB", category: "database", extension: "sql", starter: "SELECT 'DuckDB lab' AS message;\n" },
];

export function languageById(id: string): CompilerLanguage | undefined {
  return COMPILER_LANGUAGES.find((l) => l.id === id);
}

export function languageFromExtension(ext: string): CompilerLanguage | undefined {
  const clean = ext.replace(/^\./, "").toLowerCase();
  return COMPILER_LANGUAGES.find((l) => l.extension === clean);
}
