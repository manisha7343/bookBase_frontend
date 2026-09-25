export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Whole days from today until the given date (negative = in the past)
export function daysUntil(value) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(value);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86400000);
}

export function dueLabel(dueDate) {
  const days = daysUntil(dueDate);
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export const countries = [
  "India", "Bangladesh", "Nepal", "Sri Lanka", "Bhutan", "Pakistan", "United Arab Emirates",
  "Saudi Arabia", "Singapore", "Malaysia", "Indonesia", "Japan", "China", "Australia",
  "New Zealand", "United Kingdom", "Ireland", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Sweden", "Canada", "United States", "Brazil", "South Africa", "Kenya", "Nigeria",
];
