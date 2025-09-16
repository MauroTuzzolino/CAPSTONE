// ------------------------ FETCH ARTICLES ------------------------
/**
 * Recupera articoli dal backend se autenticato,
 * altrimenti da API pubblica esterna (spaceflightnewsapi).
 */
export const fetchArticles = (token) => async (dispatch) => {
  try {
    // Stato di caricamento
    dispatch({ type: "ARTICLES_LOADING" });

    // Se autenticato → backend, altrimenti API esterna
    const url = token ? "http://localhost:3001/api/articles?page=0&size=20" : "https://api.spaceflightnewsapi.net/v4/articles?limit=20";

    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Chiamata API
    const res = await fetch(url, options);
    const data = await res.json();

    // Normalizzazione articoli
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

    // Dispatch su Redux
    dispatch({ type: "ARTICLES_LOADED", payload: articles });
  } catch (err) {
    console.error(err);
    dispatch({
      type: "ARTICLES_ERROR",
      payload: "Error loading articles",
    });
  }
};

// ------------------------ FETCH LIKED ARTICLES ------------------------
/**
 * Recupera la lista di articoli "piaciuti" dall'utente loggato.
 */
export const fetchLikedArticles = (token) => async (dispatch) => {
  if (!token) return [];

  dispatch({ type: "ARTICLES_LOADING" });

  try {
    const res = await fetch("http://localhost:3001/api/users/me/liked-articles", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error loading liked articles");

    const data = await res.json(); // array di articoli

    dispatch({ type: "ARTICLES_LOADED", payload: data });

    return data; // utile se vogliamo usarlo subito in un useEffect
  } catch (err) {
    console.error(err);
    dispatch({ type: "ARTICLES_ERROR", payload: err.message });
    return [];
  }
};

// ------------------------ TOGGLE LIKE ------------------------
/**
 * Aggiunge o rimuove un "like" da un articolo.
 * Se removeFromList = true → lo elimina dalla lista locale dei liked.
 */
export const toggleLikeArticle =
  (article, token, removeFromList = false) =>
  async (dispatch) => {
    if (!token) return;

    const url = `http://localhost:3001/api/articles/${article.id}/like`;

    try {
      // POST → like, DELETE → unlike
      await fetch(url, {
        method: article.userHasLiked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Aggiornamento Redux
      dispatch({
        type: "ARTICLE_TOGGLE_LIKE",
        payload: { articleId: article.id, removeFromList },
      });
    } catch (err) {
      console.error(err);
    }
  };

// ------------------------ COMMENTS ------------------------
/**
 * Recupera tutti i commenti di un articolo.
 */
export const fetchComments = (articleId, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    dispatch({
      type: "COMMENTS_LOADED",
      payload: { articleId, comments: data },
    });

    return data; // utile per usarlo direttamente
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * Aggiunge un nuovo commento a un articolo.
 */
export const addComment = (articleId, content, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) throw new Error("Error adding comment");

    const newComment = await res.json();

    // Aggiornamento Redux
    dispatch({
      type: "COMMENT_ADDED",
      payload: { articleId, comment: newComment },
    });

    return newComment;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Elimina un commento da un articolo.
 */
export const deleteComment = (articleId, commentId, token) => async (dispatch) => {
  try {
    await fetch(`http://localhost:3001/api/articles/${articleId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Aggiornamento Redux
    dispatch({
      type: "COMMENT_DELETED",
      payload: { articleId, commentId },
    });
  } catch (err) {
    console.error(err);
  }
};
