import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authActions";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(email, password));
      showToast("Login effettuato con successo!", "success");
      navigate("/profile");
    } catch (err) {
      showToast(err.message || "Errore durante il login", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/")}>
          Indietro
        </Button>

        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci la tua email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Inserisci la tua password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <div className="mb-3">
            <Button variant="link" onClick={() => navigate("/forgot-password")}>
              Password dimenticata?
            </Button>
          </div>

          <div className="d-grid gap-2">
            <Button variant="warning" type="submit">
              Accedi
            </Button>
            <Button variant="secondary" onClick={() => navigate("/register")}>
              Non hai un account? Registrati
            </Button>
          </div>
        </Form>
      </Card>

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
