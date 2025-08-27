import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Pulsante indietro */}
        <Button variant="outline-secondary" className="mb-3 d-flex align-items-center gap-1" onClick={() => navigate("/")}>
          <ArrowLeft /> Indietro
        </Button>

        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Inserisci la tua email" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Inserisci la tua password" required />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
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
