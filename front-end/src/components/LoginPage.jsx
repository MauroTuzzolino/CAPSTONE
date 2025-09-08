import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Errore durante il login");
      }

      const data = await res.json();
      const token = data.token;

      // Salvo il token nel localStorage
      localStorage.setItem("token", token);

      // Decodifico il JWT per ottenere informazioni utente
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ email: payload.sub, id: payload.id });

      // Stato autenticato
      setIsAuthenticated(true);

      // Reindirizzo al profilo
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Pulsante indietro */}
        <Button variant="outline-secondary" className="mb-3 d-flex justify-content-center align-items-center gap-1 w-25" onClick={() => navigate("/")}>
          Indietro
        </Button>

        <h3 className="text-center mb-4">Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

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
    </div>
  );
};

export default LoginPage;
