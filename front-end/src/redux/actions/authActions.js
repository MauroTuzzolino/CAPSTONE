// ------------------------ LOGIN ------------------------
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Errore durante il login");
    }

    const data = await res.json();
    const token = data.token;

    localStorage.setItem("token", token);

    // Carica i dati completi dell'utente
    const userRes = await fetch("http://localhost:3001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error("Errore nel caricamento utente");

    const userData = await userRes.json();

    dispatch({
      type: "USER_LOADED",
      payload: userData, // ora contiene nome, cognome, avatar, ecc.
    });
  } catch (err) {
    console.error(err);
    dispatch({ type: "LOGIN_FAIL", payload: err.message });
    throw err;
  }
};

// ------------------------ REGISTER ------------------------
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_REQUEST" });

    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (res.status === 409) throw new Error("Email già registrata");
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Errore durante la registrazione");
    }

    dispatch({ type: "REGISTER_SUCCESS" });
  } catch (err) {
    console.error(err);
    dispatch({ type: "REGISTER_FAIL", payload: err.message });
    throw err;
  }
};

// ------------------------ LOAD USER ------------------------
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return dispatch({ type: "AUTH_ERROR" });

  try {
    dispatch({ type: "USER_LOADING" });
    const res = await fetch("http://localhost:3001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token non valido o scaduto");
    const data = await res.json();

    dispatch({ type: "USER_LOADED", payload: data });
  } catch (err) {
    localStorage.removeItem("token");
    dispatch({ type: "AUTH_ERROR" });
  }
};

// ------------------------ LOGOUT ------------------------
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: "LOGOUT" });
};

// ------------------------ FORGOT PASSWORD ------------------------
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "FORGOT_PASSWORD_REQUEST" });

    const res = await fetch(`http://localhost:3001/api/auth/forgot-password?email=${encodeURIComponent(email)}&appUrl=http://localhost:5173`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Errore durante la richiesta");

    dispatch({
      type: "FORGOT_PASSWORD_SUCCESS",
      payload: "Se l'email è registrata, riceverai un link per il reset della password.",
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: "FORGOT_PASSWORD_FAIL",
      payload: "Qualcosa è andato storto. Riprova più tardi.",
    });
  }
};
