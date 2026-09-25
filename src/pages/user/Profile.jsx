import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { ChangePasswordForm, ProfileDetailsForm } from "../../components/AccountForms";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/format";

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    api("/borrowings/history")
      .then((data) => setHistory(data.borrowings))
      .catch(() => setHistory([]));
  }, []);

  const borrowed = (history || []).filter((b) => b.status !== "RETURNED");
  const returned = (history || []).filter((b) => b.status === "RETURNED");

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details, password and reading record." />

      <section className="panel profile-summary">
        <div className="avatar avatar-large" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <dl className="detail-list detail-list-inline">
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>{user.country}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>Update details</h2>
          <ProfileDetailsForm />
        </section>
        <section className="panel">
          <h2>Reset password</h2>
          <ChangePasswordForm />
        </section>
      </div>

      <div className="two-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Borrowed books</h2>
            <span className="muted">{history ? borrowed.length : "…"}</span>
          </div>
          <BookList items={borrowed} dateLabel="Due" dateField="dueDate" empty="No books on loan." />
        </section>
        <section className="panel">
          <div className="panel-header">
            <h2>Returned books</h2>
            <span className="muted">{history ? returned.length : "…"}</span>
          </div>
          <BookList items={returned} dateLabel="Returned" dateField="returnedAt" empty="No returned books yet." />
        </section>
      </div>
      <p className="muted">
        See full details in <Link to="/user/my-books">My books</Link>.
      </p>
    </>
  );
}

function BookList({ items, dateLabel, dateField, empty }) {
  if (items.length === 0) return <p className="muted">{empty}</p>;
  return (
    <ul className="simple-list">
      {items.slice(0, 8).map((b) => (
        <li key={b._id}>
          <div>
            <strong>{b.bookId?.title || "Removed book"}</strong>
            <span className="muted">
              {dateLabel} {formatDate(b[dateField])}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
