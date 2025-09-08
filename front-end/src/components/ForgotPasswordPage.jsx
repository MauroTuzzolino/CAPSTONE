import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/auth/forgot-password?email=${encodeURIComponent(email)}&appUrl=http://localhost:5173`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Errore durante la richiesta");
      }

      setMessage("Se l'email è registrata, riceverai un link per il reset della password.");
    } catch (err) {
      setError("Qualcosa è andato storto. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
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
            <Button type="submit" variant="primary" className="w-100">
              Invia link di reset
            </Button>
          </Form>
          {message && <p className="mt-3 text-success">{message}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
