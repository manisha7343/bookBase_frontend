import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

const userLinks = [
  { to: "/user/dashboard", label: "Dashboard" },
  { to: "/user/catalog", label: "Book catalog" },
  { to: "/user/search", label: "Search" },
  { to: "/user/my-books", label: "My books" },
  { to: "/user/profile", label: "Profile" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/books", label: "Manage books" },
  { to: "/admin/users", label: "Manage members" },
  { to: "/admin/borrowings", label: "Manage borrowings" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
];

// Sidebar layout used for both the member area and the admin panel
export default function AppLayout({ area }) {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = area === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className="mobile-bar">
        <Link to={links[0].to} className="brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>{settings.libraryName}</span>
        </Link>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <aside className={menuOpen ? "sidebar sidebar-open" : "sidebar"}>
        <Link to={links[0].to} className="brand sidebar-brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>{settings.libraryName}</span>
        </Link>
        <p className="sidebar-area">{area === "admin" ? "Librarian panel" : "Member area"}</p>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "side-link side-link-active" : "side-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-text">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-small btn-block" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
