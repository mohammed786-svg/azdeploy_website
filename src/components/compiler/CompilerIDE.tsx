"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CodeEditor from "@/components/compiler/CodeEditor";
import LanguagePickerModal from "@/components/compiler/LanguagePickerModal";
import {
  IconCheck,
  IconChevron,
  IconFileCode,
  IconFileSql,
  IconFiles,
  IconFolder,
  IconMoon,
  IconMore,
  IconNewFile,
  IconNewFolder,
  IconPlus,
  IconRun,
  IconSearch,
  IconShare,
  IconSun,
} from "@/components/compiler/CompilerIcons";
import { useCompilerTheme } from "@/components/compiler/CompilerThemeProvider";
import { compilerSurfaces } from "@/components/compiler/compiler-tokens";
import { academyFetch } from "@/lib/academy-client";
import {
  COMPILER_LANGUAGES,
  languageById,
  languageFromExtension,
  type CompilerLanguage,
} from "@/lib/compiler-languages";

export type WorkspaceNode = {
  id: string;
  courseId: string;
  parentId: string | null;
  studentId: string | null;
  name: string;
  nodeType: "folder" | "file";
  language: string;
  content: string;
  isShared: boolean;
  writable: boolean;
  sortOrder: number;
};

type OpenTab = {
  key: string;
  title: string;
  pathLabel: string;
  languageId: string;
  content: string;
  readOnly: boolean;
  nodeId?: string;
  dirty?: boolean;
};

type Props = {
  courseSlug: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
};

function monacoLanguage(id: string): string {
  const map: Record<string, string> = {
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    javascript: "javascript",
    nodejs: "javascript",
    lua: "lua",
    php: "php",
    csharp: "csharp",
    bash: "shell",
    html: "html",
    react: "javascript",
    vue: "html",
    postgresql: "sql",
    mysql: "sql",
    sqlite: "sql",
    mssql: "sql",
    plsql: "sql",
    redis: "plaintext",
  };
  return map[id] || "plaintext";
}

function buildTree(nodes: WorkspaceNode[]) {
  const byParent = new Map<string | null, WorkspaceNode[]>();
  for (const n of nodes) {
    const key = n.parentId;
    const list = byParent.get(key) || [];
    list.push(n);
    byParent.set(key, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }
  return byParent;
}

function fileIcon(name: string, nodeType: string) {
  if (nodeType === "folder") return <IconFolder />;
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "sql") return <IconFileSql />;
  return <IconFileCode />;
}

