import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { homeFor, useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const spineColours = ["#6d2a2e", "#24344f", "#2f4a3a", "#5a3d2b", "#3d4650", "#4d3047", "#7a5a26"];
const spineHeights = [92, 100, 86, 96, 88, 100, 90, 94, 84, 98, 90, 95];

export default function Home() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [shelf, setShelf] = useState([]);
  const [bookCount, setBookCount] = useState(null);

  // Show real titles from the catalog on the shelf
  useEffect(() => {
    api("/books")
      .then((data) => {
        setShelf(data.books.slice(0, 12));
        setBookCount(data.count);
      })
      .catch(() => {});
  }, []);

  const spines = shelf.length > 0 ? shelf : Array.from({ length: 10 }, () => null);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>{settings.libraryName}</h1>
          <p className="hero-lead">
            Browse the collection, borrow books online and keep track of every due date. Librarians
            manage books, members and loans from one place.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link className="btn btn-primary" to={homeFor(user)}>
                Go to your dashboard
              </Link>
            ) : (
              <>
                <Link className="btn btn-primary" to="/register">
                  Create an account
                </Link>
                <Link className="btn btn-secondary" to="/login">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="shelf" aria-hidden="true">
          <div className="shelf-books">
            {spines.map((book, index) => (
              <div
                key={book?._id || index}
                className="spine"
                style={{
                  "--cloth": spineColours[index % spineColours.length],
                  height: `${spineHeights[index % spineHeights.length]}%`,
                }}
              >
                {book && <span>{book.title}</span>}
              </div>
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      </section>

      <section className="home-section">
        <h2>How borrowing works</h2>
        <ol className="steps">
          <li>
            <h3>Create your account</h3>
            <p>Register with your name, email and country, then sign in.</p>
          </li>
          <li>
            <h3>Find a book</h3>
            <p>Browse the catalog or search by title, author or category.</p>
          </li>
          <li>
            <h3>Borrow and return</h3>
            <p>
              Borrow available copies for {settings.borrowDuration} days and return them from your
              dashboard.
            </p>
          </li>
        </ol>
      </section>

      <section className="home-section home-info">
        <div>
          <h2>Library rules</h2>
          <dl className="info-list">
            <div>
              <dt>Loan period</dt>
              <dd>{settings.borrowDuration} days</dd>
            </div>
            <div>
              <dt>Books at a time</dt>
              <dd>Up to {settings.maxBooks}</dd>
            </div>
            {bookCount !== null && (
              <div>
                <dt>Titles in the collection</dt>
                <dd>{bookCount}</dd>
              </div>
            )}
          </dl>
          <p className="muted">
            Books kept past the due date are marked overdue until they are returned.
          </p>
        </div>
        {(settings.contactEmail || settings.contactPhone || settings.address) && (
          <div>
            <h2>Contact the library</h2>
            <dl className="info-list">
              {settings.address && (
                <div>
                  <dt>Address</dt>
                  <dd>{settings.address}</dd>
                </div>
              )}
              {settings.contactEmail && (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                  </dd>
                </div>
              )}
              {settings.contactPhone && (
                <div>
                  <dt>Phone</dt>
                  <dd>{settings.contactPhone}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </section>
    </>
  );
}
