import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer py-4 mt-auto">
      <Container>
        <Row className="d-flex justify-content-evenly text-center text-lg-start">
          {/* Colonna 1: Info */}
          <Col lg={4} className="mb-3 mb-lg-0">
            <h5 className="mb-3 footer-title">BLACKHOLE</h5>
            <p className="small footer-text">Your window to space. News, events, and everything related to the universe.</p>
          </Col>

          {/* Colonna 2: Social */}
          <Col lg={4}>
            <h6 className="mb-3 footer-subtitle">Follow us</h6>
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

        <hr className="my-3 footer-divider" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 small footer-text">&copy; {new Date().getFullYear()} BLACKHOLE. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
