import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

export default function ManageUsers() {
  const { user: me } = useAuth();
  const showToast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("user");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    api("/admin/users")
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const term = search.trim().toLowerCase();
  const visible = users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      (statusFilter === "all" || (statusFilter === "blocked") === u.isBlocked) &&
      (!term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
  );

  const toggleBlock = async (u) => {
    const action = u.isBlocked ? "unblock" : "block";
    if (!u.isBlocked && !window.confirm(`Block ${u.name}? They won't be able to sign in or borrow books.`)) return;
    setBusyId(u._id);
    try {
      const data = await api(`/admin/users/${u._id}/${action}`, { method: "PUT" });
      setUsers((list) => list.map((x) => (x._id === u._id ? data.user : x)));
      showToast(`${u.name} ${action === "block" ? "blocked" : "unblocked"}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Manage members" subtitle="View members and block or unblock accounts." />

      <div className="filter-row">
        <input
          type="search"
          className="filter-search"
          placeholder="Search by name or email"
          aria-label="Search members"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="user">Members</option>
          <option value="admin">Librarians</option>
          <option value="all">Everyone</option>
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {loading && <Loader />}
      {error && <Alert onRetry={load}>{error}</Alert>}

      {!loading && !error && visible.length === 0 && <EmptyState title="No accounts match these filters" />}

      {!loading && visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th className="cell-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    <span className="cell-sub">{u.email}</span>
                  </td>
                  <td>{u.country}</td>
                  <td>{u.role === "admin" ? "Librarian" : "Member"}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <span className={u.isBlocked ? "badge badge-overdue" : "badge badge-returned"}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <Link to={`/admin/users/${u._id}`} className="btn btn-secondary btn-small">
                      View
                    </Link>
                    {u._id !== me._id && (
                      <button
                        type="button"
                        className={u.isBlocked ? "btn btn-secondary btn-small" : "btn btn-danger btn-small"}
                        disabled={busyId === u._id}
                        onClick={() => toggleBlock(u)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
