import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Form, Button, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCommentDots, FaHeartBroken } from "react-icons/fa";

// Import delle azioni Redux
import { loadUser, logout } from "../redux/actions/authActions";
import { fetchLikedArticles, fetchComments, addComment, deleteComment, toggleLikeArticle } from "../redux/actions/articleActions";
import { updateUserSelf } from "../redux/actions/userActions";

// Stile CSS dedicato
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stato globale da Redux
  const { user, userLoaded } = useSelector((state) => state.auth);
  const { articles } = useSelector((state) => state.articles);

  // Stati locali
  const [editing, setEditing] = useState(false); // modalità modifica dati profilo
  const [formData, setFormData] = useState({}); // campi form profilo
  const [currentPage, setCurrentPage] = useState(1); // paginazione articoli
  const [showCommentsModal, setShowCommentsModal] = useState(false); // modal commenti
  const [activeArticle, setActiveArticle] = useState(null); // articolo selezionato
  const [newComment, setNewComment] = useState(""); // testo nuovo commento
  const [showProfileModal, setShowProfileModal] = useState(false); // modal per immagine profilo
  const [newProfileFile, setNewProfileFile] = useState(null); // file immagine caricata
  const [uploading, setUploading] = useState(false); // stato caricamento immagine

  const itemsPerPage = 4; // numero articoli per pagina

  // Caricamento utente se non già caricato
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userLoaded) dispatch(loadUser());
  }, [dispatch, userLoaded]);

  // Caricamento articoli piaciuti e relativi commenti
  useEffect(() => {
    if (user) {
      // Precompilazione form profilo
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      });

      const token = localStorage.getItem("token");

      const fetchArticlesWithComments = async () => {
        // Ottengo articoli piaciuti
        const likedArticles = await dispatch(fetchLikedArticles(token));

        // Per ogni articolo, ottengo i commenti
        const articlesWithComments = await Promise.all(
          likedArticles.map(async (article) => {
            const comments = await dispatch(fetchComments(article.id, token));
            return {
              ...article,
              comments: comments || [],
              commentsCount: comments?.length || 0,
            };
          })
        );

        // Aggiorno lo store
        dispatch({ type: "ARTICLES_LOADED", payload: articlesWithComments });
      };

      fetchArticlesWithComments();
    }
  }, [user, dispatch]);

  // Gestione modifica form profilo
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Salvataggio modifiche profilo
  const handleSave = async () => {
    try {
      await dispatch(updateUserSelf(formData));
      setEditing(false);
    } catch (err) {
      console.error("Errore durante l'aggiornamento:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Apertura modal commenti
  const handleShowComments = async (article) => {
    setActiveArticle(article);
    setShowCommentsModal(true);
  };

  // Aggiunta nuovo commento
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");

    const newC = await dispatch(addComment(activeArticle.id, newComment, token));

    // Aggiornamento locale stato articolo
    setActiveArticle((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), { ...newC, canDelete: true }],
      commentsCount: (prev.commentsCount || 0) + 1,
    }));

    setNewComment("");
  };

  // Eliminazione commento
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    await dispatch(deleteComment(activeArticle.id, commentId, token));

    setActiveArticle((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== commentId),
      commentsCount: (prev.commentsCount || 1) - 1,
    }));
  };

  // Toggle like/unlike articolo
  const handleToggleLike = (article) => {
    const token = localStorage.getItem("token");
    dispatch(toggleLikeArticle(article, token, true));
  };

  // Calcolo numero totale di pagine
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Spinner se dati utente non ancora caricati
  if (!userLoaded) return <Spinner animation="border" />;

  return (
    <Container className="profile-container my-5">
      <Row className="justify-content-center">
        {/* CARD PROFILO */}
        <Col xs={12} lg={4} className="mb-4">
          <Card className="profile-card text-center p-3 shadow-sm">
            {/* Immagine profilo */}
            <div>
              <Image
                src={user?.profileImageUrl || "/default-avatar.png"}
                roundedCircle
                width="120"
                height="120"
                onClick={() => setShowProfileModal(true)}
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* Info utente */}
            <h4 className="mt-3">
              {user?.firstName} {user?.lastName}
            </h4>
            <p>
              {user?.username} ({user?.role})
            </p>
            <p>{user?.email}</p>

            {/* Pulsanti / Form modifica */}
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
              <Form className="mt-3 text-start">
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
                </Form.Group>
                <Button variant="warning" className="w-100 mb-2" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="secondary" className="w-100" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </Form>
            )}
          </Card>
        </Col>

        {/* CARD ARTICOLI */}
        <Col xs={12} lg={8}>
          {articles.length === 0 ? (
            <p className="text-light text-center fs-5 mt-5">No liked items</p>
          ) : (
            <>
              <Row className="g-3">
                {articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((a) => (
                  <Col xs={12} md={6} key={a.id}>
                    <Card className="liked-card shadow-sm">
                      <Card.Img src={a.imageUrl || null} style={{ maxHeight: "150px", objectFit: "cover" }} />
                      <Card.Body>
                        <Card.Title>{a.title}</Card.Title>
                        <Card.Text>
                          Likes: {a.likesCount || 0} | Comments: {a.commentsCount || 0}
                        </Card.Text>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="danger" onClick={() => handleToggleLike(a)}>
                            <FaHeartBroken /> Unlike
                          </Button>
                          <Button variant="outline-warning" onClick={() => handleShowComments(a)}>
                            <FaCommentDots />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* PAGINAZIONE */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                <Button variant="dark" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                  Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button key={i + 1} variant={currentPage === i + 1 ? "warning" : "dark"} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </Button>
                ))}
                <Button variant="dark" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* MODAL COMMENTI */}
      {showCommentsModal && activeArticle && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light shadow-lg rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-warning">{activeArticle.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCommentsModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={3} value={newComment} placeholder="Write a comment..." onChange={(e) => setNewComment(e.target.value)} />
                </Form.Group>
                <Button variant="warning" className="mb-3 w-100 fw-bold" onClick={handleAddComment}>
                  Add Comment
                </Button>

                <ul className="list-group list-group-flush">
                  {(activeArticle.comments || []).map((c) => (
                    <li key={c.id} className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center">
                      <span>
                        <strong className="text-warning">{c.authorUsername}</strong>: {c.content}
                      </span>
                      {c.canDelete && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(c.id)}>
                          Delete
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOTO PROFILO */}
      {showProfileModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light p-3 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title text-warning">Update your profile picture</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form.Group>
                  <Form.Label>Choose an image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setNewProfileFile(e.target.files[0])} />
                </Form.Group>
                <Button
                  variant="warning"
                  className="mt-3 w-100"
                  disabled={!newProfileFile || uploading}
                  onClick={async () => {
                    if (!newProfileFile) return;
                    setUploading(true);
                    try {
                      const token = localStorage.getItem("token");
                      const formData = new FormData();
                      formData.append("file", newProfileFile);

                      const res = await fetch(`http://localhost:3001/api/users/${user.id}/profile-picture`, {
                        method: "PATCH",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      });

                      if (!res.ok) throw new Error("Error while uploading");

                      const updatedUser = await res.json();
                      dispatch({ type: "USER_LOADED", payload: updatedUser });
                      setShowProfileModal(false);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setUploading(false);
                    }
                  }}
                >
                  {uploading ? "Uploading..." : "Update"}
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
