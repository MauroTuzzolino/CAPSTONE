import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ user, setUser, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || "",
    role: user?.role || "",
  });
  const [likedArticles, setLikedArticles] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

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

  useEffect(() => {
    const fetchLiked = async () => {
      if (!user) return;
      setLoadingLikes(true);
      try {
        const res = await fetch("http://localhost:3001/api/users/me/liked-articles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Errore fetch articoli piaciuti");
        const data = await res.json();
        setLikedArticles(data);
      } catch (err) {
        console.error("Errore nel caricamento articoli piaciuti:", err);
      } finally {
        setLoadingLikes(false);
      }
    };

    fetchLiked();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel caricamento utente");
        const data = await res.json();

        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          role: data.role,
          profileImageUrl: data.profileImageUrl,
        });
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        {/* Colonna sinistra: profilo */}
        <Col xs={12} lg={4} className="mb-4">
          <Card className="p-3 shadow-sm h-100">
            <div className="d-flex justify-content-center m-3">
              <Image
                src={user?.profileImageUrl || "https://avatar.iran.liara.run/username?username=[firstname+lastname]"}
                roundedCircle
                width="100"
                height="100"
              />
            </div>

            {!editing ? (
              <div className="text-dark">
                <p>
                  <strong>Nome:</strong> {user?.firstName}
                </p>
                <p>
                  <strong>Cognome:</strong> {user?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Username:</strong> {user?.username}
                </p>
                <p>
                  <strong>Ruolo:</strong> {user?.role}
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
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProfileImage">
                  <Form.Label>Immagine profilo (URL)</Form.Label>
                  <Form.Control type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} />
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
          <div>
            {loadingLikes ? (
              <p>Caricamento articoli piaciuti...</p>
            ) : likedArticles.length === 0 ? (
              <p className="text-muted">Non hai ancora messo like a nessun articolo.</p>
            ) : (
              likedArticles.map((a) => (
                <Card key={a.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{a.title}</Card.Title>
                    <Card.Img src={a.imageUrl} alt={a.title} style={{ maxHeight: "150px", objectFit: "cover" }} />
                    <Card.Text>{a.summary?.slice(0, 150)}...</Card.Text>
                    <Button variant="primary" onClick={() => window.open(a.url, "_blank")}>
                      Leggi
                    </Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
