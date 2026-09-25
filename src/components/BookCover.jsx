import { useState } from "react";

// Cloth colours for books that have no cover image, picked by category
const clothColours = ["#6d2a2e", "#24344f", "#2f4a3a", "#5a3d2b", "#3d4650", "#4d3047", "#7a5a26"];

function colourFor(text = "") {
  // simple string hash so each category gets a steady colour
  let hash = 0;
  for (const char of text.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return clothColours[hash % clothColours.length];
}

export default function BookCover({ book, size = "medium" }) {
  const [failed, setFailed] = useState(false);

  if (book?.coverImage && !failed) {
    return (
      <img
        className={`cover cover-${size}`}
        src={book.coverImage}
        alt={`Cover of ${book.title}`}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`cover cover-${size} cover-cloth`}
      style={{ "--cloth": colourFor(book?.category) }}
      role="img"
      aria-label={`Cover of ${book?.title}`}
    >
      <span className="cover-title">{book?.title}</span>
      <span className="cover-rule" />
      <span className="cover-author">{book?.author}</span>
    </div>
  );
}
