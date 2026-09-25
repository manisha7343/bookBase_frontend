import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import BookCard from "../../components/BookCard";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import useBorrow from "../../hooks/useBorrow";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const { loanFor, borrow, busyBookId } = useBorrow();

  const loadBooks = () => {
    setLoading(true);
    setError("");
    api("/books")
      .then((data) => setBooks(data.books))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadBooks, []);

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category))].sort((a, b) => a.localeCompare(b)),
    [books]
  );

  const visibleBooks = books.filter(
    (book) =>
      (category === "all" || book.category === category) &&
      (!availableOnly || book.availableQuantity > 0)
  );

  const handleBorrow = async (book) => {
    const loan = await borrow(book);
    if (loan) {
      setBooks((list) =>
        list.map((b) => (b._id === book._id ? { ...b, availableQuantity: b.availableQuantity - 1 } : b))
      );
    }
  };

  return (
    <>
      <PageHeader title="Book catalog" subtitle="Every book in the library collection." />
      <SearchBar />

      <div className="filter-row">
        <div className="field field-inline">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available now
        </label>
        {!loading && <span className="muted filter-count">{visibleBooks.length} books</span>}
      </div>

      {loading && <Loader text="Loading the catalog…" />}
      {error && <Alert onRetry={loadBooks}>{error}</Alert>}

      {!loading && !error && visibleBooks.length === 0 && (
        <EmptyState title={books.length === 0 ? "The catalog is empty" : "No books match these filters"}>
          {books.length === 0
            ? "The librarian hasn't added any books yet."
            : "Try another category or clear the availability filter."}
        </EmptyState>
      )}

      <div className="book-grid">
        {visibleBooks.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            loan={loanFor(book._id)}
            onBorrow={handleBorrow}
            busy={busyBookId === book._id}
          />
        ))}
      </div>
    </>
  );
}
