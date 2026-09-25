import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { daysUntil, dueLabel, formatDate } from "../../utils/format";

export default function UserDashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api("/borrowings/history")
      .then((data) => setHistory(data.borrowings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const current = history
    .filter((b) => b.status !== "RETURNED")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const returned = history.filter((b) => b.status === "RETURNED");
  const overdue = current.filter((b) => b.status === "OVERDUE");
  const dueSoon = current.filter((b) => b.status !== "OVERDUE" && daysUntil(b.dueDate) <= 3);

  // Recent activity: each borrowing gives a "borrowed" and maybe a "returned" event
  const activity = history
    .flatMap((b) => {
      const events = [{ id: `${b._id}-b`, type: "Borrowed", date: b.borrowedAt, book: b.bookId }];
      if (b.returnedAt) events.push({ id: `${b._id}-r`, type: "Returned", date: b.returnedAt, book: b.bookId });
      return events;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} subtitle="Your loans at a glance.">
        <Link to="/user/catalog" className="btn btn-primary">
          Browse books
        </Link>
      </PageHeader>

      {loading && <Loader />}
      {error && <Alert onRetry={load}>{error}</Alert>}

      {!loading && !error && (
        <>
          <div className="stat-row">
            <div className="stat">
              <span className="stat-value">{history.length}</span>
              <span className="stat-label">Total borrowed</span>
            </div>
            <div className="stat">
              <span className="stat-value">{current.length}</span>
              <span className="stat-label">Currently borrowed</span>
              <span className="stat-note">Limit {settings.maxBooks}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{returned.length}</span>
              <span className="stat-label">Returned</span>
            </div>
            <div className={overdue.length > 0 ? "stat stat-alert" : "stat"}>
              <span className="stat-value">{overdue.length}</span>
              <span className="stat-label">Overdue</span>
              {dueSoon.length > 0 && <span className="stat-note">{dueSoon.length} due within 3 days</span>}
            </div>
          </div>

          {overdue.length > 0 && (
            <Alert>
              You have {overdue.length} overdue {overdue.length === 1 ? "book" : "books"}. Please
              return {overdue.length === 1 ? "it" : "them"} as soon as possible.
            </Alert>
          )}

          <div className="two-column">
            <section className="panel">
              <div className="panel-header">
                <h2>Due books</h2>
                <Link to="/user/my-books" className="small-link">
                  Manage my books
                </Link>
              </div>
              {current.length === 0 ? (
                <EmptyState title="No books on loan">
                  <Link to="/user/catalog">Find something to read</Link> in the catalog.
                </EmptyState>
              ) : (
                <ul className="simple-list">
                  {current.map((loan) => (
                    <li key={loan._id}>
                      <div>
                        <strong>{loan.bookId?.title || "Removed book"}</strong>
                        <span className="muted">Due {formatDate(loan.dueDate)}</span>
                      </div>
                      {loan.status === "OVERDUE" ? (
                        <StatusBadge status="OVERDUE" />
                      ) : (
                        <span className={daysUntil(loan.dueDate) <= 3 ? "due due-soon" : "due"}>
                          {dueLabel(loan.dueDate)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <div className="panel-header">
                <h2>Recent activity</h2>
              </div>
              {activity.length === 0 ? (
                <EmptyState title="Nothing yet">Your borrowing activity will appear here.</EmptyState>
              ) : (
                <ul className="simple-list">
                  {activity.map((event) => (
                    <li key={event.id}>
                      <div>
                        <strong>{event.book?.title || "Removed book"}</strong>
                        <span className="muted">
                          {event.type} on {formatDate(event.date)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
