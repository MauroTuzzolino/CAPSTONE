// ------------------------ FETCH ARTICLES ------------------------
// Qui gestisco il fetch degli articoli. Se ho il token, prendo dal mio backend, altrimenti dal public API
export const fetchArticles = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ARTICLES_LOADING" }); // Segnalo che sto caricando gli articoli

    let url, options;
    if (token) {
      // Se sono loggato uso il mio backend e passo l'header Authorization
      url = "http://localhost:3001/api/articles?limit=20&offset=0";
      options = { headers: { Authorization: `Bearer ${token}` } };
    } else {
      // Altrimenti prendo dal public API
      url = "https://api.spaceflightnewsapi.net/v4/articles?limit=20";
      options = {};
    }

    const res = await fetch(url, options); // Faccio la chiamata
    const data = await res.json(); // Converto in JSON

    // Normalizzo i dati: se vengo dal mio backend uso content, altrimenti mappo i campi
    const articles = token
      ? data.content || []
      : data.results.map((a) => ({
          id: a.id,
          title: a.title,
          url: a.url,
          imageUrl: a.image_url,
          publishedAt: a.published_at,
          summary: a.summary,
        }));

    dispatch({ type: "ARTICLES_LOADED", payload: articles }); // Salvo gli articoli nello store
  } catch (err) {
    console.error(err);
    dispatch({ type: "ARTICLES_ERROR", payload: "Errore nel caricamento degli articoli" }); // Gestione errore
  }
};

// ------------------------ TOGGLE LIKE ------------------------
// Qui gestisco il like/unlike di un articolo
export const toggleLikeArticle = (article, token) => async (dispatch) => {
  if (!token) return; // Non faccio nulla se non sono loggato
  const url = `http://localhost:3001/api/articles/${article.id}/like`;

  try {
    // Se ho già messo like faccio DELETE, altrimenti POST
    await fetch(url, {
      method: article.userHasLiked ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: "ARTICLE_TOGGLE_LIKE", payload: article.id }); // Aggiorno lo store
  } catch (err) {
    console.error(err);
  }
};

// ------------------------ COMMENTS ------------------------
// Fetch dei commenti di un articolo
export const fetchComments = (articleId, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    dispatch({ type: "COMMENTS_LOADED", payload: { articleId, comments: data } }); // Salvo i commenti nello store
  } catch (err) {
    console.error(err);
  }
};

// Aggiungo un commento
export const addComment = (articleId, content, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    const newComment = await res.json();
    dispatch({ type: "COMMENT_ADDED", payload: { articleId, comment: newComment } }); // Incremento commentCount nello store
  } catch (err) {
    console.error(err);
  }
};

// Elimino un commento
export const deleteComment = (articleId, commentId, token) => async (dispatch) => {
  try {
    await fetch(`http://localhost:3001/api/articles/${articleId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "COMMENT_DELETED", payload: { articleId, commentId } }); // Decremento commentCount nello store
  } catch (err) {
    console.error(err);
  }
};

// ------------------------ REDUCER ------------------------
// Stato iniziale dello slice articoli
const initialState = {
  articles: [],
  loading: false,
  error: null,
};

// Qui gestisco tutte le azioni relative agli articoli
export const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ARTICLES_LOADING":
      return { ...state, loading: true, error: null }; // Setto loading true
    case "ARTICLES_LOADED":
      return { ...state, loading: false, articles: action.payload }; // Caricamento completato
    case "ARTICLES_ERROR":
      return { ...state, loading: false, error: action.payload }; // Salvo errore
    case "ARTICLE_TOGGLE_LIKE":
      return {
        ...state,
        articles: state.articles
          .map((a) =>
            a.id === action.payload.articleId
              ? {
                  ...a,
                  userHasLiked: !a.userHasLiked,
                  likesCount: a.userHasLiked ? a.likesCount - 1 : a.likesCount + 1, // Aggiorno il conteggio
                }
              : a
          )
          .filter((a) => !action.payload.removeFromList || a.userHasLiked), // Rimuovo articoli se richiesto
      };
    case "COMMENTS_LOADED":
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === action.payload.articleId ? { ...a, comments: action.payload.comments } : a)), // Inserisco i commenti
      };
    case "COMMENT_ADDED": {
      const { articleId, comment } = action.payload;
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === articleId ? { ...a, commentsCount: (a.commentsCount || 0) + 1 } : a)), // Incremento commentCount
      };
    }

    case "COMMENT_DELETED": {
      const { articleId, commentId } = action.payload;
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === articleId ? { ...a, commentsCount: (a.commentsCount || 1) - 1 } : a)), // Decremento commentCount
      };
    }

    default:
      return state;
  }
};
