import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";

const Profile = () => <h1 className="text-center mt-5">Profilo Utente</h1>;
const RegisterPage = () => <h1 className="text-center mt-5">Registrati</h1>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = {
    name: "Mario Rossi",
    profileImage: "https://via.placeholder.com/30",
  };

  return (
    <Router>
      <Routes>
        {/* Layout principale */}
        <Route element={<MainLayout isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Layout auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
