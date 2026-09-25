import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Search by title, author, category or all three. Sends the user to /user/search
export default function SearchBar({ initialQuery = "", initialField = "all" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [field, setField] = useState(initialField);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/user/search?q=${encodeURIComponent(query.trim())}&by=${field}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="visually-hidden" htmlFor="search-field">
        Search in
      </label>
      <select id="search-field" value={field} onChange={(e) => setField(e.target.value)}>
        <option value="all">All fields</option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="category">Category</option>
      </select>
      <label className="visually-hidden" htmlFor="search-query">
        Search books
      </label>
      <input
        id="search-query"
        type="search"
        placeholder="Search by title, author or category"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-primary">Search</button>
    </form>
  );
}
