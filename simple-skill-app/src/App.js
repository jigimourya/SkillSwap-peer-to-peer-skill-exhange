import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import SkillProfile from "./SkillProfile";
import UserProfile from "./UserProfile";
import Explore from "./explore";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // ✅ Check session on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        
        const res = await axios.get("http://localhost:5000/api/session", {
          withCredentials: true,
        });
        console.log("Auth check response:", res.data);
        if (res.data.loggedIn) {
          setIsAuthenticated(true);
          setLoggedInUserId(res.data.userId);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogout = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/logout", {}, {
      withCredentials: true
    });

    if (response.status === 200) {
      setIsAuthenticated(false);
      navigate("/login");  // Redirect to login
    }
  } catch (err) {
    alert(err.response?.data?.message || "Logout failed");

  }
};


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/skill-profile" element={<SkillProfile />} />
      <Route path="/explore" element={<Explore currentUserId={loggedInUserId} />} />
      {/* <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} />}
      /> */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route path="/profile/:userId" element={<UserProfile />} />


    </Routes>
  );
}

export default App;