import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Container, Form, Modal } from "react-bootstrap";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import "../css/HomePage.css";

const HomeMain = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let url;
        let options = {};

        if (token) {
          // API privata con autenticazione
          url = "http://localhost:3001/api/articles?limit=20&offset=0";
          options = { headers: { Authorization: `Bearer ${token}` } };
        } else {
          // API pubblica Spaceflight
          url = "https://api.spaceflightnewsapi.net/v4/articles?limit=20";
        }

        const res = await fetch(url, options);
        const data = await res.json();

        if (token) {
          setArticles(data.content || []);
        } else {
          setArticles(
            data.results.map((a) => ({
              id: a.id,
              title: a.title,
              url: a.url,
              imageUrl: a.image_url,
              publishedAt: a.published_at,
              summary: a.summary,
            }))
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento degli articoli:", err);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [token]);

  // Toggle like
  const toggleLike = async (article) => {
    if (!token) return;
    const url = `http://localhost:3001/api/articles/${article.id}/like`;
    try {
      const res = await fetch(url, {
        method: article.userHasLiked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore like/unlike");

      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id
            ? {
                ...a,
                userHasLiked: !a.userHasLiked,
                likesCount: a.userHasLiked ? a.likesCount - 1 : a.likesCount + 1,
              }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Apri modal commenti
  const openCommentsModal = async (article) => {
    // inizializza l'articolo attivo e svuota l'input
    setActiveArticle({ ...article, comments: [] });
    setCommentInput("");
    setModalOpen(true);

    // recupera i commenti dal backend
    if (token) {
      try {
        const res = await fetch(`http://localhost:3001/api/articles/${article.id}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // aggiorna activeArticle con i commenti presi dal backend
        setActiveArticle((prev) => ({ ...prev, comments: data }));
      } catch (err) {
        console.error("Errore nel caricamento dei commenti:", err);
      }
    }
  };

  // Invia commento
  const submitComment = async () => {
    if (!commentInput.trim()) return;

    const url = `http://localhost:3001/api/articles/${activeArticle.id}/comments`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: commentInput }),
      });

      if (!res.ok) throw new Error("Errore aggiunta commento");

      const newComment = await res.json();

      // aggiorna activeArticle aggiungendo il nuovo commento in coda
      setActiveArticle((prev) => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])], // aggiunge in cima
        commentsCount: (prev.commentsCount || 0) + 1,
      }));

      // svuota input
      setCommentInput("");

      // opzionale: aggiorna anche l'articolo nello stato generale per il conteggio dei commenti
      setArticles((prev) => prev.map((a) => (a.id === activeArticle.id ? { ...a, commentsCount: (a.commentsCount || 0) + 1 } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  // Paginazione
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="d-flex justify-content-center my-4">
      <div className="col-1 d-none d-lg-block"></div>

      <div className="col-12 col-lg-8 central-column p-4">
        <h2 className="text-center mb-4 text-white">Ultime Notizie Spaziali</h2>
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
                  <Card.Img src={article.imageUrl} alt={article.title} className="fixed-image" />
                </div>
                <div className="col-12 col-md-8">
                  <Card.Body className="d-flex flex-column h-100">
                    <Card.Title className="text-truncate" title={article.title}>
                      {article.title}
                    </Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className="summary-text">{article.summary?.slice(0, 150)}...</Card.Text>

                    {/* Stats e azioni solo se loggato */}
                    {token && (
                      <div className="d-flex justify-content-between">
                        <Button
                          variant={article.userHasLiked ? "danger" : "outline-primary"}
                          onClick={(e) => {
                            e.stopPropagation;
                            toggleLike(article);
                          }}
                        >
                          <BiLike /> {article.likesCount || 0}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation;
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

          {/*Modale*/}
          <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Commenti</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {activeArticle && (
                <>
                  <p>Totale commenti: {activeArticle.commentsCount || 0}</p>

                  {/* Form per nuovo commento */}
                  <Form.Control type="text" placeholder="Scrivi un commento..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
                  <Button className="mt-2 mb-3" onClick={submitComment}>
                    Invia
                  </Button>

                  {/* Lista commenti */}
                  {activeArticle.comments && activeArticle.comments.length > 0 ? (
                    <div className="comments-list">
                      {activeArticle.comments.map((c) => (
                        <div key={c.id} className="mb-2 p-2 border rounded">
                          <strong>{c.authorUsername}</strong>: {c.content}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">Nessun commento presente</p>
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
    </div>
  );
};

export default HomeMain;
