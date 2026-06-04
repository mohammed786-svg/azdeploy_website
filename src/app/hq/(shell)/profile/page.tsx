"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { HQ_API_LOCAL_STORAGE_KEY, HQ_API_SESSION_STORAGE_KEY } from "@/lib/hq-session-keys";

type HqProfile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  jobTitle: string;
  profileImageUrl: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function persistApiSession(token: string) {
  if (typeof window === "undefined" || !token) return;
  window.sessionStorage.setItem(HQ_API_SESSION_STORAGE_KEY, token);
  window.localStorage.setItem(HQ_API_LOCAL_STORAGE_KEY, token);
}

export default function HqProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credSaving, setCredSaving] = useState(false);
  const [credErr, setCredErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: HqProfile }>("/api/hq/me", undefined, { suppressSuccessToast: true });
      const item = res.item;
      setFullName(item.fullName || "");
      setPhone(item.phone || "");
      setJobTitle(item.jobTitle || "");
      setProfileImageUrl(item.profileImageUrl || "");
      setEmail(item.email || "");
      setNewEmail(item.email || "");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onProfileImageChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErr("Image size must be under 2MB.");
      return;
    }
    setImageUploading(true);
    setErr("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await hqFetch<{ url: string }>(
        "/api/hq/uploads/profile-image",
        { method: "POST", body: form },
        { successMessage: "Profile photo uploaded." }
      );
      if (!res?.url) throw new Error("Upload failed");
      setProfileImageUrl(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setImageUploading(false);
    }
  }

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: HqProfile }>(
        "/api/hq/me/profile",
        {
          method: "PATCH",
          body: JSON.stringify({ fullName, phone, jobTitle, profileImageUrl }),
        },
        { successMessage: "Profile saved." }
      );
      const item = res.item;
      setFullName(item.fullName || "");
      setPhone(item.phone || "");
      setJobTitle(item.jobTitle || "");
      setProfileImageUrl(item.profileImageUrl || "");
      setEmail(item.email || "");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setProfileSaving(false);
    }
  }

  async function onSaveCredentials(e: React.FormEvent) {
    e.preventDefault();
    setCredSaving(true);
    setCredErr("");
    const changingEmail = newEmail.trim().toLowerCase() !== email.trim().toLowerCase();
    const changingPassword = Boolean(newPassword.trim());
    if (!changingEmail && !changingPassword) {
      setCredErr("Change your email and/or enter a new password.");
      setCredSaving(false);
      return;
    }
    try {
      const res = await hqFetch<{ item: HqProfile; apiSession?: string }>(
        "/api/hq/me/credentials",
        {
          method: "PATCH",
          body: JSON.stringify({
            currentPassword,
            newEmail: changingEmail ? newEmail.trim() : "",
            newPassword: changingPassword ? newPassword : "",
            confirmPassword: changingPassword ? confirmPassword : "",
          }),
        },
        { successMessage: "Login credentials updated." }
      );
      if (res.apiSession) persistApiSession(res.apiSession);
      const item = res.item;
      setEmail(item.email || "");
      setNewEmail(item.email || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (ex) {
      setCredErr(ex instanceof Error ? ex.message : "Update failed");
    } finally {
      setCredSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-[#64748b] font-mono text-sm animate-pulse py-16 text-center">Loading profile…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">Account</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Profile & login</h1>
        <p className="mt-2 text-sm text-[#94a3b8] max-w-xl">
          Update your HQ display details and change the email or password you use to sign in.
        </p>
      </div>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3" role="alert">
          {err}
        </p>
      )}

      <form onSubmit={onSaveProfile} className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-white">Profile details</h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-white/10 bg-black/40">
              {profileImageUrl ? (
                <Image src={profileImageUrl} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-[#64748b]">
                  {(fullName || email || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onProfileImageChange(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              disabled={imageUploading}
              onClick={() => fileRef.current?.click()}
              className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:text-white disabled:opacity-50"
            >
              {imageUploading ? "Uploading…" : "Change photo"}
            </button>
          </div>

          <div className="flex-1 grid gap-4 sm:grid-cols-2 w-full">
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#a78bfa]/50 focus:outline-none focus:ring-1 focus:ring-[#a78bfa]/30"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30"
                placeholder="+91 …"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Role / title</span>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30"
                placeholder="e.g. Academy admin"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Login email (read-only)</span>
              <input
                value={email}
                readOnly
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#94a3b8] cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-[#64748b]">Change login email in the section below.</p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={profileSaving}
          className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {profileSaving ? "Saving…" : "Save profile"}
        </button>
      </form>

      <form onSubmit={onSaveCredentials} className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6 sm:p-8 space-y-5">
        <h2 className="text-lg font-semibold text-white">Login credentials</h2>
        <p className="text-sm text-[#94a3b8]">Enter your current password to change your sign-in email or password.</p>

        <label className="block max-w-md">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#f87171]/40 focus:outline-none focus:ring-1 focus:ring-[#f87171]/25"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">New login email</span>
            <input
              type="email"
              autoComplete="username"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#a78bfa]/50 focus:outline-none focus:ring-1 focus:ring-[#a78bfa]/30"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">New password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30"
              placeholder="Min. 8 characters"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30"
            />
          </label>
        </div>

        {credErr && (
          <p className="text-sm text-amber-400/90 font-mono" role="alert">
            {credErr}
          </p>
        )}

        <button
          type="submit"
          disabled={credSaving}
          className="rounded-xl border border-[#f87171]/30 bg-[#f87171]/10 px-6 py-3 text-sm font-semibold text-[#fca5a5] hover:bg-[#f87171]/15 disabled:opacity-50"
        >
          {credSaving ? "Updating…" : "Update login credentials"}
        </button>
      </form>
    </div>
  );
}
