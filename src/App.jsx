import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import BookCatalogue from "./pages/BookCatalogue";

function Layout() {
  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">📚</div>
          <div>
            <h2>BookBase</h2>
            <span>Library System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">MAIN MENU</p>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>🏠</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/books"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>📖</span>
            Book Catalogue
          </NavLink>

          <p className="nav-title">ACCOUNT</p>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>👤</span>
            My Profile
          </NavLink>

        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="user-avatar">AS</div>
            <div>
              <strong>Amay Singh</strong>
              <span>Member</span>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <h3>Library Management</h3>
            <p>Manage your library activities</p>
          </div>

          <div className="topbar-profile">
            <div className="topbar-avatar">AS</div>
            <span>Amay Singh</span>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/books" element={<BookCatalogue />} />
          </Routes>
        </div>

      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;