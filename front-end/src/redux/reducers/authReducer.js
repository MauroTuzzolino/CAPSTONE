// Stato iniziale per la gestione dell'autenticazione
const initialState = {
  isAuthenticated: false, // All'inizio non sono autenticato
  user: null, // Nessun utente loggato
  userLoaded: false, // Indica se ho già caricato i dati utente
  loading: false, // Stato di caricamento generale
  error: null, // Eventuali errori da mostrare
  forgotPasswordMessage: null, // Messaggio per reset password
};

// Reducer per gestire login, logout, caricamento utente e forgot password
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOADING":
      // Sto caricando i dati dell'utente
      return { ...state, loading: true, userLoaded: false };

    case "USER_LOADED":
      // Utente caricato correttamente: setto isAuthenticated true e salvo user
      return { ...state, isAuthenticated: true, user: action.payload, userLoaded: true, loading: false, error: null };

    case "AUTH_ERROR":
    case "LOGOUT":
      // Errore di autenticazione o logout: resetto user e autenticazione
      return { ...state, isAuthenticated: false, user: null, userLoaded: true, loading: false };

    case "LOGIN_REQUEST":
      // Sto facendo login, azzero eventuali errori
      return { ...state, loading: true, error: null };

    case "LOGIN_FAIL":
      // Login fallito, salvo l'errore e fermo il loading
      return { ...state, loading: false, error: action.payload };

    case "FORGOT_PASSWORD_REQUEST":
      // Richiesta di reset password in corso, azzero errori e messaggi precedenti
      return { ...state, loading: true, error: null, forgotPasswordMessage: null };

    case "FORGOT_PASSWORD_SUCCESS":
      // Reset password riuscito, salvo il messaggio di successo
      return { ...state, loading: false, forgotPasswordMessage: action.payload };

    case "FORGOT_PASSWORD_FAIL":
      // Reset password fallito, salvo l'errore
      return { ...state, loading: false, error: action.payload };

    default:
      // Nessuna azione corrisponde: ritorno lo stato invariato
      return state;
  }
};
