import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import BookCover from "../../components/BookCover";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Tabs from "../../components/Tabs";
import { useToast } from "../../context/ToastContext";
import { daysUntil, dueLabel, formatDate } from "../../utils/format";

export default function MyBooks() {
  const showToast = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("current");
  const [returningId, setReturningId] = useState(null);

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

  const handleReturn = async (loan) => {
    const title = loan.bookId?.title || "this book";
    if (!window.confirm(`Return "${title}"?`)) return;
    setReturningId(loan._id);
    try {
      const data = await api(`/borrowings/${loan._id}/return`, { method: "PUT" });
      setHistory((list) => list.map((b) => (b._id === loan._id ? { ...b, ...data.borrowing, bookId: b.bookId } : b)));
      showToast(`Returned "${title}"`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <>
      <PageHeader title="My books" subtitle="Books you have now and everything you've borrowed before." />

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "current", label: "Borrowed now", count: current.length },
          { value: "history", label: "Borrowing history", count: history.length },
        ]}
      />

      {loading && <Loader />}
      {error && <Alert onRetry={load}>{error}</Alert>}

      {!loading && !error && tab === "current" && (
        <>
          {current.length === 0 ? (
            <EmptyState
              title="You have no books on loan"
              action={
                <Link to="/user/catalog" className="btn btn-primary">
                  Browse the catalog
                </Link>
              }
            />
          ) : (
            <div className="loan-list">
              {current.map((loan) => (
                <article key={loan._id} className={loan.status === "OVERDUE" ? "loan loan-overdue" : "loan"}>
                  <BookCover book={loan.bookId} size="small" />
                  <div className="loan-body">
                    <h3>
                      {loan.bookId ? (
                        <Link to={`/user/books/${loan.bookId._id}`}>{loan.bookId.title}</Link>
                      ) : (
                        "Removed book"
                      )}
                    </h3>
                    <p className="muted">{loan.bookId?.author}</p>
                    <dl className="loan-dates">
                      <div>
                        <dt>Borrowed</dt>
                        <dd>{formatDate(loan.borrowedAt)}</dd>
                      </div>
                      <div>
                        <dt>Due</dt>
                        <dd>{formatDate(loan.dueDate)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="loan-side">
                    {loan.status === "OVERDUE" ? (
                      <>
                        <StatusBadge status="OVERDUE" />
                        <span className="due due-late">{dueLabel(loan.dueDate)}</span>
                      </>
                    ) : (
                      <span className={daysUntil(loan.dueDate) <= 3 ? "due due-soon" : "due"}>
                        {dueLabel(loan.dueDate)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() => handleReturn(loan)}
                      disabled={returningId === loan._id}
                    >
                      {returningId === loan._id ? "Returning…" : "Return book"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && tab === "history" && (
        <>
          {history.length === 0 ? (
            <EmptyState title="No borrowing history yet">Books you borrow will be listed here.</EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed</th>
                    <th>Due</th>
                    <th>Returned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((loan) => (
                    <tr key={loan._id}>
                      <td>
                        <strong>{loan.bookId?.title || "Removed book"}</strong>
                        <span className="cell-sub">{loan.bookId?.author}</span>
                      </td>
                      <td>{formatDate(loan.borrowedAt)}</td>
                      <td>{formatDate(loan.dueDate)}</td>
                      <td>{formatDate(loan.returnedAt)}</td>
                      <td>
                        <StatusBadge status={loan.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
