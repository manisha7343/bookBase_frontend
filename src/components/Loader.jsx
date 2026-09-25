export default function Loader({ text = "Loading…", full = false }) {
  return (
    <div className={full ? "loader loader-full" : "loader"}>
      <span className="loader-mark" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
