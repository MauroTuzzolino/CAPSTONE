import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authActions";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stato locale per input form
  const [email, setEmail] = useState(""); // Email inserita dall'utente
  const [password, setPassword] = useState(""); // Password inserita dall'utente

  // Stato per gestione Toast notifiche
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Funzione per mostrare il Toast (notifica temporanea)
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000); // Nasconde dopo 3 secondi
  };

  // Funzione invocata al submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch Redux → login utente
      await dispatch(loginUser(email, password));

      // Se login va a buon fine → mostra notifica + reindirizza
      showToast("Login effettuato con successo!", "success");
      navigate("/profile");
    } catch (err) {
      // Se errore → mostra notifica di errore
      showToast(err.message || "Errore durante il login", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* Card con il form di login */}
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Pulsante indietro → torna alla home */}
        <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/")}>
          Go back
        </Button>

        {/* Titolo */}
        <h3 className="text-center mb-4">Login</h3>

        {/* Form di login */}
        <Form onSubmit={handleSubmit}>
          {/* Campo email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci la tua email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          {/* Campo password */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Inserisci la tua password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          {/* Link recupero password */}
          <div className="mb-3">
            <Button variant="link" onClick={() => navigate("/forgot-password")}>
              Forgotten password?
            </Button>
          </div>

          {/* Pulsanti azione */}
          <div className="d-grid gap-2">
            <Button variant="warning" type="submit">
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate("/register")}>
              Don't have an account? Register
            </Button>
          </div>
        </Form>
      </Card>

      {/* Toast notifiche → appare in alto a destra */}
      {toast.show && (
        <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
          <div className={`toast show text-white ${toast.type === "success" ? "bg-success" : toast.type === "error" ? "bg-danger" : "bg-warning"}`}>
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
