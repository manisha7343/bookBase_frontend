import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import BookCard from "../../components/BookCard";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import useBorrow from "../../hooks/useBorrow";

const fieldNames = { all: "all fields", title: "title", author: "author", category: "category" };

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const field = fieldNames[params.get("by")] ? params.get("by") : "all";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loanFor, borrow, busyBookId } = useBorrow();

  useEffect(() => {
    if (!query) return;
    // "all" searches title, author and category together (the API matches any of them)
    const search = new URLSearchParams();
    const fields = field === "all" ? ["title", "author", "category"] : [field];
    fields.forEach((f) => search.set(f, query));

    setLoading(true);
    setError("");
    api(`/books/search?${search.toString()}`)
      .then((data) => setBooks(data.books))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, field]);

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
      <PageHeader
        title="Search"
        subtitle={query ? `Results for "${query}" in ${fieldNames[field]}` : "Find a book by title, author or category."}
      />
      <SearchBar key={`${query}-${field}`} initialQuery={query} initialField={field} />

      {loading && <Loader text="Searching…" />}
      <Alert>{error}</Alert>

      {!query && (
        <EmptyState title="Start a search">
          Type a title, an author's name or a category like "Fiction" above.
        </EmptyState>
      )}

      {query && !loading && !error && books.length === 0 && (
        <EmptyState title="No books found">
          Nothing matched "{query}". Check the spelling or search in all fields.
        </EmptyState>
      )}

      {query && !loading && books.length > 0 && (
        <p className="muted result-count">
          {books.length} {books.length === 1 ? "book" : "books"} found
        </p>
      )}

      <div className="book-grid">
        {query &&
          books.map((book) => (
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
