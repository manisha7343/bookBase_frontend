import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { ChangePasswordForm, ProfileDetailsForm } from "../../components/AccountForms";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

export default function Settings() {
  const showToast = useToast();
  const { refresh } = useSettings();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/admin/settings")
      .then((data) => {
        const s = data.settings;
        setForm({
          libraryName: s.libraryName || "",
          maxBooks: s.maxBooks,
          borrowDuration: s.borrowDuration,
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          address: s.address || "",
        });
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.libraryName.trim()) return setError("Library name is required.");
    if (!(Number(form.maxBooks) >= 1)) return setError("Maximum books per member must be 1 or more.");
    if (!(Number(form.borrowDuration) >= 1)) return setError("Loan period must be at least 1 day.");

    setSaving(true);
    try {
      await api("/admin/settings", {
        method: "PUT",
        body: { ...form, maxBooks: Number(form.maxBooks), borrowDuration: Number(form.borrowDuration) },
      });
      refresh();
      showToast("Library settings saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Library rules, contact details and your own account." />

      <section className="panel">
        <h2>Library settings</h2>
        {loadError && <Alert>{loadError}</Alert>}
        {!form && !loadError && <Loader />}
        {form && (
          <form className="form" onSubmit={handleSubmit} noValidate>
            <Alert>{error}</Alert>
            <div className="field">
              <label htmlFor="s-name">Library name</label>
              <input id="s-name" value={form.libraryName} onChange={update("libraryName")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="s-max">Maximum books per member</label>
                <input id="s-max" type="number" min="1" value={form.maxBooks} onChange={update("maxBooks")} />
              </div>
              <div className="field">
                <label htmlFor="s-duration">Loan period (days)</label>
                <input
                  id="s-duration"
                  type="number"
                  min="1"
                  value={form.borrowDuration}
                  onChange={update("borrowDuration")}
                />
                <span className="hint">Applies to new loans. Existing due dates don't change.</span>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="s-email">Contact email</label>
                <input id="s-email" type="email" value={form.contactEmail} onChange={update("contactEmail")} />
              </div>
              <div className="field">
                <label htmlFor="s-phone">Contact phone</label>
                <input id="s-phone" type="tel" value={form.contactPhone} onChange={update("contactPhone")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="s-address">Address</label>
              <input id="s-address" value={form.address} onChange={update("address")} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>Your account</h2>
          <ProfileDetailsForm />
        </section>
        <section className="panel">
          <h2>Change password</h2>
          <ChangePasswordForm />
        </section>
      </div>
    </>
  );
}
