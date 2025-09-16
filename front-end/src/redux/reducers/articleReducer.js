// ------------------------ FETCH ARTICLES ------------------------
export const fetchArticles = (token) => async (dispatch) => {
  try {
    dispatch({ type: "ARTICLES_LOADING" });

    let url, options;
    if (token) {
      url = "http://localhost:3001/api/articles?limit=20&offset=0";
      options = { headers: { Authorization: `Bearer ${token}` } };
    } else {
      url = "https://api.spaceflightnewsapi.net/v4/articles?limit=20";
      options = {};
    }

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
  } catch (err) {
    console.error(err);
  }
};

export const addComment = (articleId, content, token) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:3001/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    const newComment = await res.json();
    dispatch({ type: "COMMENT_ADDED", payload: { articleId, comment: newComment } });
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

// ------------------------ REDUCER ------------------------
const initialState = {
  articles: [],
  loading: false,
  error: null,
};

export const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ARTICLES_LOADING":
      return { ...state, loading: true, error: null };
    case "ARTICLES_LOADED":
      return { ...state, loading: false, articles: action.payload };
    case "ARTICLES_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ARTICLE_TOGGLE_LIKE":
      return {
        ...state,
        articles: state.articles
          .map((a) =>
            a.id === action.payload.articleId
              ? {
                  ...a,
                  userHasLiked: !a.userHasLiked,
                  likesCount: a.userHasLiked ? a.likesCount - 1 : a.likesCount + 1,
                }
              : a
          )
          .filter((a) => !action.payload.removeFromList || a.userHasLiked),
      };
    case "COMMENTS_LOADED":
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === action.payload.articleId ? { ...a, comments: action.payload.comments } : a)),
      };
    case "COMMENT_ADDED": {
      const { articleId, comment } = action.payload;
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === articleId ? { ...a, commentsCount: (a.commentsCount || 0) + 1 } : a)),
      };
    }

    case "COMMENT_DELETED": {
      const { articleId, commentId } = action.payload;
      return {
        ...state,
        articles: state.articles.map((a) => (a.id === articleId ? { ...a, commentsCount: (a.commentsCount || 1) - 1 } : a)),
      };
    }

    default:
      return state;
  }
};
