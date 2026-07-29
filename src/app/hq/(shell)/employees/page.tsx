"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import HqModal from "@/components/hq/HqModal";
import { STAFF_ROLES, roleLabel, type StaffEmployee } from "@/lib/staff-types";

type PageData = {
  items: StaffEmployee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "developer",
  department: "",
  jobTitle: "",
  notes: "",
};

export default function HqEmployeesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState("");
  const [taskEmployeeId, setTaskEmployeeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        search,
        ...(roleFilter ? { role: roleFilter } : {}),
      });
      const d = await hqFetch<PageData>(`/api/hq/employees?${q}`);
      setData(d);
      setErr("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createEmployee(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await hqFetch("/api/hq/employees/create", {
        method: "POST",
        body: JSON.stringify(form),
      }, { successMessage: "Employee created" });
      setCreateOpen(false);
      setForm(emptyForm);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function openEdit(emp: StaffEmployee) {
    setEditId(emp.id);
    setForm({
      fullName: emp.fullName,
      email: emp.email,
      password: "",
      phone: emp.phone || "",
      role: emp.role,
      department: emp.department || "",
      jobTitle: emp.jobTitle || "",
      notes: emp.notes || "",
    });
    setEditOpen(true);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        department: form.department,
        jobTitle: form.jobTitle,
        notes: form.notes,
      };
      if (form.password.trim()) payload.password = form.password.trim();
      await hqFetch(`/api/hq/employees/${editId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }, { successMessage: "Employee updated" });
      setEditOpen(false);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function deactivate(id: string) {
    if (!confirm("Deactivate this employee login?")) return;
    await hqFetch(`/api/hq/employees/${id}`, { method: "DELETE" }, { successMessage: "Deactivated" });
    await load();
  }

  async function assignTask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await hqFetch("/api/hq/employees/assign-task", {
        method: "POST",
        body: JSON.stringify({
          employeeId: taskEmployeeId,
          title: taskTitle.trim(),
          priority: taskPriority,
        }),
      }, { successMessage: "Task assigned" });
      setTaskOpen(false);
      setTaskTitle("");
    } finally {
      setBusy(false);
    }
  }

  const field = (key: keyof typeof emptyForm, label: string, type = "text") => (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      {key === "role" ? (
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
        >
          {STAFF_ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          required={key === "fullName" || key === "email" || (key === "password" && createOpen)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-white/50">
            Create staff logins for the hidden portal at <code className="text-[#7dd3fc]">/staff/login</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setCreateOpen(true);
            }}
            className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold"
          >
            + Add employee
          </button>
        </div>
      </div>

      {err ? <p className="text-sm text-red-300">{err}</p> : null}

      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search name / email / phone"
          className="min-w-[220px] flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setPage(1);
            setRoleFilter(e.target.value);
          }}
          className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          {STAFF_ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items || []).map((emp) => (
              <tr key={emp.id} className="border-t border-white/10">
                <td className="px-3 py-2.5">
                  <p className="font-medium">{emp.fullName}</p>
                  <p className="text-xs text-white/40">{emp.jobTitle || emp.department || "—"}</p>
                </td>
                <td className="px-3 py-2.5 text-white/70">{emp.email}</td>
                <td className="px-3 py-2.5">{roleLabel(emp.role)}</td>
                <td className="px-3 py-2.5">
                  <span className={emp.isActive ? "text-[#86efac]" : "text-red-300"}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void openEdit(emp)} className="text-xs text-[#a78bfa] hover:underline">Edit</button>
                    <Link href={`/hq/employees/${emp.id}/hr-docs`} className="text-xs text-[#fbbf24] hover:underline">
                      HR letters
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setTaskEmployeeId(emp.id);
                        setTaskTitle("");
                        setTaskOpen(true);
                      }}
                      className="text-xs text-[#7dd3fc] hover:underline"
                    >
                      Assign task
                    </button>
                    {emp.isActive ? (
                      <button type="button" onClick={() => void deactivate(emp.id)} className="text-xs text-red-300 hover:underline">
                        Deactivate
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 ? (
        <div className="flex items-center gap-3 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/15 px-3 py-1 disabled:opacity-40">Prev</button>
          <span className="text-white/50">Page {data.page} / {data.totalPages}</span>
          <button type="button" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/15 px-3 py-1 disabled:opacity-40">Next</button>
        </div>
      ) : null}

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add employee">
        <form onSubmit={(e) => void createEmployee(e)} className="grid gap-3 sm:grid-cols-2">
          {field("fullName", "Full name *")}
          {field("email", "Email *", "email")}
          {field("password", "Password *", "password")}
          {field("phone", "Phone")}
          {field("role", "Role")}
          {field("department", "Department")}
          {field("jobTitle", "Job title")}
          <div className="sm:col-span-2">{field("notes", "Notes")}</div>
          <button type="submit" disabled={busy} className="sm:col-span-2 rounded-xl bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            Create & share credentials
          </button>
        </form>
      </HqModal>

      <HqModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit employee">
        <form onSubmit={(e) => void saveEdit(e)} className="grid gap-3 sm:grid-cols-2">
          {field("fullName", "Full name *")}
          {field("email", "Email *", "email")}
          {field("password", "New password (optional)", "password")}
          {field("phone", "Phone")}
          {field("role", "Role")}
          {field("department", "Department")}
          {field("jobTitle", "Job title")}
          <div className="sm:col-span-2">{field("notes", "Notes")}</div>
          <button type="submit" disabled={busy} className="sm:col-span-2 rounded-xl bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            Save changes
          </button>
        </form>
      </HqModal>

      <HqModal open={taskOpen} onClose={() => setTaskOpen(false)} title="Assign task">
        <form onSubmit={(e) => void assignTask(e)} className="space-y-3">
          <div>
            <label className="text-xs text-white/50">Task title</label>
            <input required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-white/50">Priority</label>
            <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            Assign
          </button>
        </form>
      </HqModal>
    </div>
  );
}
