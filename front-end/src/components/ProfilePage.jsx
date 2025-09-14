import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import "../css/ProfilePage.css";

const ProfilePage = ({ user, setUser, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profileImageUrl: "",
    role: "",
  });
  const [likedArticles, setLikedArticles] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const itemsPerPage = 4;
  const [commentsModal, setCommentsModal] = useState({ open: false, article: null });
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Fetch utente loggato con gestione token scaduto
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token non valido o scaduto");

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
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

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
        console.error(err);
      } finally {
        setLoadingLikes(false);
      }
    };
    fetchLiked();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

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

  const fetchComments = async (articleId) => {
    if (loadingComments[articleId]) return; // evita doppio fetch
    setLoadingComments((prev) => ({ ...prev, [articleId]: true }));

    try {
      const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Errore fetch commenti");
      const data = await res.json();

      setComments((prev) => ({ ...prev, [articleId]: data }));
      setOpenComments((prev) => ({ ...prev, [articleId]: true }));
    } catch (err) {
      console.error(err);
      alert("Errore caricamento commenti");
    } finally {
      setLoadingComments((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  const openCommentsModal = async (article) => {
    setCommentsModal({ open: true, article });
    setLoadingComments(true);
    try {
      const res = await fetch(`http://localhost:3001/api/articles/${article.id}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Errore fetch commenti");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      alert("Errore caricamento commenti");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/api/articles/${commentsModal.article.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) throw new Error("Errore aggiunta commento");
      const added = await res.json();
      setComments((prev) => [added, ...prev]); // aggiorna lista
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Errore aggiunta commento");
    }
  };

  const totalPages = Math.ceil(likedArticles.length / itemsPerPage);

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        {/* Profilo */}
        <Col xs={12} lg={4} className="mb-4">
          <Card className="profile-card text-center p-3 shadow-sm">
            <Image src={user?.profileImageUrl || ""} roundedCircle width="120" height="120" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }} />
            <h4 className="mt-3">
              {user?.firstName} {user?.lastName}
            </h4>
            <p>
              {user?.username} ({user?.role})
            </p>
            <p>{user?.email}</p>

            {!editing ? (
              <>
                <Button variant="warning" className="w-100 mb-2" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button variant="dark" className="w-100" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Form onSubmit={handleSave} className="mt-3 text-start">
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>
                <Button variant="warning" type="submit" className="w-100 mb-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)} className="w-100">
                  Cancel
                </Button>
              </Form>
            )}
          </Card>
        </Col>

        {/* Articoli liked */}
        <Col xs={12} lg={8}>
          {loadingLikes ? (
            <div className="text-center text-white">
              <Spinner animation="border" />
            </div>
          ) : likedArticles.length === 0 ? (
            <p className="text-muted text-center">You haven't liked any articles yet.</p>
          ) : (
            <>
              <Row className="g-3">
                {likedArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((a) => (
                  <Col xs={12} md={6} key={a.id}>
                    <Card className="liked-card shadow-sm">
                      <Card.Img src={a.imageUrl} alt={a.title} style={{ maxHeight: "150px", objectFit: "cover" }} />
                      <Card.Body>
                        <Card.Title>{a.title}</Card.Title>
                        <Card.Text>
                          Likes: {a.likesCount} | Comments: {a.commentsCount}
                        </Card.Text>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="danger"
                            onClick={async () => {
                              try {
                                const res = await fetch(`http://localhost:3001/api/articles/${a.id}/like`, {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                                });
                                if (!res.ok) throw new Error();
                                setLikedArticles((prev) => prev.filter((article) => article.id !== a.id));
                              } catch {
                                alert("Errore nel rimuovere il like");
                              }
                            }}
                          >
                            <FaHeartBroken /> Unlike
                          </Button>

                          {/* Lista commenti */}
                          <Button variant="info" onClick={() => openCommentsModal(a)}>
                            Show comments
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination personalizzata */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                <Button variant="dark" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
                  Prev
                </Button>
                {[...Array(totalPages)].map((_, idx) => (
                  <Button key={idx + 1} variant={currentPage === idx + 1 ? "warning" : "dark"} onClick={() => setCurrentPage(idx + 1)}>
                    {idx + 1}
                  </Button>
                ))}
                <Button variant="dark" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Modal upload immagine */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Change profile picture</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form.Group>
                  <Form.Label>Select an image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUploadImage} disabled={!selectedFile}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal commenti */}
      {commentsModal.open && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comments for: {commentsModal.article.title}</h5>
                <button type="button" className="btn-close" onClick={() => setCommentsModal({ open: false, article: null })}></button>
              </div>

              <div className="modal-body">
                {loadingComments ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : comments.length > 0 ? (
                  <ul className="list-unstyled">
                    {comments.map((c) => (
                      <li key={c.id} className="border-bottom mb-2 pb-2">
                        <strong>{c.authorUsername}:</strong> {c.content}
                        <br />
                        <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}
              </div>

              <div className="modal-footer d-flex flex-column align-items-stretch">
                <Form.Control as="textarea" rows={2} placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <div className="d-flex gap-2 mt-2">
                  <Button variant="secondary" onClick={() => setCommentsModal({ open: false, article: null })}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleAddComment} disabled={!newComment.trim()}>
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProfilePage;
