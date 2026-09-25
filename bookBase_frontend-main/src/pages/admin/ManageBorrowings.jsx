import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Tabs from "../../components/Tabs";
import { useToast } from "../../context/ToastContext";
import { dueLabel, formatDate } from "../../utils/format";

const tabNames = ["ALL", "BORROWED", "OVERDUE", "RETURNED"];

export default function ManageBorrowings() {
  const showToast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = tabNames.includes(params.get("tab")) ? params.get("tab") : "ALL";
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    api("/admin/borrowings")
      .then((data) => setBorrowings(data.borrowings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const count = (status) => borrowings.filter((b) => b.status === status).length;
  const term = search.trim().toLowerCase();
  const visible = borrowings.filter(
    (b) =>
      (tab === "ALL" || b.status === tab) &&
      (!term ||
        b.userId?.name?.toLowerCase().includes(term) ||
        b.userId?.email?.toLowerCase().includes(term) ||
        b.bookId?.title?.toLowerCase().includes(term))
  );

  const markReturned = async (b) => {
    if (!window.confirm(`Mark "${b.bookId?.title}" as returned by ${b.userId?.name}?`)) return;
    setBusyId(b._id);
    try {
      const data = await api(`/admin/borrowings/${b._id}/return`, { method: "PUT" });
      setBorrowings((list) =>
        list.map((x) => (x._id === b._id ? { ...x, status: data.borrowing.status, returnedAt: data.borrowing.returnedAt } : x))
      );
      showToast("Marked as returned");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Manage borrowings" subtitle="Track who has which book and when it is due." />

      <Tabs
        active={tab}
        onChange={(value) => setParams(value === "ALL" ? {} : { tab: value })}
        tabs={[
          { value: "ALL", label: "All", count: borrowings.length },
          { value: "BORROWED", label: "Borrowed", count: count("BORROWED") },
          { value: "OVERDUE", label: "Overdue", count: count("OVERDUE") },
          { value: "RETURNED", label: "Returned", count: count("RETURNED") },
        ]}
      />

      <div className="filter-row">
        <input
          type="search"
          className="filter-search"
          placeholder="Search by member or book"
          aria-label="Search borrowings"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {error && <Alert onRetry={load}>{error}</Alert>}
      {!loading && !error && visible.length === 0 && <EmptyState title="No borrowings to show" />}

      {!loading && visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due date</th>
                <th>Returned</th>
                <th>Status</th>
                <th className="cell-actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.userId?.name || "Deleted user"}</strong>
                    <span className="cell-sub">{b.userId?.email}</span>
                  </td>
                  <td>
                    <strong>{b.bookId?.title || "Removed book"}</strong>
                    <span className="cell-sub">{b.bookId?.author}</span>
                  </td>
                  <td>{formatDate(b.borrowedAt)}</td>
                  <td>
                    {formatDate(b.dueDate)}
                    {b.status !== "RETURNED" && (
                      <span className={b.status === "OVERDUE" ? "cell-sub text-danger" : "cell-sub"}>
                        {dueLabel(b.dueDate)}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(b.returnedAt)}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="cell-actions">
                    {b.status !== "RETURNED" && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        disabled={busyId === b._id}
                        onClick={() => markReturned(b)}
                      >
                        Mark returned
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
