import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Container, Form } from "react-bootstrap";
import "../css/HomePage.css";

const HomeMain = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentInputs, setCommentInputs] = useState({});
  const token = localStorage.getItem("token");

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
          setArticles(data);
        } else {
          setArticles(
            data.results.map((a) => ({
              id: a.id,
              title: a.title,
              url: a.url,
              imageUrl: a.image_url,
              publishedAt: a.published_at,
              summary: a.summary,
              likesCount: 0,
              commentsCount: 0,
              userHasLiked: false,
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
  const toggleLike = (id, userHasLiked) => {
    if (!token) return;

    const url = `http://localhost:8080/api/articles/${id}/like`;
    fetch(url, {
      method: userHasLiked ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore like/unlike");
        return fetch("http://localhost:8080/api/articles?limit=20&offset=0", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err));
  };

  // Aggiungi commento
  const addComment = (id) => {
    if (!token) return;

    const content = commentInputs[id];
    if (!content || content.trim() === "") return;

    fetch(`http://localhost:8080/api/articles/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiunta commento");
        return fetch("http://localhost:8080/api/articles?limit=20&offset=0", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setCommentInputs({ ...commentInputs, [id]: "" });
      })
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="light" />
        <p className="text-white">Caricamento articoli...</p>
      </div>
    );
  }

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
            <Card key={article.id} className="mb-4 shadow-sm fixed-card" onClick={() => window.open(article.url, "_blank")}>
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

                    {/* Stats */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span>👍 {article.likesCount}</span>
                      <span>💬 {article.commentsCount}</span>
                    </div>

                    {/* Pulsanti se loggato */}
                    {token && (
                      <>
                        <Button
                          size="sm"
                          variant={article.userHasLiked ? "danger" : "outline-primary"}
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(article.id, article.userHasLiked);
                          }}
                        >
                          {article.userHasLiked ? "Unlike" : "Like"}
                        </Button>

                        <Form className="mt-2" onClick={(e) => e.stopPropagation()}>
                          <Form.Control
                            type="text"
                            placeholder="Scrivi un commento..."
                            value={commentInputs[article.id] || ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [article.id]: e.target.value,
                              })
                            }
                          />
                          <Button size="sm" className="mt-2" variant="success" onClick={() => addComment(article.id)}>
                            Invia
                          </Button>
                        </Form>
                      </>
                    )}
                  </Card.Body>
                </div>
              </div>
            </Card>
          ))}

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
