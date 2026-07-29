export type StaffEmployee = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  department?: string;
  jobTitle?: string;
  isActive: boolean;
  profileImageUrl?: string;
  hiredAt?: string;
  notes?: string;
  lastLoginAt?: number | null;
  password?: string;
};

export type StaffTask = {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  dueAt?: number | null;
  startedAt?: number | null;
  completedAt?: number | null;
};

export type StaffTodo = {
  id: string;
  title: string;
  isDone: boolean;
  dueDate?: string;
  sortOrder?: number;
};

export type StaffAttendance = {
  id: string;
  employeeId: string;
  employeeName?: string;
  attendanceDate: string;
  checkInAt?: number | null;
  checkOutAt?: number | null;
  status: string;
  workMode: string;
  notes?: string;
};

export type StaffReport = {
  id: string;
  employeeId: string;
  employeeName?: string;
  reportDate: string;
  summary: string;
  accomplishments?: string;
  blockers?: string;
  planTomorrow?: string;
  hoursWorked?: number | null;
};

export type StaffLead = {
  id: string;
  assignedToEmployeeId?: string | null;
  assigneeName?: string;
  leadName: string;
  phone?: string;
  email?: string;
  source?: string;
  courseInterest?: string;
  status: string;
  nextFollowUpAt?: number | null;
  lastContactedAt?: number | null;
  notes?: string;
};

export const STAFF_ROLES = [
  { value: "developer", label: "Developer" },
  { value: "telecaller", label: "Telecaller" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "HR" },
  { value: "support", label: "Support" },
  { value: "marketing", label: "Marketing" },
  { value: "manager", label: "Manager" },
  { value: "designer", label: "Designer" },
  { value: "other", label: "Other" },
] as const;

export function roleLabel(role: string): string {
  return STAFF_ROLES.find((r) => r.value === role)?.label || role;
}

export function formatStaffTime(ms?: number | null): string {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}
