import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Page not found</h1>
        <p className="auth-subtitle">
          The page you were looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary btn-block">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
