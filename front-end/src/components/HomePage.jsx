import React from "react";
import AppNavbar from "./NavBar";
import Footer from "./Footer";

const HomePage = ({ children, isAuthenticated, user }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <AppNavbar isAuthenticated={isAuthenticated} user={user} />

      {/* Contenuto dinamico */}
      <main className="flex-grow-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
