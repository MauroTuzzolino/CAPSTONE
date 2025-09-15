import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsHouse, BsBoxArrowInRight } from "react-icons/bs";
import logo from "../assets/LOGO-CAPSTONE.png";
import "../css/NavBar.css";
import { GiRocketThruster } from "react-icons/gi";
import { FaSatellite, FaTable } from "react-icons/fa";

const AppNavbar = ({ isAuthenticated, user, setIsAuthenticated }) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
    // qui puoi anche aggiungere la logica per rimuovere il token
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto custom-toggler">
          <GiRocketThruster size={28} color="#fff" />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex flex-column flex-lg-row w-100 align-items-center justify-content-lg-end justify-content-center">
            {/* Links */}
            <Nav className="flex-column flex-lg-row align-items-center mb-3 mb-lg-0 me-lg-3 text-center text-lg-start">
              <Nav.Link as={NavLink} to="/" end className="d-flex align-items-center nav-link-custom">
                <BsHouse className="nav-icon me-1" /> Home
              </Nav.Link>

              {!isAuthenticated ? (
                <Nav.Link as={NavLink} to="/login" className="d-flex align-items-center nav-link-custom">
                  <BsBoxArrowInRight className="nav-icon me-1" /> Login
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center nav-link-custom">
                    <Image src={user?.profileImageUrl || "https://via.placeholder.com/30"} roundedCircle width="30" height="30" className="me-2" />
                    {user?.username || "Profile"}
                  </Nav.Link>

                  {/* Link Admin visibile solo agli utenti con ruolo ADMIN */}
                  {user?.role === "ADMIN" && (
                    <Nav.Link as={NavLink} to="/admin/users" className="d-flex align-items-center nav-link-custom">
                      <FaTable className="nav-icon me-1" /> Admin Panel
                    </Nav.Link>
                  )}
                </>
              )}

              <Nav.Link href="https://stellarium-web.org/" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center nav-link-custom">
                <FaSatellite className="nav-icon me-1" /> Planetary
              </Nav.Link>
            </Nav>

            {/* Logo */}
            <Navbar.Brand className="d-flex justify-content-center">
              <img src={logo} alt="Logo" height="50" />
            </Navbar.Brand>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
