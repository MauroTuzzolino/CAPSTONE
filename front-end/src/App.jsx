import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import dei componenti principali
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ProfilePage from "./components/ProfilePage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import AdminUsers from "./components/AdminUsers";

// Import Redux
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/actions/authActions";

function App() {
  // Prendiamo i dati dallo store Redux invece che usare useState locale
  const dispatch = useDispatch();
  const { isAuthenticated, user, userLoaded } = useSelector((state) => state.auth);

  // Effetto che carica l'utente all'avvio
  useEffect(() => {
    dispatch(loadUser()); // <-- questa action gestirà il fetch a /me
  }, [dispatch]);

  // Se i dati dell'utente non sono ancora caricati mostriamo un loading
  if (!userLoaded) {
    return <div className="text-center mt-5 text-white">Loading...</div>;
  }

  // Wrapper per proteggere le route admin
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />; // se non loggato → login
    if (user?.role !== "ADMIN") return <Navigate to="/" />; // se non admin → home
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Route principali con MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
        </Route>

        {/* Route di autenticazione con AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
