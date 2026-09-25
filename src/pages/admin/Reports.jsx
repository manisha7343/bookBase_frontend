import { useEffect, useState } from "react";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Tabs from "../../components/Tabs";
import { formatDate } from "../../utils/format";

const reportTabs = [
  { value: "books", label: "Books" },
  { value: "users", label: "Members" },
  { value: "borrowings", label: "Borrowings" },
  { value: "overdue", label: "Overdue" },
];

export default function Reports() {
  const [type, setType] = useState("books");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setReport(null);
    setError("");
    api(`/admin/reports/${type}`)
      .then(setReport)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [type]);

  return (
    <>
      <PageHeader title="Reports" subtitle={`Generated ${formatDate(new Date())}`}>
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          Print report
        </button>
      </PageHeader>

      <Tabs tabs={reportTabs} active={type} onChange={setType} />

      {error && <Alert onRetry={load}>{error}</Alert>}
      {!report && !error && <Loader text="Preparing report…" />}

      {report?.reportType === type && type === "books" && <BooksReport report={report} />}
      {report?.reportType === type && type === "users" && <UsersReport report={report} />}
      {report?.reportType === type && type === "borrowings" && <BorrowingsReport report={report} />}
      {report?.reportType === type && type === "overdue" && <OverdueReport report={report} />}
    </>
  );
}

function BooksReport({ report }) {
  const totals = report.categoryBreakdown.reduce(
    (sum, c) => ({
      titles: sum.titles + c.totalBooks,
      copies: sum.copies + c.totalCopies,
      available: sum.available + c.availableCopies,
    }),
    { titles: 0, copies: 0, available: 0 }
  );

  if (report.books.length === 0) return <EmptyState title="No books in the collection" />;

  return (
    <section className="panel">
      <h2>Collection by category</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th className="num">Titles</th>
              <th className="num">Copies</th>
              <th className="num">On shelf</th>
              <th className="num">On loan</th>
            </tr>
          </thead>
          <tbody>
            {report.categoryBreakdown.map((c) => (
              <tr key={c._id}>
                <td>{c._id}</td>
                <td className="num">{c.totalBooks}</td>
                <td className="num">{c.totalCopies}</td>
                <td className="num">{c.availableCopies}</td>
                <td className="num">{c.totalCopies - c.availableCopies}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num">{totals.titles}</td>
              <td className="num">{totals.copies}</td>
              <td className="num">{totals.available}</td>
              <td className="num">{totals.copies - totals.available}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function UsersReport({ report }) {
  const members = report.users.filter((u) => u.role === "user");
  const blocked = report.users.filter((u) => u.isBlocked).length;
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>All accounts</h2>
        <span className="muted">
          {members.length} members, {report.count - members.length} librarians, {blocked} blocked
        </span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {report.users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.country}</td>
                <td>{u.role === "admin" ? "Librarian" : "Member"}</td>
                <td>{u.isBlocked ? "Blocked" : "Active"}</td>
                <td>{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BorrowingsReport({ report }) {
  if (report.count === 0) return <EmptyState title="No borrowings recorded yet" />;
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>All borrowings</h2>
        <span className="muted">{report.count} records</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Returned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.borrowings.map((b) => (
              <tr key={b._id}>
                <td>{b.userId?.name || "Deleted user"}</td>
                <td>{b.bookId?.title || "Removed book"}</td>
                <td>{formatDate(b.borrowedAt)}</td>
                <td>{formatDate(b.dueDate)}</td>
                <td>{formatDate(b.returnedAt)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OverdueReport({ report }) {
  if (report.count === 0) return <EmptyState title="No overdue books">Every borrowed book is within its loan period.</EmptyState>;
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Overdue books</h2>
        <span className="muted">{report.count} overdue</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th className="num">Days overdue</th>
            </tr>
          </thead>
          <tbody>
            {report.overdueBorrowings.map((b) => (
              <tr key={b.borrowingId}>
                <td>
                  {b.user?.name || "Deleted user"}
                  <span className="cell-sub">{b.user?.email}</span>
                </td>
                <td>{b.book?.title || "Removed book"}</td>
                <td>{formatDate(b.borrowedAt)}</td>
                <td>{formatDate(b.dueDate)}</td>
                <td className="num text-danger">{b.daysOverdue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
