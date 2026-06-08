"use client";

import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { COMPILER_LANGUAGES } from "@/lib/compiler-languages";

type CompilerStudent = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  notes: string;
  courses: Array<{ id: string; slug: string; title: string; enrollmentActive?: boolean }>;
};

type CompilerCourse = { id: string; slug: string; title: string; description: string; isActive: boolean };
type CompilerNode = {
  id: string;
  courseId: string;
  parentId: string | null;
  name: string;
  nodeType: "folder" | "file";
  language: string;
  content: string;
  isShared: boolean;
  sortOrder: number;
};

export default function HqCompilerPage() {
  const [students, setStudents] = useState<CompilerStudent[]>([]);
  const [courses, setCourses] = useState<CompilerCourse[]>([]);
  const [nodes, setNodes] = useState<CompilerNode[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollCourseId, setEnrollCourseId] = useState("");

  const [newCourseSlug, setNewCourseSlug] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");

  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState<"folder" | "file">("file");
  const [nodeLanguage, setNodeLanguage] = useState("python");
  const [nodeContent, setNodeContent] = useState("");
  const [nodeShared, setNodeShared] = useState(true);
  const [nodeParentId, setNodeParentId] = useState("");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const loadStudents = useCallback(async () => {
    const res = await hqFetch<{ items: CompilerStudent[] }>("/api/hq/compiler/students");
    setStudents(res.items || []);
  }, []);

  const loadCourses = useCallback(async () => {
    const res = await hqFetch<{ items: CompilerCourse[] }>("/api/hq/compiler/courses");
    setCourses(res.items || []);
    if (!selectedCourseId && res.items?.[0]?.id) setSelectedCourseId(res.items[0].id);
  }, [selectedCourseId]);

  const loadNodes = useCallback(async () => {
    if (!selectedCourseId) {
      setNodes([]);
      return;
    }
    const res = await hqFetch<{ items: CompilerNode[] }>(`/api/hq/compiler/nodes?courseId=${selectedCourseId}`);
    setNodes(res.items || []);
  }, [selectedCourseId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      await Promise.all([loadStudents(), loadCourses()]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [loadStudents, loadCourses]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    void loadNodes();
  }, [loadNodes]);

  useEffect(() => {
    if (!selectedNode) return;
    setNodeName(selectedNode.name);
    setNodeType(selectedNode.nodeType);
    setNodeLanguage(selectedNode.language || "python");
    setNodeContent(selectedNode.content || "");
    setNodeShared(selectedNode.isShared);
    setNodeParentId(selectedNode.parentId || "");
  }, [selectedNode]);

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    await hqFetch("/api/hq/compiler/students/create", {
      method: "POST",
      body: JSON.stringify({ email: newEmail, fullName: newName, isActive: true }),
    });
    setNewEmail("");
    setNewName("");
    await loadStudents();
  }

  async function toggleStudentActive(student: CompilerStudent) {
    await hqFetch(`/api/hq/compiler/students/${student.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !student.isActive }),
    });
    await loadStudents();
  }

  async function enrollStudent(e: React.FormEvent) {
    e.preventDefault();
    await hqFetch("/api/hq/compiler/enrollments", {
      method: "POST",
      body: JSON.stringify({ studentId: enrollStudentId, courseId: enrollCourseId }),
    });
    await loadStudents();
  }

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    await hqFetch("/api/hq/compiler/courses/create", {
      method: "POST",
      body: JSON.stringify({ slug: newCourseSlug, title: newCourseTitle }),
    });
    setNewCourseSlug("");
    setNewCourseTitle("");
    await loadCourses();
  }

  async function createNode(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourseId) return;
    await hqFetch("/api/hq/compiler/nodes/create", {
      method: "POST",
      body: JSON.stringify({
        courseId: selectedCourseId,
        parentId: nodeParentId || null,
        name: nodeName,
        nodeType,
        language: nodeLanguage,
        content: nodeContent,
        isShared: nodeShared,
      }),
    });
    setNodeName("");
    setNodeContent("");
    setNodeShared(true);
    await loadNodes();
  }

  async function saveSelectedNode() {
    if (!selectedNodeId) return;
    await hqFetch(`/api/hq/compiler/nodes/${selectedNodeId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: nodeName,
        language: nodeLanguage,
        content: nodeContent,
        isShared: nodeShared,
        parentId: nodeParentId || null,
      }),
    });
    await loadNodes();
  }

  async function deleteSelectedNode() {
    if (!selectedNodeId) return;
    await hqFetch(`/api/hq/compiler/nodes/${selectedNodeId}`, { method: "DELETE", body: "{}" });
    setSelectedNodeId(null);
    await loadNodes();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">Academy Compiler</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Compiler access & content</h1>
        <p className="mt-2 text-sm text-[#94a3b8] max-w-3xl">
          Add student emails, enroll courses, and publish instructor labs per course. Shared files appear under{" "}
          <strong className="text-white">Instructor Labs</strong> in the student IDE — students can open and{" "}
          <strong className="text-white">Run</strong> them as reference but cannot edit them. Students create their own
          files in <strong className="text-white">My Files</strong> (editable, auto-saved).
        </p>
      </div>

      {err ? <p className="text-amber-400 text-sm font-mono">{err}</p> : null}
      {loading ? <p className="text-[#64748b] text-sm">Loading…</p> : null}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Allowed students (email allowlist)</h2>
          <form onSubmit={addStudent} className="grid gap-3 sm:grid-cols-2">
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="student@gmail.com"
              type="email"
              required
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            />
            <button type="submit" className="sm:col-span-2 rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold">
              Add / update student email
            </button>
          </form>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {students.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 px-3 py-2 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{s.email}</p>
                  <p className="text-xs text-[#94a3b8]">{s.fullName || "—"}</p>
                  <p className="text-[10px] text-[#64748b] mt-1">
                    {(s.courses || []).map((c) => c.title).join(", ") || "No enrollments"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleStudentActive(s)}
                  className={`text-xs px-2 py-1 rounded-lg border ${
                    s.isActive ? "border-emerald-500/30 text-emerald-300" : "border-rose-500/30 text-rose-300"
                  }`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Course enrollment</h2>
          <form onSubmit={enrollStudent} className="grid gap-3">
            <select
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.email}
                </option>
              ))}
            </select>
            <select
              value={enrollCourseId}
              onChange={(e) => setEnrollCourseId(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              required
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/30 px-4 py-2 text-sm">
              Enroll student
            </button>
          </form>

          <h3 className="text-sm font-semibold text-white pt-2">Courses</h3>
          <form onSubmit={addCourse} className="grid gap-3 sm:grid-cols-2">
            <input
              value={newCourseSlug}
              onChange={(e) => setNewCourseSlug(e.target.value)}
              placeholder="course-slug"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              required
            />
            <input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="Course title"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              required
            />
            <button type="submit" className="sm:col-span-2 rounded-xl border border-white/10 px-4 py-2 text-sm">
              Add course
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <h2 className="text-lg font-semibold text-white">Shared files & folders</h2>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedNodeId(null);
            }}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-white/10 p-3 max-h-[420px] overflow-y-auto space-y-1">
            {nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNodeId(n.id)}
                className={`w-full text-left rounded-lg px-2 py-1.5 text-sm ${
                  selectedNodeId === n.id ? "bg-white/10 text-white" : "text-[#cbd5e1] hover:bg-white/5"
                }`}
              >
                {n.nodeType === "folder" ? "📁" : "📄"} {n.name}
                {n.isShared ? <span className="ml-2 text-[10px] text-emerald-400">shared</span> : null}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <form onSubmit={createNode} className="grid gap-3 sm:grid-cols-2">
              <input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Name"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                required
              />
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as "folder" | "file")}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="file">File</option>
                <option value="folder">Folder</option>
              </select>
              <select
                value={nodeParentId}
                onChange={(e) => setNodeParentId(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="">Root folder</option>
                {nodes
                  .filter((n) => n.nodeType === "folder")
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
              </select>
              <select
                value={nodeLanguage}
                onChange={(e) => setNodeLanguage(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {COMPILER_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <label className="sm:col-span-2 flex items-center gap-2 text-sm text-[#cbd5e1]">
                <input type="checkbox" checked={nodeShared} onChange={(e) => setNodeShared(e.target.checked)} />
                Publish to students (read-only reference — they can Run but not edit)
              </label>
              {nodeType === "file" ? (
                <textarea
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                  rows={8}
                  placeholder="Starter code / SQL / notes"
                  className="sm:col-span-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm font-mono"
                />
              ) : null}
              <button type="submit" className="sm:col-span-2 rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold">
                {selectedNodeId ? "Create another item" : "Create item"}
              </button>
            </form>

            {selectedNode ? (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => void saveSelectedNode()}
                  className="rounded-xl border border-[#00d4ff]/30 px-4 py-2 text-sm"
                >
                  Save selected
                </button>
                <button
                  type="button"
                  onClick={() => void deleteSelectedNode()}
                  className="rounded-xl border border-rose-500/30 text-rose-300 px-4 py-2 text-sm"
                >
                  Delete selected
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
