import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { homeFor, useAuth } from "../../context/AuthContext";
import { countries } from "../../utils/format";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Enter your full name (at least 2 characters).";
  if (!emailPattern.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.country.trim()) errors.country = "Country is required.";
  if (!form.role) errors.role = "Choose an account type.";
  if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const newUser = await register({ ...form, email: form.email.trim() });
      // Users go to the user dashboard, admins to the admin dashboard
      navigate(homeFor(newUser), { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="auth-subtitle">Join the library to borrow books and track your loans.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <Alert>{serverError}</Alert>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" autoComplete="name" value={form.name} onChange={update("name")} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              list="register-countries"
              autoComplete="country-name"
              value={form.country}
              onChange={update("country")}
            />
            <datalist id="register-countries">
              {countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.country && <span className="field-error">{errors.country}</span>}
          </div>

          <fieldset className="field">
            <legend>Account type</legend>
            <div className="choice-row">
              <label className={form.role === "user" ? "choice choice-active" : "choice"}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={update("role")}
                />
                <span>
                  <strong>Member</strong>
                  <small>Borrow and return books</small>
                </span>
              </label>
              <label className={form.role === "admin" ? "choice choice-active" : "choice"}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={update("role")}
                />
                <span>
                  <strong>Librarian (Admin)</strong>
                  <small>Manage books, members and loans</small>
                </span>
              </label>
            </div>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </fieldset>

          <div className="field-row">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
