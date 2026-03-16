import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/session", { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          navigate("/dashboard");
        }
      })
      .catch(err => console.error("Auth check failed", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      }, { withCredentials: true });

      alert(res.data.message);
      onLogin(username, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#588157" }} // Avocado Green
    >
      <div
        className="card shadow p-4"
        style={{
          backgroundColor: "#F9F5EB", // Cream
          color: "#1D1D1D",           // Dark Text
          width: "100%",
          maxWidth: "400px",
          borderRadius: "15px"
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ backgroundColor: "#ffffff", borderColor: "#ccc" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: "#ffffff", borderColor: "#ccc" }}
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#FFB703", // Golden Yellow
                color: "#1D1D1D",
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
