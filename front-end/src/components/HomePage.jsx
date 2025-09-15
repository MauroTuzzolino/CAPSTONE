import React, { useEffect, useState } from "react";
import { Card, Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, toggleLikeArticle, fetchComments, addComment, deleteComment } from "../redux/actions/articleActions";
import "../css/HomePage.css";

const HomeMain = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // ===== Stato Redux =====
  const { articles, loading } = useSelector((state) => state.articles);

  // ===== Stato locale =====
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  // Toast notifiche
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const itemsPerPage = 5;
  const fallbackImage = "../assets/notFoundImg.jpg";

  // ===== Carica articoli =====
  useEffect(() => {
    dispatch(fetchArticles(token));
  }, [dispatch, token]);

  // ===== Modal commenti =====
  const openCommentsModal = async (article) => {
    setActiveArticle(article);
    setCommentInput("");
    setModalOpen(true);

    if (token) {
      await dispatch(fetchComments(article.id, token));
    }
  };

  const submitComment = async () => {
    if (!commentInput.trim() || !activeArticle) return;
    await dispatch(addComment(activeArticle.id, commentInput, token));
    setCommentInput("");
    showToast("Commento aggiunto!", "success");
  };

  const handleDeleteComment = async (commentId) => {
    if (!activeArticle) return;
    await dispatch(deleteComment(activeArticle.id, commentId, token));
    showToast("Commento eliminato!", "warning");
  };

  const handleToggleLike = (article) => {
    dispatch(toggleLikeArticle(article, token));
    showToast(article.userHasLiked ? "Like rimosso" : "Articolo apprezzato!", "success");
  };

  // ===== Paginazione =====
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <h4 className="text-white">Loading articles...</h4>
      </div>
    );

  return (
    <div className="d-flex justify-content-center my-4">
      <div className="col-1 d-none d-lg-block"></div>

      <div className="col-12 col-lg-8 central-column p-4">
        <h2 className="text-center mb-4 text-white">Latest News from Space</h2>
        <Container>
          {currentArticles.map((article) => (
            <Card
              key={article.id}
              className="mb-4 shadow-sm fixed-card"
              onClick={(e) => {
                if (e.target.closest("button")) return;
                window.open(article.url, "_blank");
              }}
            >
              <div className="row g-0 h-100 card-row">
                <div className="col-12 col-md-4">
                  <Card.Img
                    src={article.imageUrl || fallbackImage}
                    alt={article.title}
                    className="fixed-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>
                <div className="col-12 col-md-8">
                  <Card.Body className="d-flex flex-column h-100">
                    <Card.Title className="card-title text-truncate" title={article.title}>
                      {article.title}
                    </Card.Title>
                    <Card.Text className="date-text">{new Date(article.publishedAt).toLocaleDateString()}</Card.Text>
                    <Card.Text className="summary-text">{article.summary?.slice(0, 150)}...</Card.Text>

                    {token && (
                      <div className="d-flex align-items-center justify-content-end">
                        <Button
                          variant={article.userHasLiked ? "danger" : "outline-dark"}
                          onClick={(e) => {
                            e.stopPropagation();
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

          {/* Modal commenti */}
          <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered contentClassName="bg-dark text-light shadow-lg rounded-4">
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold text-warning">Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {activeArticle && (
                <>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-light text-dark border-0 rounded-3 mb-2"
                  />
                  <Button className="w-100 fw-bold rounded-3 shadow-sm mb-3" variant="warning" onClick={submitComment}>
                    Add Comment
                  </Button>

                  {activeArticle.comments && activeArticle.comments.length > 0 ? (
                    <div className="comments-list">
                      {activeArticle.comments.map((c) => (
                        <div key={c.id} className="border-bottom pb-2 mb-2 d-flex justify-content-between">
                          <span>
                            <strong className="text-warning">{c.authorUsername}</strong>: {c.content}
                          </span>
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

          {/* Paginazione */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            <Button variant="dark" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </Button>
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

      <div className="col-1 d-none d-lg-block"></div>

      {/* Toast notifiche */}
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
