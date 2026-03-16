import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // You can customize this CSS as needed

function Dashboard({ onLogout }) {
  const [user, setUser] = useState({ fullName: "", imageUrl: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/skill-profile/me", { withCredentials: true })
      .then(res => {
        setUser({
          fullName: res.data.fullName,
          imageUrl: res.data.imageUrl,
        });
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
      });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h3>Skill Swap</h3>
        <div className="user-info">
          <span className="me-3 fw-semibold">{user.fullName || "..."}</span>
          <img
            src={user.imageUrl || "/default.png"}
            alt={user.fullName}
            className="avatar"
          />
          <button className="logout-btn ms-3" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-layout">
        <aside className="sidebar">
          <ul>
            <li><Link to="/dashboard">📊 Dashboard</Link></li>
            <li><Link to="/skill-profile">🛠️ My Skills</Link></li>
            <li><Link to="/explore">🔄 Browse Skills</Link></li>
            <li><Link to="/matches">🎯 My Matches</Link></li>
            <li><Link to="/messages">💬 Messages</Link></li>
            <li><Link to="/settings">⚙️ Settings</Link></li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <h2>Welcome back, {user.fullName || "Learner"}! 👋</h2>
          <div className="dashboard-widgets">
            <div className="card">
              <h5>🛠️ What skills am I offering?</h5>
              <p>View or edit the skills you’re sharing with the community.</p>
              <Link to="/skill-profile" className="btn btn-sm btn-secondary">Edit Skills</Link>
            </div>

            <div className="card">
              <h5>🎓 Who wants to learn from me?</h5>
              <p>See who sent you skill exchange requests.</p>
              <Link to="/requests" className="btn btn-sm btn-secondary">View Requests</Link>
            </div>

            <div className="card">
              <h5>🔄 Who can I learn from?</h5>
              <p>Browse recommended profiles based on your learning interests.</p>
              <Link to="/explore" className="btn btn-sm btn-secondary">Find People</Link>
            </div>

            <div className="card">
              <h5>💬 What's new?</h5>
              <p>Check your recent messages and notifications.</p>
              <Link to="/messages" className="btn btn-sm btn-secondary">Messages</Link>
            </div>

            <div className="card">
              <h5>🔗 How do I connect next?</h5>
              <p>Review your matches and schedule a session.</p>
              <Link to="/matches" className="btn btn-sm btn-secondary">Go to Matches</Link>
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
