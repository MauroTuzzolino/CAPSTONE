import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/authActions";

const ForgotPasswordPage = () => {
  const navigate = useNavigate(); // Hook per navigare tra le pagine
  const dispatch = useDispatch(); // Hook Redux per dispatchare azioni

  // --- Stato globale Redux ---
  // loading = true se la richiesta di reset è in corso
  // error = messaggio di errore da mostrare se qualcosa va storto
  // forgotPasswordMessage = messaggio di successo restituito dal backend
  const { loading, error, forgotPasswordMessage } = useSelector((state) => state.auth);

  // --- Stato locale ---
  // Qui tengo solo l’email inserita dall’utente
  const [email, setEmail] = useState("");

  // --- Gestione submit form ---
  // Quando l’utente invia il form, dispatchiamo l’action forgotPassword
  // che manderà l’email al backend per generare un link di reset
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Card al centro dello schermo */}
      <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          {/* Pulsante per tornare indietro alla login */}
          {/* Uso navigate per spostarmi sulla pagina di login */}
          <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/login")}>
            Go back
          </Button>

          {/* Titolo del form */}
          <Card.Title className="mb-3">Recover password</Card.Title>

          {/* Form di recupero password */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              {/* Campo email */}
              <Form.Control type="email" placeholder="Inserisci la tua email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            {/* Bottone invio */}
            {/* Disabilitato se loading è true */}
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? "Invio..." : "Invia link di reset"}
            </Button>
          </Form>

          {/* Messaggi di conferma o errore */}
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
