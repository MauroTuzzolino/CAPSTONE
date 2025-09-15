import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/actions/authActions";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const body = {
      firstName: formData.get("name"),
      lastName: formData.get("surname"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await dispatch(registerUser(body));
      showToast("✅ Registrazione completata!", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Errore durante la registrazione", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Pulsante indietro */}
        <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/")}>
          Indietro
        </Button>

        <h3 className="text-center mb-4">Registrati</h3>

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Nome</Form.Label>
            <Form.Control name="name" type="text" placeholder="Inserisci il tuo nome" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSurname">
            <Form.Label>Cognome</Form.Label>
            <Form.Control name="surname" type="text" placeholder="Inserisci il tuo cognome" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" placeholder="Inserisci la tua email" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" placeholder="Inserisci il tuo username" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder="Inserisci la tua password" required />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="warning" type="submit">
              Registrati
            </Button>
            <Button variant="secondary" onClick={() => navigate("/login")}>
              Hai già un account? Accedi
            </Button>
          </div>
        </Form>
      </Card>

      {/* Toast notifiche */}
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

export default RegisterPage;
