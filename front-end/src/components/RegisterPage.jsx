import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/actions/authActions";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stato per gestire i toast di notifica
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  /**
   * Funzione per mostrare un toast temporaneo
   * @param {string} message - Messaggio da mostrare
   * @param {string} type - Tipo di toast ("success", "error", "warning")
   */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    // Dopo 3 secondi il toast scompare
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  /**
   * Gestione submit del form di registrazione
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    // Raccolta dati dal form
    const formData = new FormData(e.target);
    const body = {
      firstName: formData.get("name"),
      lastName: formData.get("surname"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      // Invio richiesta di registrazione tramite Redux action
      await dispatch(registerUser(body));
      showToast("Registration completed!", "success");

      // Redirect alla pagina di login
      navigate("/login");
    } catch (err) {
      // Gestione errori
      showToast(err.message || "Errore durante la registrazione", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* Card principale */}
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Pulsante per tornare indietro */}
        <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/")}>
          Go back
        </Button>

        {/* Titolo form */}
        <h3 className="text-center mb-4">Register</h3>

        {/* FORM REGISTRAZIONE */}
        <Form onSubmit={handleRegister}>
          {/* Nome */}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Inserisci il tuo nome" required />
          </Form.Group>

          {/* Cognome */}
          <Form.Group className="mb-3" controlId="formSurname">
            <Form.Label>Surname</Form.Label>
            <Form.Control name="surname" type="text" placeholder="Inserisci il tuo cognome" required />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" placeholder="Inserisci la tua email" required />
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" type="text" placeholder="Inserisci il tuo username" required />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder="Inserisci la tua password" required />
          </Form.Group>

          {/* Pulsanti */}
          <div className="d-grid gap-2">
            {/* Submit */}
            <Button variant="warning" type="submit">
              Register
            </Button>

            {/* Vai a Login */}
            <Button variant="secondary" onClick={() => navigate("/login")}>
              Already have an account? Login
            </Button>
          </div>
        </Form>
      </Card>

      {/* TOAST NOTIFICHE */}
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
