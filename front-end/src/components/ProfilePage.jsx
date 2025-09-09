import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";

const ProfilePage = ({ user, setUser, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Salvataggio modifica profilo (PATCH)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
        }),
      });

      if (!res.ok) throw new Error("Errore aggiornamento profilo");
      const updatedUser = await res.json();

      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Errore aggiornamento profilo");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // oppure localStorage.clear() se vuoi svuotare tutto
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  // Upload immagine profilo
  const handleUploadImage = async () => {
    if (!selectedFile) return;
    try {
      const formDataImg = new FormData();
      formDataImg.append("file", selectedFile);

      const res = await fetch(`http://localhost:3001/api/users/${user.id}/profile-picture`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formDataImg,
      });

      if (!res.ok) throw new Error("Errore upload immagine");
      const updatedUser = await res.json();

      setUser(updatedUser);
      setShowModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Errore caricamento immagine");
    }
  };

  // Fetch articoli piaciuti
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

  // Fetch utente loggato
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel caricamento utente");
        const data = await res.json();

        setUser(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          profileImageUrl: data.profileImageUrl,
          role: data.role,
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
          <Card className="p-3 shadow-sm" style={{ height: "28%" }}>
            <div className="d-flex justify-content-center m-3">
              <Image
                src={user?.profileImageUrl || ""}
                roundedCircle
                width="100"
                height="100"
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(true)}
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

        {/* Colonna destra: articoli piaciuti */}
        <Col xs={12} lg={8} className="mb-4">
          <div>
            {loadingLikes ? (
              <p className="text-white">Caricamento articoli piaciuti...</p>
            ) : likedArticles.length === 0 ? (
              <p className="text-muted">Non hai ancora messo like a nessun articolo.</p>
            ) : (
              <>
                {likedArticles.slice((currentPage - 1) * 5, currentPage * 5).map((a) => (
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
                ))}

                {/* Paginazione */}
                <Pagination className="justify-content-center mt-3">
                  <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} />
                  {[...Array(Math.ceil(likedArticles.length / 5))].map((_, idx) => (
                    <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next disabled={currentPage * 5 >= likedArticles.length} onClick={() => setCurrentPage((prev) => prev + 1)} />
                </Pagination>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Modal upload immagine */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambia immagine profilo</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form.Group>
                  <Form.Label>Seleziona nuova immagine</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annulla
                </Button>
                <Button variant="primary" onClick={handleUploadImage} disabled={!selectedFile}>
                  Carica
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProfilePage;
