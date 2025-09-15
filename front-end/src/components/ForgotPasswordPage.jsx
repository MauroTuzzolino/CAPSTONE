import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/authActions";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stato globale Redux
  const { loading, error, forgotPasswordMessage } = useSelector((state) => state.auth);

  // Stato locale solo per input
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          {/* Pulsante indietro */}
          <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/login")}>
            Indietro
          </Button>

          <Card.Title className="mb-3">Recupera Password</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Inserisci la tua email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? "Invio..." : "Invia link di reset"}
            </Button>
          </Form>

          {/* Messaggi */}
          {forgotPasswordMessage && (
            <Alert variant="success" className="mt-3">
              {forgotPasswordMessage}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
