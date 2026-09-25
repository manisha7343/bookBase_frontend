import { useNavigate } from "react-router-dom";
import "../App.css";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* Welcome Section */}
      <div className="dashboard-header">

        <div className="dashboard-welcome">
          <div>
            <span className="welcome-label">WELCOME BACK 👋</span>
            <h1>Good to see you, Amay!</h1>
            <p>
              Here's an overview of your library activities and books.
            </p>
          </div>

          <div className="dashboard-header-icon">
            📚
          </div>
        </div>

        <div className="dashboard-buttons">
          <button onClick={() => navigate("/books")}>
            📖 Browse Books
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/profile")}
          >
            👤 My Profile
          </button>
        </div>

      </div>

      {/* Library Summary */}
      <div className="section-heading">
        <div>
          <h2>My Library</h2>
          <p>Keep track of your books and borrowing activity.</p>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card summary-card">
          <div className="summary-top">
            <div className="summary-icon">📚</div>
            <span className="summary-status">TOTAL</span>
          </div>

          <h3>Total Borrowed Books</h3>
          <p className="summary-number">0</p>
          <span>All borrowed books</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-top">
            <div className="summary-icon">📖</div>
            <span className="summary-status">ACTIVE</span>
          </div>

          <h3>Currently Borrowed</h3>
          <p className="summary-number">0</p>
          <span>Books currently with you</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-top">
            <div className="summary-icon">✅</div>
            <span className="summary-status">DONE</span>
          </div>

          <h3>Returned Books</h3>
          <p className="summary-number">0</p>
          <span>Successfully returned</span>
        </div>

        <div className="dashboard-card summary-card">
          <div className="summary-top">
            <div className="summary-icon">⏰</div>
            <span className="summary-status warning">DUE</span>
          </div>

          <h3>Due Books</h3>
          <p className="summary-number">0</p>
          <span>Books due soon</span>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="activity dashboard-activity">

        <div className="activity-header">
          <div>
            <h2>🕒 Recent Activity</h2>
            <p>Your latest library activities will appear here.</p>
          </div>

          <button
            className="activity-button"
            onClick={() => navigate("/books")}
          >
            Browse Books →
          </button>
        </div>

        <div className="empty-activity">
          <div className="activity-icon">📋</div>

          <h3>No Recent Activity</h3>

          <p>
            You haven't borrowed or returned any books yet.
            Start exploring the catalogue to find your next book.
          </p>

          <button
            className="empty-action"
            onClick={() => navigate("/books")}
          >
            Explore Books
          </button>
        </div>

      </div>

    </div>
  );
}

export default UserDashboard;