import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./components/HomePage";

// Pagine di esempio
const Home = () => <h1>Home Page</h1>;
const Login = () => <h1>Login Page</h1>;
const Profile = () => <h1>Profilo Utente</h1>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = {
    name: "Mario Rossi",
    profileImage: "https://via.placeholder.com/30",
  };

  return (
    <Router>
      <HomePage isAuthenticated={isAuthenticated} user={user}>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          {/* Pulsante per simulare login/logout */}
          <div className="mt-4">
            <button className="btn btn-primary" onClick={() => setIsAuthenticated(!isAuthenticated)}>
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </HomePage>
    </Router>
  );
}

export default App;
