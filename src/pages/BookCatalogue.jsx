import { useState } from "react";
import "../App.css";

function BookCatalogue() {
  const [search, setSearch] = useState("");

  const books = [
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      available: true,
    },
    {
      id: 2,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      category: "Finance",
      available: true,
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self Help",
      available: false,
    },
    {
      id: 4,
      title: "Wings of Fire",
      author: "A. P. J. Abdul Kalam",
      category: "Biography",
      available: true,
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📚 Book Catalogue</h1>
        <p>Search and explore books available in the library.</p>
      </div>

      <div className="book-search">
        <input
          type="text"
          placeholder="🔍 Search by title, author or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="catalogue-info">
        <h2>Available Books</h2>
        <p>
          {filteredBooks.length}{" "}
          {filteredBooks.length === 1 ? "book" : "books"} found
        </p>
      </div>

      <div className="dashboard-cards book-grid">
        {filteredBooks.map((book) => (
          <div className="dashboard-card book-card" key={book.id}>
            <div className="book-icon">📖</div>

            <h3>{book.title}</h3>

            <p>
              <strong>Author:</strong> {book.author}
            </p>

            <p>
              <strong>Category:</strong> {book.category}
            </p>

            <span
              className={
                book.available ? "book-available" : "book-unavailable"
              }
            >
              {book.available ? "✓ Available" : "✕ Not Available"}
            </span>

           <button
  className="book-button"
  disabled={!book.available}
  onClick={() => alert(`${book.title} borrowed successfully!`)}
>
  {book.available ? "Borrow Book" : "Unavailable"}
</button>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="activity no-books">
          <h2>No Books Found 📚</h2>
          <p>Try searching with a different title, author or category.</p>
        </div>
      )}
    </div>
  );
}

export default BookCatalogue;