import React, { useState } from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { BsHouse, BsBoxArrowInRight } from "react-icons/bs";
import { GiRocketThruster } from "react-icons/gi";
import { FaSatellite, FaTable } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";
import logo from "../assets/LOGO-CAPSTONE.png";
import "../css/NavBar.css";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    showToast("Logout effettuato!", "warning");
    navigate("/");
  };

  return (
    <>
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

      {/* Toast notifiche */}
      {toast.show && (
        <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
          <div className={`toast show text-white ${toast.type === "success" ? "bg-success" : toast.type === "warning" ? "bg-warning" : "bg-danger"}`}>
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppNavbar;
