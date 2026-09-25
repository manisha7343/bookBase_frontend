import { useState } from "react";
import Alert from "../../components/Alert";
import BookCover from "../../components/BookCover";

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

// Add / edit form used in a modal on the Manage Books page
export default function BookForm({ book, categories, onSave, onCancel }) {
  const info = book?.publicationInfo || {};
  const [form, setForm] = useState({
    title: book?.title || "",
    author: book?.author || "",
    category: book?.category || "",
    isbn: book?.isbn || "",
    description: book?.description || "",
    publisher: info.publisher || "",
    publicationDate: toDateInput(info.publicationDate),
    edition: info.edition || "",
    quantity: book?.quantity ?? 1,
    coverImage: book?.coverImage || "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const borrowedCopies = book ? book.quantity - book.availableQuantity : 0;
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    if (!form.title.trim()) found.title = "Title is required.";
    if (!form.author.trim()) found.author = "Author is required.";
    if (!form.category.trim()) found.category = "Category is required.";
    if (!form.isbn.trim()) found.isbn = "ISBN is required.";
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) found.quantity = "Enter a whole number.";
    else if (quantity < borrowedCopies)
      found.quantity = `At least ${borrowedCopies} (copies currently borrowed).`;
    if (form.coverImage && !/^https?:\/\//i.test(form.coverImage.trim()))
      found.coverImage = "Use a full image link starting with http:// or https://";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setServerError("");
    try {
      await onSave({
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        isbn: form.isbn.trim(),
        description: form.description.trim(),
        quantity,
        coverImage: form.coverImage.trim() || null,
        publicationInfo: {
          publisher: form.publisher.trim(),
          publicationDate: form.publicationDate || null,
          edition: form.edition.trim(),
        },
      });
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Alert>{serverError}</Alert>
      <div className="book-form">
        <div className="book-form-fields">
          <div className="field">
            <label htmlFor="bf-title">Title</label>
            <input id="bf-title" value={form.title} onChange={update("title")} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="bf-author">Author</label>
              <input id="bf-author" value={form.author} onChange={update("author")} />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>
            <div className="field">
              <label htmlFor="bf-category">Category</label>
              <input id="bf-category" list="bf-categories" value={form.category} onChange={update("category")} />
              <datalist id="bf-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="bf-isbn">ISBN</label>
              <input id="bf-isbn" value={form.isbn} onChange={update("isbn")} />
              {errors.isbn && <span className="field-error">{errors.isbn}</span>}
            </div>
            <div className="field">
              <label htmlFor="bf-quantity">Total copies</label>
              <input id="bf-quantity" type="number" min="0" value={form.quantity} onChange={update("quantity")} />
              {book && borrowedCopies > 0 && !errors.quantity && (
                <span className="hint">{borrowedCopies} currently borrowed</span>
              )}
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="bf-description">Description</label>
            <textarea id="bf-description" rows="3" value={form.description} onChange={update("description")} />
          </div>
          <div className="field-row field-row-3">
            <div className="field">
              <label htmlFor="bf-publisher">Publisher</label>
              <input id="bf-publisher" value={form.publisher} onChange={update("publisher")} />
            </div>
            <div className="field">
              <label htmlFor="bf-date">Publication date</label>
              <input id="bf-date" type="date" value={form.publicationDate} onChange={update("publicationDate")} />
            </div>
            <div className="field">
              <label htmlFor="bf-edition">Edition</label>
              <input id="bf-edition" value={form.edition} onChange={update("edition")} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="bf-cover">Cover image link</label>
            <input
              id="bf-cover"
              type="url"
              placeholder="https://…"
              value={form.coverImage}
              onChange={update("coverImage")}
            />
            {errors.coverImage ? (
              <span className="field-error">{errors.coverImage}</span>
            ) : (
              <span className="hint">Optional. Books without a cover get a plain cloth cover.</span>
            )}
          </div>
        </div>
        <div className="book-form-preview">
          <span className="hint">Preview</span>
          <BookCover
            key={form.coverImage}
            book={{ title: form.title || "Title", author: form.author, category: form.category, coverImage: form.coverImage }}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : book ? "Save changes" : "Add book"}
        </button>
      </div>
    </form>
  );
}