export default function CompilerIDE({ courseSlug, courseTitle, studentName, studentEmail }: Props) {
  const { theme, toggleTheme } = useCompilerTheme();
  const s = compilerSurfaces(theme);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [nodes, setNodes] = useState<WorkspaceNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runtimeMs, setRuntimeMs] = useState<number | null>(null);
  const [runOk, setRunOk] = useState<boolean | null>(null);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarView, setSidebarView] = useState<"files" | "search">("files");
  const [searchQ, setSearchQ] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const activeTab = tabs.find((t) => t.key === activeKey) || null;
  const activeLang = languageById(activeTab?.languageId || "postgresql") || COMPILER_LANGUAGES[0];
  const tree = useMemo(() => buildTree(nodes), [nodes]);
  const initials = (studentName || studentEmail || "A").trim().charAt(0).toUpperCase();

  const instructorNodes = useMemo(() => nodes.filter((n) => !n.writable), [nodes]);
  const myNodes = useMemo(() => nodes.filter((n) => n.writable), [nodes]);

  const filteredNodes = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter((n) => n.name.toLowerCase().includes(q));
  }, [nodes, searchQ]);

  function myFilesParentId(): string | null {
    if (selectedNode?.writable && selectedNode.nodeType === "folder") return selectedNode.id;
    return null;
  }

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await academyFetch<{ items: WorkspaceNode[] }>(
        `/api/academy/workspace?courseSlug=${encodeURIComponent(courseSlug)}`,
        undefined,
        { suppressSuccessToast: true }
      );
      setNodes(data.items || []);
      const folderIds = (data.items || []).filter((n) => n.nodeType === "folder").map((n) => n.id);
      setExpanded(Object.fromEntries(folderIds.map((id) => [id, true])));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!activeTab?.dirty || activeTab.readOnly || !activeTab.nodeId) {
      setSaved(true);
      setSaving(false);
      return;
    }
    setSaved(false);
    setSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void (async () => {
        try {
          await academyFetch(
            `/api/academy/nodes/${encodeURIComponent(activeTab.nodeId!)}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                content: activeTab.content,
                language: activeTab.languageId,
              }),
            },
            { suppressSuccessToast: true }
          );
          setTabs((prev) =>
            prev.map((t) => (t.key === activeKey ? { ...t, dirty: false } : t))
          );
          setNodes((prev) =>
            prev.map((n) =>
              n.id === activeTab.nodeId
                ? { ...n, content: activeTab.content, language: activeTab.languageId }
                : n
            )
          );
          setSaved(true);
        } catch (e) {
          setErr(e instanceof Error ? e.message : "Save failed");
        } finally {
          setSaving(false);
        }
      })();
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [activeTab?.content, activeTab?.dirty, activeTab?.readOnly, activeTab?.nodeId, activeKey]);

  function openTabForNode(node: WorkspaceNode) {
    const lang =
      languageById(node.language) ||
      languageFromExtension(node.name.split(".").pop() || "") ||
      COMPILER_LANGUAGES[0];
    const key = `node:${node.id}`;
    setTabs((prev) => {
      const existing = prev.find((t) => t.key === key);
      if (existing) return prev;
      return [
        ...prev,
        {
          key,
          title: node.name,
          pathLabel: `${courseTitle.toUpperCase()}/${node.name}`,
          languageId: lang.id,
          content: node.content || lang.starter || "",
          readOnly: !(node.writable ?? Boolean(node.studentId)),
          nodeId: node.id,
          dirty: false,
        },
      ];
    });
    setActiveKey(key);
  }

  async function createNode(
    nodeType: "file" | "folder",
    lang: CompilerLanguage,
    parentId: string | null = null
  ) {
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      let name =
        nodeType === "folder"
          ? window.prompt("Folder name", "newfolder")?.trim() || ""
          : `untitled.${lang.extension}`;
      if (!name) return;
      if (nodeType === "folder" && !name) return;
      const data = await academyFetch<{ item: WorkspaceNode }>(
        "/api/academy/nodes",
        {
          method: "POST",
          body: JSON.stringify({
            courseSlug,
            parentId,
            nodeType,
            name,
            language: nodeType === "file" ? lang.id : "",
            content: nodeType === "file" ? lang.starter || "" : "",
          }),
        },
        { suppressSuccessToast: true }
      );
      const item = data.item;
      setNodes((prev) => [...prev, item]);
      if (item.parentId) setExpanded((e) => ({ ...e, [item.parentId!]: true }));
      setSelectedNodeId(item.id);
      if (item.nodeType === "file") openTabForNode(item);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function moveNode(nodeId: string, parentId: string | null) {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node?.writable || node.parentId === parentId) return;
    setBusy(true);
    setErr("");
    try {
      await academyFetch(
        `/api/academy/nodes/${encodeURIComponent(nodeId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ parentId }),
        },
        { suppressSuccessToast: true }
      );
      setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, parentId } : n)));
      if (parentId) setExpanded((e) => ({ ...e, [parentId]: true }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Move failed");
    } finally {
      setBusy(false);
      setDragNodeId(null);
      setDragOverId(null);
    }
  }

  async function deleteSelectedNode() {
    if (!selectedNodeId) return;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node?.writable) return;
    if (!window.confirm(`Delete "${node.name}" and everything inside it?`)) return;
    setBusy(true);
    setErr("");
    try {
      await academyFetch(
        `/api/academy/nodes/${encodeURIComponent(selectedNodeId)}`,
        { method: "DELETE" },
        { suppressSuccessToast: true }
      );
      const removeIds = new Set<string>();
      const collect = (id: string) => {
        removeIds.add(id);
        nodes.filter((n) => n.parentId === id).forEach((c) => collect(c.id));
      };
      collect(selectedNodeId);
      setNodes((prev) => prev.filter((n) => !removeIds.has(n.id)));
      setTabs((prev) => {
        const next = prev.filter((t) => !t.nodeId || !removeIds.has(t.nodeId));
        if (activeKey && !next.some((t) => t.key === activeKey)) {
          setActiveKey(next[next.length - 1]?.key || null);
        }
        return next;
      });
      setSelectedNodeId(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function openNode(node: WorkspaceNode) {
    setSelectedNodeId(node.id);
    if (node.nodeType === "folder") {
      setExpanded((e) => ({ ...e, [node.id]: !e[node.id] }));
      return;
    }
    openTabForNode(node);
  }

  function closeTab(key: string) {
    setTabs((prev) => {
      const next = prev.filter((t) => t.key !== key);
      if (activeKey === key) setActiveKey(next[next.length - 1]?.key || null);
      return next;
    });
  }

  function updateActiveContent(content: string) {
    if (!activeKey) return;
    setTabs((prev) =>
      prev.map((t) => (t.key === activeKey ? { ...t, content, dirty: !t.readOnly } : t))
    );
  }

  async function runCode() {
    if (!activeTab) return;
    setRunning(true);
    setOutput("");
    setPreviewHtml(null);
    setRuntimeMs(null);
    setRunOk(null);
    try {
      const data = await academyFetch<{ output: string; previewHtml?: string; runtimeMs?: number }>(
        "/api/academy/run",
        {
          method: "POST",
          body: JSON.stringify({
            languageId: activeTab.languageId,
            code: activeTab.content,
            stdin,
          }),
        },
        { suppressSuccessToast: true }
      );
      setOutput(data.output || "");
      setPreviewHtml(data.previewHtml || null);
      setRuntimeMs(data.runtimeMs ?? null);
      setRunOk(true);
    } catch (e) {
      setOutput(e instanceof Error ? e.message : "Run failed");
      setRunOk(false);
    } finally {
      setRunning(false);
    }
  }

  function onDragStartNode(node: WorkspaceNode, e: React.DragEvent) {
    if (!node.writable) return;
    setDragNodeId(node.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", node.id);
  }

  function onDragOverTarget(targetId: string | null, e: React.DragEvent) {
    if (!dragNodeId) return;
    const dragged = nodes.find((n) => n.id === dragNodeId);
    if (!dragged?.writable) return;
    if (targetId) {
      const target = nodes.find((n) => n.id === targetId);
      if (!target || target.nodeType !== "folder" || !target.writable) return;
      if (targetId === dragNodeId) return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(targetId ?? "__my_root__");
  }

  function onDropTarget(targetId: string | null, e: React.DragEvent) {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData("text/plain") || dragNodeId;
    if (!nodeId) return;
    void moveNode(nodeId, targetId);
  }

  function renderTree(parentId: string | null, source: WorkspaceNode[], depth = 0): React.ReactNode {
    const items = source.filter((n) => n.parentId === parentId);
    items.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    return items.map((node) => {
      const isFolder = node.nodeType === "folder";
      const isOpen = expanded[node.id] !== false;
      const canDrop =
        isFolder &&
        node.writable &&
        dragNodeId &&
        dragNodeId !== node.id &&
        nodes.find((n) => n.id === dragNodeId)?.writable;
      return (
        <div key={node.id}>
          <button
            type="button"
            draggable={node.writable}
            onDragStart={(e) => onDragStartNode(node, e)}
            onDragEnd={() => {
              setDragNodeId(null);
              setDragOverId(null);
            }}
            onDragOver={isFolder ? (e) => onDragOverTarget(node.id, e) : undefined}
            onDrop={isFolder ? (e) => onDropTarget(node.id, e) : undefined}
            onClick={() => openNode(node)}
            className={`w-full flex items-center gap-1.5 py-[3px] pr-2 text-left text-[13px] ${s.hover} ${
              activeTab?.nodeId === node.id || selectedNodeId === node.id ? s.treeActive : ""
            } ${canDrop && dragOverId === node.id ? "tree-drag-over" : ""}`}
            style={{ paddingLeft: `${18 + depth * 14}px` }}
          >
            {isFolder ? (
              <IconChevron open={isOpen} className={`w-3 h-3 shrink-0 ${s.muted}`} />
            ) : (
              <span className="w-3 shrink-0" />
            )}
            <span className="shrink-0">{fileIcon(node.name, node.nodeType)}</span>
            <span className="truncate">{node.name}</span>
            {!node.writable ? (
              <span className={`ml-auto text-[10px] ${s.muted}`}>ref</span>
            ) : null}
          </button>
          {isFolder && isOpen ? renderTree(node.id, source, depth + 1) : null}
        </div>
      );
    });
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const rootFolderLabel = courseTitle.toUpperCase();

  return (
    <div className={`compiler-ide h-screen flex flex-col overflow-hidden select-none ${s.shell}`}>
      {/* Top bar — OneCompiler style */}
      <header className={`h-11 shrink-0 border-b flex items-center px-3 gap-2 ${s.topbar}`}>
        <div className="flex items-center gap-3 min-w-0 mr-2">
          <span className="text-[15px] font-semibold tracking-tight text-white shrink-0">AZ Compiler</span>
          <Link href="/academy" className={`hidden sm:inline text-[12px] ${s.subtle} hover:underline truncate`}>
            Back to dashboard
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLangPickerOpen(true)}
            className={`h-8 min-w-[132px] inline-flex items-center justify-between gap-2 rounded-md px-3 text-[13px] font-medium ${s.langBtn}`}
          >
            <span>{activeLang.label}</span>
            <span className="text-[10px] opacity-80">▾</span>
          </button>

          <button
            type="button"
            onClick={() => void runCode()}
            disabled={running || !activeTab}
            className={`h-8 inline-flex items-center gap-1.5 rounded-md px-4 text-[13px] font-semibold disabled:opacity-50 ${s.runBtn}`}
          >
            <IconRun />
            {running ? "Running…" : "Run"}
          </button>

          <button
            type="button"
            className={`h-8 w-8 inline-flex items-center justify-center rounded-md border ${s.border} ${s.hover} ${s.subtle}`}
            aria-label="More options"
          >
            <IconMore />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => theme !== "light" && toggleTheme()}
            className={`h-8 w-8 inline-flex items-center justify-center rounded ${theme === "light" ? "bg-white/10" : s.hover} ${s.subtle}`}
            aria-label="Light mode"
          >
            <IconSun />
          </button>
          <button
            type="button"
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`h-8 w-8 inline-flex items-center justify-center rounded ${theme === "dark" ? "bg-white/10" : s.hover} ${s.subtle}`}
            aria-label="Dark mode"
          >
            <IconMoon />
          </button>
          <div className={`hidden md:flex items-center gap-1.5 text-[12px] px-2 ${s.subtle}`}>
            {activeTab?.readOnly ? (
              <span className="text-[#4fc1ff]">Read-only reference</span>
            ) : (
              <>
                <span className={`h-2 w-2 rounded-full ${saved && !saving ? s.savedDot : "bg-amber-400"}`} />
                {saving ? "Saving…" : saved ? "Saved" : "Unsaved"}
              </>
            )}
          </div>
          <button
            type="button"
            className={`hidden md:inline-flex h-8 w-8 items-center justify-center rounded ${s.hover} ${s.subtle}`}
            aria-label="Share"
            title="Sharing is managed by your instructor"
          >
            <IconShare />
          </button>
          <div
            className="h-8 w-8 rounded-full bg-[#0e639c] text-white text-xs font-bold inline-flex items-center justify-center"
            title={studentEmail}
          >
            {initials}
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex">
        {/* Activity bar */}
        <aside className={`w-12 shrink-0 border-r flex flex-col items-center py-2 gap-1 ${s.activity}`}>
          <button
            type="button"
            onClick={() => {
              setSidebarView("files");
              setExplorerOpen(true);
            }}
            className={`w-10 h-10 flex items-center justify-center rounded ${
              sidebarView === "files" ? "text-white border-l-2 border-white" : s.subtle
            }`}
            title="Explorer"
          >
            <IconFiles />
          </button>
          <button
            type="button"
            onClick={() => {
              setSidebarView("search");
              setExplorerOpen(true);
            }}
            className={`w-10 h-10 flex items-center justify-center rounded ${
              sidebarView === "search" ? "text-white border-l-2 border-white" : s.subtle
            }`}
            title="Search"
          >
            <IconSearch />
          </button>
        </aside>

        {/* Explorer */}
        {explorerOpen ? (
          <aside className={`w-[248px] shrink-0 border-r flex flex-col ${s.explorer}`}>
            <div className={`h-9 px-3 flex items-center justify-between border-b text-[11px] font-semibold tracking-[0.08em] ${s.border} ${s.subtle}`}>
              <span>EXPLORER</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void createNode("file", activeLang, myFilesParentId())}
                  title="New file in My Files"
                  disabled={busy}
                  className={s.hover}
                >
                  <IconNewFile className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void createNode("folder", activeLang, myFilesParentId())}
                  title="New folder in My Files"
                  disabled={busy}
                  className={s.hover}
                >
                  <IconNewFolder className="w-3.5 h-3.5" />
                </button>
                {selectedNode?.writable ? (
                  <button
                    type="button"
                    onClick={() => void deleteSelectedNode()}
                    title="Delete"
                    disabled={busy}
                    className={`text-[11px] px-1 ${s.hover} text-red-400`}
                  >
                    Del
                  </button>
                ) : null}
              </div>
            </div>

            {sidebarView === "search" ? (
              <div className="p-2 border-b">
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search files"
                  className={`w-full rounded border px-2 py-1.5 text-xs ${s.input}`}
                />
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto py-1 text-[13px]">
              {loading ? <p className={`px-4 py-2 text-xs ${s.muted}`}>Loading…</p> : null}
              {err ? <p className="px-4 py-2 text-xs text-amber-400">{err}</p> : null}
              {sidebarView === "search" ? (
                filteredNodes.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => openNode(n)}
                    className={`w-full flex items-center gap-2 px-4 py-1 text-left ${s.hover}`}
                  >
                    {fileIcon(n.name, n.nodeType)}
                    <span className="truncate">{n.name}</span>
                    {!n.writable ? <span className={`text-[10px] ${s.muted}`}>ref</span> : null}
                  </button>
                ))
              ) : (
                <>
                  <div className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] ${s.muted}`}>
                    INSTRUCTOR LABS
                  </div>
                  <div className={`px-3 py-0.5 flex items-center gap-1 text-[12px] ${s.subtle}`}>
                    <IconFolder className="w-3.5 h-3.5" />
                    <span className="truncate">{rootFolderLabel}</span>
                  </div>
                  {!loading && instructorNodes.length === 0 ? (
                    <p className={`px-4 py-1 text-xs ${s.muted}`}>No instructor labs published yet.</p>
                  ) : (
                    renderTree(null, instructorNodes)
                  )}

                  <div
                    className={`mt-3 px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] border-t ${s.border} ${s.muted}`}
                  >
                    MY FILES
                  </div>
                  <div
                    className={`px-3 py-1 flex items-center gap-1 ${s.subtle} ${
                      dragOverId === "__my_root__" ? "tree-drag-over" : ""
                    }`}
                    onDragOver={(e) => onDragOverTarget(null, e)}
                    onDragLeave={() => setDragOverId((id) => (id === "__my_root__" ? null : id))}
                    onDrop={(e) => onDropTarget(null, e)}
                  >
                    <IconFolder className="w-3.5 h-3.5" />
                    <span className="truncate">My workspace</span>
                  </div>
                  {!loading && myNodes.length === 0 ? (
                    <p className={`px-4 py-1 text-xs ${s.muted}`}>
                      Create your own files and folders here. Edits auto-save to the server.
                    </p>
                  ) : (
                    renderTree(null, myNodes)
                  )}
                </>
              )}
            </div>
          </aside>
        ) : null}

        {/* Editor + I/O */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className={`h-9 shrink-0 flex items-end overflow-x-auto border-b ${s.tabBar}`}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`group h-full max-w-[280px] min-w-[120px] flex items-center border-r ${s.border} ${
                  tab.key === activeKey ? s.tabActive : s.tabIdle
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveKey(tab.key)}
                  className="flex-1 h-full px-3 text-left text-[12px] truncate"
                >
                  {tab.title}
                  {tab.dirty ? <span className="ml-1 opacity-60">•</span> : null}
                </button>
                <button
                  type="button"
                  onClick={() => closeTab(tab.key)}
                  className="opacity-0 group-hover:opacity-100 px-2 text-xs hover:bg-white/10 h-full"
                  aria-label={`Close ${tab.title}`}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLangPickerOpen(true)}
              className={`h-full px-3 text-sm ${s.subtle} hover:opacity-100`}
              title="New tab"
            >
              <IconPlus />
            </button>
          </div>

          {activeTab ? (
            <div className={`h-7 shrink-0 px-3 flex items-center gap-2 border-b text-[12px] truncate ${s.border} ${s.muted}`}>
              <span className="truncate flex-1">{activeTab.pathLabel}</span>
              {activeTab.readOnly ? (
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-[#4fc1ff]">
                  Reference · Run only
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex-1 min-h-0 flex">
            <div className={`flex-1 min-w-0 ${s.editor}`}>
              {activeTab ? (
                <CodeEditor
                  value={activeTab.content}
                  language={monacoLanguage(activeTab.languageId)}
                  onChange={updateActiveContent}
                  readOnly={activeTab.readOnly}
                />
              ) : (
                <div className={`h-full flex flex-col items-center justify-center gap-3 ${s.muted}`}>
                  <p className="text-sm">Create a file, open a shared lab, or pick a language to start.</p>
                  <button
                    type="button"
                    onClick={() => setLangPickerOpen(true)}
                    className={`rounded-md px-4 py-2 text-sm ${s.langBtn}`}
                  >
                    Choose a Language
                  </button>
                </div>
              )}
            </div>

            <section className={`w-[min(38vw,420px)] shrink-0 border-l flex flex-col ${s.ioPanel}`}>
              <div className={`h-9 px-3 flex items-center justify-between border-b text-[12px] font-medium ${s.border}`}>
                <span className="border-b-2 border-[#4fc1ff] pb-2 -mb-[9px] px-1">I/O</span>
                <div className={`flex items-center gap-1.5 ${s.subtle}`}>
                  {runtimeMs != null ? (
                    <>
                      <span>{runtimeMs} ms</span>
                      {runOk ? <IconCheck className="text-[#4ec9b0]" /> : null}
                    </>
                  ) : null}
                </div>
              </div>

              <div className="p-3 border-b">
                <div className={`text-[11px] font-semibold tracking-wide mb-1.5 ${s.subtle}`}>STDIN</div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  rows={3}
                  className={`w-full resize-none rounded border px-2.5 py-2 text-[12px] font-mono leading-5 ${s.input}`}
                  placeholder="Input for the program ( Optional )"
                />
              </div>

              <div className="flex-1 min-h-0 flex flex-col p-3">
                <div className="text-[13px] font-semibold mb-2">Output:</div>
                {previewHtml ? (
                  <iframe title="preview" srcDoc={previewHtml} className="flex-1 rounded border bg-white min-h-[120px]" />
                ) : (
                  <pre
                    className={`flex-1 overflow-auto rounded border p-2.5 text-[12px] font-mono leading-5 whitespace-pre-wrap min-h-[120px] ${s.input}`}
                  >
                    {output || (running ? "Running…" : "")}
                  </pre>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Status bar */}
      <footer className={`h-6 shrink-0 px-3 flex items-center justify-between text-[11px] ${s.statusBarAlt}`}>
        <div className="flex items-center gap-1.5">
          <IconCheck className="text-[#4ec9b0]" />
          <span>{running ? "Running" : "Ready"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={toggleTheme} className="hover:underline capitalize">
            {theme}
          </button>
          <a
            href="https://www.azdeploy.com/academy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Wiki
          </a>
          <span>{activeLang.label}</span>
        </div>
      </footer>

      <LanguagePickerModal
        open={langPickerOpen}
        currentId={activeLang.id}
        onClose={() => setLangPickerOpen(false)}
        onSelect={(lang) => void createNode("file", lang, myFilesParentId())}
      />
    </div>
  );
}
