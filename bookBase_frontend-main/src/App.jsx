import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import NotFound from "./pages/public/NotFound";

import UserDashboard from "./pages/user/UserDashboard";
import Catalog from "./pages/user/Catalog";
import BookDetails from "./pages/user/BookDetails";
import SearchResults from "./pages/user/SearchResults";
import MyBooks from "./pages/user/MyBooks";
import Profile from "./pages/user/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import ManageBorrowings from "./pages/admin/ManageBorrowings";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Member (role: user) pages */}
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/user" element={<AppLayout area="user" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Librarian / admin pages */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AppLayout area="admin" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="borrowings" element={<ManageBorrowings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
