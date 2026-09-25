import { Link } from "react-router-dom";
import BookCover from "./BookCover";
import { AvailabilityBadge } from "./StatusBadge";

// One book in the catalog / search results grid
export default function BookCard({ book, loan, onBorrow, busy }) {
  return (
    <article className="book-card">
      <Link to={`/user/books/${book._id}`} className="book-card-cover" tabIndex={-1}>
        <BookCover book={book} />
      </Link>
      <div className="book-card-body">
        <p className="book-category">{book.category}</p>
        <h3 className="book-title">
          <Link to={`/user/books/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">{book.author}</p>
        <AvailabilityBadge book={book} />
      </div>
      <div className="book-card-actions">
        <Link to={`/user/books/${book._id}`} className="btn btn-secondary btn-small">
          View details
        </Link>
        {loan ? (
          <span className="btn btn-small btn-static">On loan to you</span>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-small"
            disabled={book.availableQuantity < 1 || busy}
            onClick={() => onBorrow(book)}
          >
            {busy ? "Borrowing…" : "Borrow"}
          </button>
        )}
      </div>
    </article>
  );
}
