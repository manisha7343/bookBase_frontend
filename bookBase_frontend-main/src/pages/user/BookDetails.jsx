import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import BookCover from "../../components/BookCover";
import Loader from "../../components/Loader";
import { AvailabilityBadge } from "../../components/StatusBadge";
import { useSettings } from "../../context/SettingsContext";
import useBorrow from "../../hooks/useBorrow";
import { dueLabel, formatDate } from "../../utils/format";

export default function BookDetails() {
  const { id } = useParams();
  const { settings } = useSettings();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { loanFor, borrow, busyBookId } = useBorrow();

  useEffect(() => {
    setLoading(true);
    api(`/books/${id}`)
      .then((data) => setBook(data.book))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading book…" />;
  if (error)
    return (
      <>
        <Link to="/user/catalog" className="back-link">
          Back to catalog
        </Link>
        <Alert>{error}</Alert>
      </>
    );

  const loan = loanFor(book._id);
  const info = book.publicationInfo || {};

  const handleBorrow = async () => {
    const newLoan = await borrow(book);
    if (newLoan) setBook({ ...book, availableQuantity: book.availableQuantity - 1 });
  };

  return (
    <>
      <Link to="/user/catalog" className="back-link">
        Back to catalog
      </Link>

      <article className="book-detail">
        <div className="book-detail-cover">
          <BookCover book={book} size="large" />
        </div>

        <div className="book-detail-body">
          <p className="book-category">{book.category}</p>
          <h1>{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>

          <div className="borrow-panel">
            <div>
              <AvailabilityBadge book={book} />
              <p className="muted">
                {book.availableQuantity} of {book.quantity} copies on the shelf
              </p>
            </div>
            {loan ? (
              <div className="borrow-panel-note">
                <strong>You have this book.</strong>
                <span>
                  {dueLabel(loan.dueDate)} ({formatDate(loan.dueDate)}).{" "}
                  <Link to="/user/my-books">Return it from My books</Link>
                </span>
              </div>
            ) : (
              <div className="borrow-panel-action">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={book.availableQuantity < 1 || busyBookId === book._id}
                  onClick={handleBorrow}
                >
                  {busyBookId === book._id ? "Borrowing…" : "Borrow this book"}
                </button>
                <span className="hint">Loan period: {settings.borrowDuration} days</span>
              </div>
            )}
          </div>

          {book.description && (
            <section className="book-description">
              <h2>About this book</h2>
              <p>{book.description}</p>
            </section>
          )}

          <dl className="detail-list">
            <div>
              <dt>ISBN</dt>
              <dd>{book.isbn}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{book.category}</dd>
            </div>
            <div>
              <dt>Publisher</dt>
              <dd>{info.publisher || "—"}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{info.publicationDate ? formatDate(info.publicationDate) : "—"}</dd>
            </div>
            <div>
              <dt>Edition</dt>
              <dd>{info.edition || "—"}</dd>
            </div>
          </dl>
        </div>
      </article>
    </>
  );
}
