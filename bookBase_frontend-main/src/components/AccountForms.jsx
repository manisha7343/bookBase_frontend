import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { countries } from "../utils/format";
import Alert from "./Alert";

// Used on the user Profile page and the admin Settings page
export function ProfileDetailsForm() {
  const { user, setUser } = useAuth();
  const showToast = useToast();
  const [form, setForm] = useState({ name: user.name, country: user.country });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    if (!form.country.trim()) return setError("Country is required.");

    setSaving(true);
    try {
      const data = await api("/users/profile", { method: "PUT", body: form });
      setUser((current) => ({ ...current, ...data.user }));
      showToast("Profile updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changed = form.name !== user.name || form.country !== user.country;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Alert>{error}</Alert>
      <div className="field">
        <label htmlFor="profile-name">Full name</label>
        <input
          id="profile-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="profile-email">Email</label>
        <input id="profile-email" value={user.email} disabled />
        <span className="hint">Email is used to sign in and can't be changed.</span>
      </div>
      <div className="field">
        <label htmlFor="profile-country">Country</label>
        <input
          id="profile-country"
          list="country-list"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <datalist id="country-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={saving || !changed}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const showToast = useToast();
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.currentPassword) return setError("Enter your current password.");
    if (form.newPassword.length < 6) return setError("New password must be at least 6 characters.");
    if (form.newPassword !== form.confirmPassword) return setError("The new passwords don't match.");

    setSaving(true);
    try {
      await api("/users/password", { method: "PUT", body: form });
      setForm(empty);
      showToast("Password changed");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Alert>{error}</Alert>
      <div className="field">
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={update("currentPassword")}
        />
      </div>
      <div className="field">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={update("newPassword")}
        />
        <span className="hint">At least 6 characters.</span>
      </div>
      <div className="field">
        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Updating…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
