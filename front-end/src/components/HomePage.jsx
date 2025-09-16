import React, { useEffect, useState } from "react";
import { Card, Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, toggleLikeArticle, fetchComments, addComment, deleteComment } from "../redux/actions/articleActions";
import "../css/HomePage.css";

const HomeMain = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token"); // prendo il token JWT se l’utente è loggato

  // ===== Stato Redux =====
  // articles = lista articoli dallo store
  // loading = flag per indicare caricamento
  const { articles, loading } = useSelector((state) => state.articles);

  // ===== Stato locale =====
  const [currentPage, setCurrentPage] = useState(1); // gestione paginazione
  const [modalOpen, setModalOpen] = useState(false); // apertura/chiusura modal commenti
  const [activeArticle, setActiveArticle] = useState(null); // articolo attualmente selezionato per i commenti
  const [commentInput, setCommentInput] = useState(""); // input del nuovo commento

  // ===== Toast notifiche =====
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Config paginazione
  const itemsPerPage = 5; // quanti articoli per pagina
  const fallbackImage = "../assets/notFoundImg.jpg"; // immagine di fallback

  // ===== Caricamento articoli =====
  useEffect(() => {
    // appena monto il componente, chiamo l’action Redux per recuperare gli articoli
    dispatch(fetchArticles(token));
  }, [dispatch, token]);

  // ===== Apertura modal commenti =====
  const openCommentsModal = async (article) => {
    setCommentInput(""); // reset input
    if (token) {
      // se loggato → recupero i commenti dal backend
      const comments = await dispatch(fetchComments(article.id, token));
      setActiveArticle({
        ...article,
        comments: comments || [],
        commentsCount: comments?.length || 0,
      });
    } else {
      // se non loggato → apro comunque ma senza fetchare
      setActiveArticle(article);
    }
    setModalOpen(true);
  };

  // ===== Aggiunta commento =====
  const submitComment = async () => {
    if (!commentInput.trim() || !activeArticle) return;
    const newComment = await dispatch(addComment(activeArticle.id, commentInput, token));

    // aggiorno lo stato locale dell’articolo con il nuovo commento
    setActiveArticle((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), { ...newComment, canDelete: true }],
      commentsCount: (prev.commentsCount || 0) + 1,
    }));

    setCommentInput(""); // reset textarea
    showToast("Commento aggiunto!", "success");
  };

  // ===== Eliminazione commento =====
  const handleDeleteComment = async (commentId) => {
    if (!activeArticle) return;
    await dispatch(deleteComment(activeArticle.id, commentId, token));

    // aggiorno lo stato locale togliendo il commento eliminato
    setActiveArticle((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== commentId),
      commentsCount: (prev.commentsCount || 1) - 1,
    }));

    showToast("Commento eliminato!", "warning");
  };

  // ===== Like / Unlike articoli =====
  const handleToggleLike = (article) => {
    dispatch(toggleLikeArticle(article, token, false));
    showToast(article.userHasLiked ? "Like rimosso" : "Articolo apprezzato!", "success");
  };

  // ===== Paginazione articoli =====
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  // ===== Loader articoli =====
  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <h4 className="text-white">Loading articles...</h4>
      </div>
    );

  // ===== RENDER PRINCIPALE =====
  return (
    <div className="d-flex justify-content-center my-4">
      {/* colonna sinistra vuota per layout */}
      <div className="col-1 d-none d-lg-block"></div>

      {/* colonna centrale con gli articoli */}
      <div className="col-12 col-lg-8 central-column p-4">
        <h2 className="text-center mb-4 text-white">Latest News from Space</h2>
        <Container>
          {/* lista articoli */}
          {currentArticles.map((article) => (
            <Card
              key={article.id}
              className="mb-4 shadow-sm fixed-card"
              onClick={(e) => {
                // se clicco fuori dai bottoni → apro l’articolo originale
                if (e.target.closest("button")) return;
                window.open(article.url, "_blank");
              }}
            >
              <div className="row g-0 h-100 card-row">
                {/* immagine articolo */}
                <div className="col-12 col-md-4">
                  <Card.Img
                    src={article.imageUrl || fallbackImage}
                    alt={article.title}
                    className="fixed-image"
                    onError={(e) => {
                      // se immagine non disponibile → metto fallback
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>

                {/* contenuto articolo */}
                <div className="col-12 col-md-8">
                  <Card.Body className="d-flex flex-column h-100">
                    {/* titolo con ellissi */}
                    <Card.Title className="card-title text-truncate" title={article.title}>
                      {article.title}
                    </Card.Title>

                    {/* data pubblicazione */}
                    <Card.Text className="date-text">{new Date(article.publishedAt).toLocaleDateString()}</Card.Text>

                    {/* sommario (troncato a 150 caratteri) */}
                    <Card.Text className="summary-text">{article.summary?.slice(0, 150)}...</Card.Text>

                    {/* se loggato → pulsanti like e commenti */}
                    {token && (
                      <div className="d-flex align-items-center justify-content-end">
                        <Button
                          variant={article.userHasLiked ? "danger" : "outline-dark"}
                          onClick={(e) => {
                            e.stopPropagation(); // blocco apertura link
                            handleToggleLike(article);
                          }}
                          className="me-2"
                        >
                          <BiLike /> {article.likesCount || 0}
                        </Button>
                        <Button
                          variant="outline-warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCommentsModal(article);
                          }}
                        >
                          <FaRegCommentDots /> {article.commentsCount || 0}
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </div>
              </div>
            </Card>
          ))}

          {/* ===== MODAL COMMENTI ===== */}
          <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered contentClassName="bg-dark text-light shadow-lg rounded-4">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold text-warning">Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {activeArticle && (
                <>
                  {/* textarea per scrivere un nuovo commento */}
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-light text-dark border-0 rounded-3 mb-2"
                  />

                  {/* bottone aggiungi commento */}
                  <Button className="w-100 fw-bold rounded-3 shadow-sm mb-3" variant="warning" onClick={submitComment}>
                    Add Comment
                  </Button>

                  {/* lista commenti */}
                  {activeArticle.comments && activeArticle.comments.length > 0 ? (
                    <div className="comments-list">
                      {activeArticle.comments.map((c) => (
                        <div key={c.id} className="border-bottom pb-2 mb-2 d-flex justify-content-between">
                          <span>
                            <strong className="text-warning">{c.authorUsername}</strong>: {c.content}
                          </span>
                          {/* se commento è cancellabile → mostra bottone delete */}
                          {c.canDelete && (
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(c.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-light mt-3">No comments yet.</p>
                  )}
                </>
              )}
            </Modal.Body>
          </Modal>

          {/* ===== PAGINAZIONE ===== */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            <Button variant="dark" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </Button>

            {/* creo un bottone per ogni pagina */}
            {[...Array(totalPages)].map((_, idx) => (
              <Button key={idx + 1} variant={currentPage === idx + 1 ? "warning" : "dark"} onClick={() => setCurrentPage(idx + 1)}>
                {idx + 1}
              </Button>
            ))}

            <Button variant="dark" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </Container>
      </div>

      {/* colonna destra vuota per layout */}
      <div className="col-1 d-none d-lg-block"></div>

      {/* ===== TOAST NOTIFICHE ===== */}
      {toast.show && (
        <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
          <div className={`toast show text-white ${toast.type === "success" ? "bg-success" : toast.type === "warning" ? "bg-warning" : "bg-danger"}`}>
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeMain;
