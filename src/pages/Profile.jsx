import { useState } from "react";
import "../App.css";

function Profile() {
  const [name, setName] = useState("Amay Singh");
  const [country, setCountry] = useState("India");

  const [editMode, setEditMode] = useState(false);

  const [passwordMode, setPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = () => {
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password reset successfully!");

    setNewPassword("");
    setConfirmPassword("");
    setPasswordMode(false);
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account.</p>
      </div>

      {/* Personal Information */}
      <div className="activity profile-section">
        <h2>👤 Personal Information</h2>

        {editMode ? (
          <div className="profile-form">

            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              value="amay@example.com"
              disabled
            />

            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <div className="profile-buttons">
              <button onClick={handleSaveProfile}>
                Save Changes
              </button>

              <button
                className="cancel-button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {name}
            </p>

            <p>
              <strong>Email:</strong> amay@example.com
            </p>

            <p>
              <strong>Country:</strong> {country}
            </p>

            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Account */}
      <div className="activity profile-section">
        <h2>🔐 Account</h2>

        {!passwordMode ? (
          <button onClick={() => setPasswordMode(true)}>
            Reset Password
          </button>
        ) : (
          <div className="profile-form">

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="profile-buttons">
              <button onClick={handleResetPassword}>
                Reset Password
              </button>

              <button
                className="cancel-button"
                onClick={() => setPasswordMode(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Borrowing History */}
      <div className="activity profile-section">
        <h2>📚 Borrowing History</h2>

        <div className="history-cards">

          <div className="history-card">
            <h3>Borrowed Books</h3>
            <p>0</p>
          </div>

          <div className="history-card">
            <h3>Returned Books</h3>
            <p>0</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;