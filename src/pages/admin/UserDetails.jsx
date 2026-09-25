import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

export default function UserDetails() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const showToast = useToast();
  const [member, setMember] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api(`/admin/users/${id}`), api(`/admin/borrowings?userId=${id}`)])
      .then(([userData, borrowData]) => {
        setMember(userData.user);
        setBorrowings(borrowData.borrowings);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error)
    return (
      <>
        <Link to="/admin/users" className="back-link">Back to members</Link>
        <Alert>{error}</Alert>
      </>
    );
  if (!member) return <Loader />;

  const active = borrowings.filter((b) => b.status !== "RETURNED");

  const toggleBlock = async () => {
    const action = member.isBlocked ? "unblock" : "block";
    if (!member.isBlocked && !window.confirm(`Block ${member.name}?`)) return;
    setBusy(true);
    try {
      const data = await api(`/admin/users/${member._id}/${action}`, { method: "PUT" });
      setMember(data.user);
      showToast(`${member.name} ${action === "block" ? "blocked" : "unblocked"}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link to="/admin/users" className="back-link">Back to members</Link>
      <PageHeader title={member.name} subtitle={member.email}>
        {member._id !== me._id && (
          <button
            type="button"
            className={member.isBlocked ? "btn btn-secondary" : "btn btn-danger"}
            onClick={toggleBlock}
            disabled={busy}
          >
            {member.isBlocked ? "Unblock account" : "Block account"}
          </button>
        )}
      </PageHeader>

      <section className="panel">
        <dl className="detail-list detail-list-inline">
          <div>
            <dt>Country</dt>
            <dd>{member.country}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{member.role === "admin" ? "Librarian" : "Member"}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{formatDate(member.createdAt)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={member.isBlocked ? "badge badge-overdue" : "badge badge-returned"}>
                {member.isBlocked ? "Blocked" : "Active"}
              </span>
            </dd>
          </div>
          <div>
            <dt>Books on loan</dt>
            <dd>{active.length}</dd>
          </div>
          <div>
            <dt>Total borrowings</dt>
            <dd>{borrowings.length}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>Borrowing history</h2>
        {borrowings.length === 0 ? (
          <EmptyState title="This member hasn't borrowed any books" />
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
                {borrowings.map((b) => (
                  <tr key={b._id}>
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
        )}
      </section>
    </>
  );
}
