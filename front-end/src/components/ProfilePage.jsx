import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ user, setUser, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, ...formData }));
    setEditing(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        {/* Colonna sinistra: profilo */}
        <Col xs={12} lg={4} className="mb-4">
          <Card className="p-3 shadow-sm h-100">
            <div className="text-center mb-3">
              <Image src={user?.profileImage || "https://via.placeholder.com/100"} roundedCircle width="100" height="100" />
            </div>

            {!editing ? (
              <div>
                <p>
                  <strong>Nome:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Username:</strong> {user?.username}
                </p>
                <Button variant="warning" className="w-100 mb-2" onClick={() => setEditing(true)}>
                  Modifica
                </Button>
                <Button variant="danger" className="w-100" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Salva
                </Button>
                <Button variant="secondary" className="w-100" onClick={() => setEditing(false)}>
                  Annulla
                </Button>
              </Form>
            )}
          </Card>
        </Col>

        {/* Colonna destra: vuota */}
        <Col xs={12} lg={8} className="mb-4">
          <Card className="p-3 shadow-sm">
            <div style={{ minHeight: "300px" }} className="d-flex align-items-center justify-content-center text-muted">
              Contenuto futuro
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
