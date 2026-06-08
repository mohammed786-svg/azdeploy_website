import { NextRequest, NextResponse } from "next/server";

import { languageById } from "@/lib/compiler-languages";
import { requireAcademySession } from "@/lib/academy-session";

function pistonUrl(): string | null {
  return process.env.PISTON_API_URL?.trim() || null;
}

export async function POST(req: NextRequest) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;

  let body: { languageId?: string; code?: string; stdin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Bad request", data: {} }, { status: 400 });
  }

  const languageId = String(body.languageId || "").trim();
  const code = String(body.code || "");
  const stdin = String(body.stdin || "");
  const lang = languageById(languageId);

  if (!lang) {
    return NextResponse.json({ success: false, message: "Unsupported language", data: {} }, { status: 400 });
  }

  if (lang.previewHtml) {
    return NextResponse.json({
      success: true,
      data: {
        output: "HTML preview rendered in the output panel.",
        previewHtml: code,
        runtimeMs: 0,
      },
    });
  }

  if (!lang.piston) {
    return NextResponse.json({
      success: true,
      data: {
        output:
          `${lang.label} online execution is not available in the sandbox yet.\n` +
          "Use the shared SQL/Python labs provided by your instructor, or switch to a supported runtime.",
        runtimeMs: 0,
      },
    });
  }

  const piston = pistonUrl();
  if (!piston) {
    return NextResponse.json(
      {
        success: false,
        message: "Code execution is not configured. Set PISTON_API_URL on the server (self-hosted Piston on VPS).",
        data: {},
      },
      { status: 503 }
    );
  }

  const started = Date.now();
  try {
    const upstream = await fetch(piston, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.piston.language,
        version: lang.piston.version,
        files: [{ name: `main.${lang.extension}`, content: code }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 10000,
      }),
    });
    const payload = (await upstream.json()) as {
      run?: { stdout?: string; stderr?: string; code?: number; signal?: string };
      compile?: { stdout?: string; stderr?: string; code?: number };
      message?: string;
    };
    if (!upstream.ok) {
      const hint = /whitelist|engineerman/i.test(payload.message || "")
        ? " Public Piston is disabled. Use self-hosted Piston on your VPS (PISTON_API_URL)."
        : "";
      throw new Error((payload.message || "Execution service failed") + hint);
    }
    const parts: string[] = [];
    if (payload.compile?.stderr) parts.push(payload.compile.stderr);
    if (payload.compile?.stdout) parts.push(payload.compile.stdout);
    if (payload.run?.stdout) parts.push(payload.run.stdout);
    if (payload.run?.stderr) parts.push(payload.run.stderr);
    if (payload.run?.signal) parts.push(`Process signal: ${payload.run.signal}`);
    if (payload.run?.code != null && payload.run.code !== 0) {
      parts.push(`Exit code: ${payload.run.code}`);
    }
    return NextResponse.json({
      success: true,
      data: {
        output: parts.join("\n").trim() || "(no output)",
        runtimeMs: Date.now() - started,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Run failed";
    return NextResponse.json({ success: false, message: msg, data: {} }, { status: 502 });
  }
}
