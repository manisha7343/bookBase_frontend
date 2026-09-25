const labels = {
  BORROWED: "Borrowed",
  OVERDUE: "Overdue",
  RETURNED: "Returned",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{labels[status] || status}</span>;
}

export function AvailabilityBadge({ book }) {
  const available = book.availableQuantity > 0;
  return (
    <span className={`badge ${available ? "badge-returned" : "badge-muted"}`}>
      {available ? `${book.availableQuantity} available` : "All copies out"}
    </span>
  );
}
