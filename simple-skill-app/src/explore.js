import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

const Explore = ({ currentUserId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setError(null);
      try {
        const userIdClean = currentUserId.startsWith(":") ? currentUserId.slice(1) : currentUserId;
        const res = await fetch(`http://localhost:5000/api/skill-profile/recommendations/${userIdClean}?t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
            Pragma: "no-cache",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch recommendations.");
        const data = await res.json();
        setRecommendations(data.matches || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchRecommendations();
  }, [currentUserId]);

    return (
    <div className="explore-page">
      {/* Header */}
      <header className="explore-header">
        <div className="logo">Skill Swap</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Browse Skills</Link>
          <Link to="/skill-profile">Post a Skill</Link>
          <Link to="/dashboard">My Profile</Link>
          <Link to="/messages">Messages</Link>
        </nav>
        <div>
          <Link to="/logout" className="header-btn">Logout</Link>
          <Link to="/register" className="header-btn signup-btn">Sign Up</Link>
        </div>
      </header>

      {/* Main Section */}
      <div className="main-content">
        <aside className="sidebar">
          <h3>🔍 Filters</h3>
          <label>Category:</label>
          <select>
            <option>All</option>
            <option>Fitness</option>
            <option>Tech</option>
          </select>
          <label>Skill Level:</label>
          <select>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
          <label>Availability:</label>
          <select>
            <option>Weekends</option>
            <option>Weekdays</option>
          </select>
        </aside>

        <div className="content-area">
          <h2 className="explore-title">Recommended People to Connect</h2>
          {loading && <p>Loading recommendations...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="card-grid">
            {recommendations.map((user, idx) => (
              <div className="recommend-card" key={idx}>
                <img
                  src={user.imageUrl || "/default.png"}
                  alt={user.fullName}
                  className="avatar"
                />
                <h3>{user.fullName}</h3>
                <p><strong></strong> {user.location || "Online"}</p>
                {/* <p><strong>Skill Title:</strong> {user.skillTitle}</p> */}
                <p><strong>Skills:</strong> {user.skills?.join(", ")}</p>
                <p><strong>Bio:</strong>{user.lookingFor}</p>
                <p>{user.bio}</p>
                <div className="card-buttons">
                  <Link to={`/profile/${user.userId}`} className="view-btn">View Profile</Link>
                  <Link to={`/messages/${user._id}`} className="msg-btn">Message</Link>
                  <Link to={`/messages/${user._id}`} className="btn btn-primary">Connect</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Skill Swap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Explore;
