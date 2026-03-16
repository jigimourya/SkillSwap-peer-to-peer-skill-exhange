import React from "react";
import { Link } from "react-router-dom";
import './Home.css'; // For custom styles & animations

function Home() {
  return (
    <div className="home-wrapper">
      {/* Header */}
      <header className="home-header">
        <div className="logo">Skill Swap</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Browse Skills</Link>
          <Link to="/skill-profile">Post a Skill</Link>
          <Link to="/dashboard">My Profile</Link>
          <Link to="/messages">Messages</Link>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn signup-btn">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Learn what you love, <br /> teach what you know.</h1>
          <p>Connect with people who want to learn what you offer and teach what you want to learn.</p>
          <div className="hero-actions">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="skill-search"
                placeholder="Search for a skill..."
              />
            </div>
            <Link to="/explore" className="btn browse-btn">Browse Skills</Link>
          </div>

        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span role="img" aria-label="Post">🧑‍🏫</span>
            <h4>Post Your Skill</h4>
            <p>Tell us what you can teach or want to learn.</p>
          </div>
          <div className="step">
            <span role="img" aria-label="Find">🧩</span>
            <h4>Find a Match</h4>
            <p>Connect with like-minded learners or experts.</p>
          </div>
          <div className="step">
            <span role="img" aria-label="Swap">🔄</span>
            <h4>Swap & Learn</h4>
            <p>Start your mutual learning journey!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Skill Swap. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
