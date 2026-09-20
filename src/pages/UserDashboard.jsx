import { useNavigate } from "react-router-dom";
import "../App.css";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h1>📚 User Dashboard</h1>
        <p>Welcome back! Here is your library summary.</p>

        <div className="dashboard-buttons">
          <button onClick={() => navigate("/profile")}>
            👤 My Profile
          </button>

          <button onClick={() => navigate("/books")}>
            📖 Browse Books
          </button>
        </div>
      </div>

      {/* Library Summary */}
      <h2 className="library-title">My Library</h2>

      <div className="dashboard-cards">

        <div className="dashboard-card summary-card">
          <div className="summary-icon">📚</div>
          <h3>Total Borrowed Books</h3>
          <p className="summary-number">0</p>
          <span>All borrowed books</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-icon">📖</div>
          <h3>Currently Borrowed</h3>
          <p className="summary-number">0</p>
          <span>Books with you</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-icon">✅</div>
          <h3>Returned Books</h3>
          <p className="summary-number">0</p>
          <span>Successfully returned</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-icon">⏰</div>
          <h3>Due Books</h3>
          <p className="summary-number">0</p>
          <span>Books due soon</span>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="activity dashboard-activity">
        <h2>🕒 Recent Activity</h2>

        <div className="empty-activity">
          <div className="activity-icon">📋</div>
          <h3>No Recent Activity</h3>
          <p>
            Your borrowing and returning activities will appear here.
          </p>
        </div>
      </div>

    </div>
  );
}

export default UserDashboard;