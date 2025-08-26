import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsHouse, BsBoxArrowInRight } from "react-icons/bs"; // icone
import logo from "../assets/LOGO-CAPSTONE.jpg";

const AppNavbar = ({ isAuthenticated, user }) => {
  return (
    <Navbar bg="black" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Toggle per mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex w-100 justify-content-between flex-column flex-lg-row align-items-lg-center">
            {/* Colonna sinistra vuota (solo per desktop, su mobile sparisce) */}
            <div className="d-none d-lg-block w-50"></div>

            {/* Colonna destra con link + logo */}
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-end w-100 w-lg-50">
              <Nav className="mb-3 mb-lg-0 me-lg-4 text-center text-lg-start">
                {/* Home */}
                <Nav.Link as={NavLink} to="/" end className={({ isActive }) => (isActive ? "active " : "") + "d-flex align-items-center nav-link-custom"}>
                  <BsHouse /> Home
                </Nav.Link>

                {/* Login o Profilo */}
                {!isAuthenticated ? (
                  <Nav.Link as={NavLink} to="/login" className={({ isActive }) => (isActive ? "active " : "") + "d-flex align-items-center nav-link-custom"}>
                    <BsBoxArrowInRight /> Login
                  </Nav.Link>
                ) : (
                  <Nav.Link as={NavLink} to="/profile" className={({ isActive }) => (isActive ? "active " : "") + "d-flex align-items-center nav-link-custom"}>
                    <Image src={user?.profileImage || "https://via.placeholder.com/30"} roundedCircle width="30" height="30" className="me-2" />
                    {user?.name || "Profilo"}
                  </Nav.Link>
                )}
              </Nav>

              {/* Logo (ridimensionato su mobile) */}
              <Navbar.Brand className="text-center">
                <img src={logo} alt="Logo" height="50" className="d-inline-block align-top mb-2 mb-lg-0" />
              </Navbar.Brand>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
