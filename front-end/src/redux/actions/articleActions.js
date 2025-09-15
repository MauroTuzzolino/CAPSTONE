// ------------------------ FETCH ARTICLES ------------------------
export const fetchArticles = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ARTICLES_LOADING" });

    const url = token ? "http://localhost:3001/api/articles?page=0&size=20" : "https://api.spaceflightnewsapi.net/v4/articles?limit=20";
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const res = await fetch(url, options);
    const data = await res.json();

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

    dispatch({ type: "ARTICLES_LOADED", payload: articles });
  } catch (err) {
    console.error(err);
    dispatch({ type: "ARTICLES_ERROR", payload: "Errore nel caricamento degli articoli" });
  }
};

// ------------------------ FETCH LIKED ARTICLES ------------------------
export const fetchLikedArticles = (token) => async (dispatch) => {
  if (!token) return [];
  dispatch({ type: "ARTICLES_LOADING" });

  try {
    const res = await fetch("http://localhost:3001/api/users/me/liked-articles", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Errore nel caricamento degli articoli liked");

    const data = await res.json(); // array di articoli

    dispatch({ type: "ARTICLES_LOADED", payload: data });

    return data; // <-- così puoi usarlo nel useEffect
  } catch (err) {
    console.error(err);
    dispatch({ type: "ARTICLES_ERROR", payload: err.message });
    return [];
  }
};

// ------------------------ TOGGLE LIKE ------------------------
export const toggleLikeArticle = (article, token) => async (dispatch) => {
  if (!token) return;
  const url = `http://localhost:3001/api/articles/${article.id}/like`;

  try {
    await fetch(url, {
      method: article.userHasLiked ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: "ARTICLE_TOGGLE_LIKE", payload: article.id });
  } catch (err) {
    console.error(err);
  }
};

// ------------------------ COMMENTS ------------------------
export const fetchComments = (articleId, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    dispatch({ type: "COMMENTS_LOADED", payload: { articleId, comments: data } });

    return data; // <-- così puoi usarlo subito
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addComment = (articleId, content, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Errore nell'aggiunta del commento");

    const newComment = await res.json();
    dispatch({ type: "COMMENT_ADDED", payload: { articleId, comment: newComment } });
    return newComment;
  } catch (err) {
    console.error(err);
  }
};

export const deleteComment = (articleId, commentId, token) => async (dispatch) => {
  try {
    await fetch(`http://localhost:3001/api/articles/${articleId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "COMMENT_DELETED", payload: { articleId, commentId } });
  } catch (err) {
    console.error(err);
  }
};
