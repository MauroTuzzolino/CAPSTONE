// ------------------------ LOGIN ------------------------
/**
 * Effettua il login dell'utente e salva il token in localStorage.
 * Poi carica i dati completi dell'utente.
 */
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    // Chiamata API login
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Error during login");
    }

    const data = await res.json();
    const token = data.token;

    // Salva il token
    localStorage.setItem("token", token);

    // Carica dati utente
    const userRes = await fetch("http://localhost:3001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error("Error loading user");

    const userData = await userRes.json();

    // Aggiorna lo stato Redux
    dispatch({
      type: "USER_LOADED",
      payload: userData,
    });
  } catch (err) {
    console.error(err);
    dispatch({ type: "LOGIN_FAIL", payload: err.message });
    throw err; // utile per gestire toast o errori lato UI
  }
};

// ------------------------ REGISTER ------------------------
/**
 * Registra un nuovo utente.
 */
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_REQUEST" });

    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (res.status === 409) throw new Error("Email already registered");
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Error during registration");
    }

    dispatch({ type: "REGISTER_SUCCESS" });
  } catch (err) {
    console.error(err);
    dispatch({ type: "REGISTER_FAIL", payload: err.message });
    throw err;
  }
};

// ------------------------ LOAD USER ------------------------
/**
 * Carica l'utente corrente usando il token salvato in localStorage.
 */
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return dispatch({ type: "AUTH_ERROR" });

  try {
    dispatch({ type: "USER_LOADING" });

    const res = await fetch("http://localhost:3001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Invalid or expired token");

    const data = await res.json();
    dispatch({ type: "USER_LOADED", payload: data });
  } catch (err) {
    localStorage.removeItem("token");
    dispatch({ type: "AUTH_ERROR" });
  }
};

// ------------------------ LOGOUT ------------------------
/**
 * Effettua il logout rimuovendo il token e resettando lo stato Redux.
 */
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: "LOGOUT" });
};

// ------------------------ FORGOT PASSWORD ------------------------
/**
 * Richiede l'invio del link per il reset della password all'email dell'utente.
 */
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "FORGOT_PASSWORD_REQUEST" });

    const res = await fetch(`http://localhost:3001/api/auth/forgot-password?email=${encodeURIComponent(email)}&appUrl=http://localhost:5173`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Errore durante la richiesta");

    dispatch({
      type: "FORGOT_PASSWORD_SUCCESS",
      payload: "If your email address is registered, you will receive a link to reset your password.",
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: "FORGOT_PASSWORD_FAIL",
      payload: "Something went wrong. Try again later.",
    });
  }
};
