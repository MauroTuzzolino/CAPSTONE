import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ProfilePage from "./components/ProfilePage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setUserLoaded(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token non valido o scaduto");
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setUserLoaded(true);
      }
    };

    fetchUser();
  }, []);

  if (!userLoaded) {
    return <div className="text-center mt-5 text-white">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
