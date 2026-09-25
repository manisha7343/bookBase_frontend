import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { homeFor, useAuth } from "../../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, login, notice, setNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setNotice("");

    const found = {};
    if (!form.email.trim()) found.email = "Email is required.";
    else if (!emailPattern.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (!form.password) found.password = "Password is required.";
    if (!form.role) found.role = "Choose how you want to sign in.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const loggedIn = await login({ ...form, email: form.email.trim() });
      // Go back to the page they tried to open, if it belongs to their role
      const from = location.state?.from;
      const target = from && from.startsWith(`/${loggedIn.role}`) ? from : homeFor(loggedIn);
      navigate(target, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-subtitle">Welcome back. Sign in to continue to the library.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <Alert type="info">{notice}</Alert>
          <Alert>{serverError}</Alert>

          <fieldset className="field">
            <legend>Sign in as</legend>
            <div className="segmented">
              <label className={form.role === "user" ? "segment segment-active" : "segment"}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={update("role")}
                />
                Member
              </label>
              <label className={form.role === "admin" ? "segment segment-active" : "segment"}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={update("role")}
                />
                Librarian
              </label>
            </div>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </fieldset>

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
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="small-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update("password")}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
