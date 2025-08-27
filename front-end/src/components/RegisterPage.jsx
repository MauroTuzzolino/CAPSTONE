import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Simulazione registrazione: recupero dati dal form
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const username = formData.get("username");

    // Aggiorna stato utente
    setUser({
      name: `${name} ${surname}`,
      email,
      username,
      profileImage: "https://via.placeholder.com/30",
    });

    setIsAuthenticated(true);

    navigate("/profile");
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
    </div>
  );
};

export default RegisterPage;
