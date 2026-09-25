import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import Alert from "../../components/Alert";
import BookCover from "../../components/BookCover";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import { useToast } from "../../context/ToastContext";
import BookForm from "./BookForm";

export default function ManageBooks() {
  const showToast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null); // null = closed, {} = new book, book = edit

  const load = () => {
    setLoading(true);
    setError("");
    api("/admin/books")
      .then((data) => setBooks(data.books))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category))].sort((a, b) => a.localeCompare(b)),
    [books]
  );

  const term = search.trim().toLowerCase();
  const visible = books.filter(
    (b) =>
      (category === "all" || b.category === category) &&
      (!term ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.toLowerCase().includes(term))
  );

  const handleSave = async (values) => {
    if (editing?._id) {
      const data = await api(`/admin/books/${editing._id}`, { method: "PUT", body: values });
      setBooks((list) => list.map((b) => (b._id === editing._id ? data.book : b)));
      showToast(`Saved changes to "${data.book.title}"`);
    } else {
      const data = await api("/admin/books", { method: "POST", body: values });
      setBooks((list) => [data.book, ...list]);
      showToast(`Added "${data.book.title}"`);
    }
    setEditing(null);
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This can't be undone.`)) return;
    try {
      await api(`/admin/books/${book._id}`, { method: "DELETE" });
      setBooks((list) => list.filter((b) => b._id !== book._id));
      showToast(`Deleted "${book.title}"`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <PageHeader title="Manage books" subtitle={`${books.length} titles in the collection`}>
        <button type="button" className="btn btn-primary" onClick={() => setEditing({})}>
          Add book
        </button>
      </PageHeader>

      <div className="filter-row">
        <input
          type="search"
          className="filter-search"
          placeholder="Search by title, author or ISBN"
          aria-label="Search books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}
      {error && <Alert onRetry={load}>{error}</Alert>}

      {!loading && !error && visible.length === 0 && (
        <EmptyState
          title={books.length === 0 ? "No books yet" : "No books match your search"}
          action={
            books.length === 0 && (
              <button type="button" className="btn btn-primary" onClick={() => setEditing({})}>
                Add the first book
              </button>
            )
          }
        />
      )}

      {!loading && visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Copies</th>
                <th className="cell-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((book) => (
                <tr key={book._id}>
                  <td>
                    <div className="cell-book">
                      <BookCover book={book} size="tiny" />
                      <div>
                        <strong>{book.title}</strong>
                        <span className="cell-sub">{book.author}</span>
                      </div>
                    </div>
                  </td>
                  <td>{book.category}</td>
                  <td className="cell-mono">{book.isbn}</td>
                  <td>
                    <span className={book.availableQuantity === 0 ? "text-danger" : ""}>
                      {book.availableQuantity}
                    </span>{" "}
                    / {book.quantity} available
                  </td>
                  <td className="cell-actions">
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditing(book)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => handleDelete(book)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing._id ? "Edit book" : "Add a book"} onClose={() => setEditing(null)} wide>
          <BookForm
            book={editing._id ? editing : null}
            categories={categories}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </>
  );
}
