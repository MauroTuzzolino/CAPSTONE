import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // 🔹 Pulizia token all'avvio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Proviamo a decodificare il payload del JWT
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;

        // Se il token è scaduto → rimuovi
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Token valido → mantieni stato autenticato
          setIsAuthenticated(true);
          setUser({ email: payload.sub, id: payload.id }); // oppure quello che hai nel payload
        }
      } catch (err) {
        // Token malformato → rimuovi
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Layout principale */}
        <Route element={<MainLayout isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
        </Route>

        {/* Layout auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
