import { Link, Outlet } from "react-router-dom";
import { homeFor, useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export default function PublicLayout() {
  const { user } = useAuth();
  const { settings } = useSettings();

  return (
    <div className="public-shell">
      <header className="public-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>{settings.libraryName}</span>
        </Link>
        <nav className="public-nav">
          {user ? (
            <Link className="btn btn-primary btn-small" to={homeFor(user)}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Sign in
              </Link>
              <Link className="btn btn-primary btn-small" to="/register">
                Create account
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <span>{settings.libraryName}</span>
        {settings.contactEmail && <span>{settings.contactEmail}</span>}
      </footer>
    </div>
  );
}
