import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsHouse } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="custom-footer bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="d-flex justify-content-evenly text-center text-lg-start">
          {/* Colonna 1: Info */}
          <Col lg={4} className="mb-3 mb-lg-0">
            <h5 className="mb-3">BLACKHOLE</h5>
            <p className="small">Your window to space. News, events, and everything related to the universe.</p>
          </Col>

          {/* Colonna 2: Social */}
          <Col lg={4}>
            <h6 className="mb-3">Seguici</h6>
            <div className="d-flex justify-content-center justify-content-lg-start gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                <BsFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                <BsInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
                <BsTwitter />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-3 border-light" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 small">&copy; {new Date().getFullYear()} BLACKHOLE. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
