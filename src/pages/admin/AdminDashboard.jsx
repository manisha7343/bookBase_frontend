import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { formatDate, dueLabel } from "../../utils/format";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    api("/admin/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  if (error) return <Alert onRetry={load}>{error}</Alert>;
  if (!data) return <Loader text="Loading dashboard…" />;

  const { stats, recentBorrowings, overdueList } = data;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="An overview of the library today.">
        <Link to="/admin/books" className="btn btn-primary">
          Add a book
        </Link>
      </PageHeader>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-value">{stats.totalBooks}</span>
          <span className="stat-label">Total books</span>
          <span className="stat-note">{stats.availableBooks} copies on shelf</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.totalUsers}</span>
          <span className="stat-label">Total members</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.borrowedBooks}</span>
          <span className="stat-label">Borrowed</span>
          <span className="stat-note">{stats.returnedBooks} returned so far</span>
        </div>
        <div className={stats.overdueBooks > 0 ? "stat stat-alert" : "stat"}>
          <span className="stat-value">{stats.overdueBooks}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Recent borrowings</h2>
            <Link to="/admin/borrowings" className="small-link">
              View all
            </Link>
          </div>
          {recentBorrowings.length === 0 ? (
            <EmptyState title="No books are out on loan" />
          ) : (
            <div className="table-wrap">
              <table className="table table-compact">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Book</th>
                    <th>Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBorrowings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.userId?.name || "Deleted user"}</td>
                      <td>{b.bookId?.title || "Removed book"}</td>
                      <td>{formatDate(b.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Overdue books</h2>
            <Link to="/admin/borrowings?tab=OVERDUE" className="small-link">
              View all
            </Link>
          </div>
          {overdueList.length === 0 ? (
            <EmptyState title="Nothing is overdue" />
          ) : (
            <div className="table-wrap">
              <table className="table table-compact">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Book</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueList.map((b) => (
                    <tr key={b._id}>
                      <td>{b.userId?.name || "Deleted user"}</td>
                      <td>{b.bookId?.title || "Removed book"}</td>
                      <td className="text-danger">{dueLabel(b.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
