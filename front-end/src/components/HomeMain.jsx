import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Container } from "react-bootstrap";
import "../css/HomeMain.css";

const HomeMain = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento degli articoli:", err);
        setLoading(false);
      });
  }, []);

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
      {/* Colonna sinistra */}
      <div className="col-1 d-none d-lg-block"></div>

      {/* Colonna centrale con sfondo unico */}
      <div className="col-12 col-lg-8 central-column p-4">
        <h2 className="text-center mb-4 text-white">Ultime Notizie Spaziali</h2>
        <Container>
          {currentArticles.map((article) => (
            <Card key={article.id} className="mb-4 shadow-sm clickable fixed-card" onClick={() => window.open(article.url, "_blank")}>
              <div className="row g-0 h-100 card-row">
                {/* Immagine sempre visibile, cambia layout con media query */}
                <div className="col-12 col-md-4">
                  <Card.Img src={article.image_url} alt={article.title} className="fixed-image" />
                </div>
                <div className="col-12 col-md-8">
                  <Card.Body className="d-flex flex-column h-100">
                    <Card.Title className="text-truncate" title={article.title}>
                      {article.title}
                    </Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {new Date(article.published_at).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className="summary-text">{article.summary.slice(0, 150)}...</Card.Text>
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

      {/* Colonna destra */}
      <div className="col-1 d-none d-lg-block"></div>
    </div>
  );
};

export default HomeMain;
