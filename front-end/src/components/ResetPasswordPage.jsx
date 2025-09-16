import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const ResetPasswordPage = () => {
  // Otteniamo i parametri della query string (es: ?token=XYZ)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // token inviato via email

  // Stati locali
  const [newPassword, setPassword] = useState(""); // nuova password
  const [message, setMessage] = useState(null); // messaggio di successo
  const [error, setError] = useState(null); // eventuale errore

  /**
   * Gestione submit del form per aggiornare la password
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      // Chiamata API al backend per resettare la password
      const res = await fetch(`http://localhost:3001/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) throw new Error("Error while resetting password");

      // Se tutto va bene → mostra messaggio di successo
      setMessage("Password updated successfully! You can now log in.");

      // Dopo 2 secondi reindirizza alla pagina di login
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Gestione errori → mostra alert rosso
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Card contenitore */}
      <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          {/* Titolo */}
          <Card.Title className="mb-3">Reset Password</Card.Title>

          {/* FORM reset password */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your new password" value={newPassword} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            {/* Bottone submit */}
            <Button type="submit" variant="primary" className="w-100">
              Update Password
            </Button>
          </Form>

          {/* MESSAGGIO SUCCESSO */}
          {message && (
            <Alert variant="success" className="mt-3">
              {message}
            </Alert>
          )}

          {/* MESSAGGIO ERRORE */}
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

export default ResetPasswordPage;
