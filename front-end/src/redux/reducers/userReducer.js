// Stato iniziale per la gestione degli utenti
const initialState = {
  users: [], // Lista di utenti, inizialmente vuota
  loading: false, // Stato di caricamento generale
  error: null, // Eventuali errori
};

// Reducer per gestire fetch, aggiornamento e cancellazione utenti
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USERS_LOADING":
      // Sto caricando la lista degli utenti, azzero eventuali errori
      return { ...state, loading: true, error: null };

    case "USERS_LOADED":
      // Lista utenti caricata correttamente, salvo i dati e resetto error
      return { ...state, loading: false, users: action.payload, error: null };

    case "USER_UPDATE_REQUEST":
      // Inizio processo di aggiornamento, setto loading
      return { ...state, loading: true, error: null };

    case "USER_UPDATED":
      // Aggiornamento avvenuto con successo → aggiorno solo l’utente modificato
      return {
        ...state,
        loading: false,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
        error: null,
      };

    case "USER_UPDATE_FAIL":
      // Fallimento aggiornamento utente
      return { ...state, loading: false, error: action.payload };

    case "USER_DELETE_REQUEST":
      // Inizio processo di eliminazione, setto loading
      return { ...state, loading: true, error: null };

    case "USER_DELETED":
      // Rimuovo l'utente dallo stato filtrando per id
      return {
        ...state,
        loading: false,
        users: state.users.filter((u) => u.id !== action.payload),
        error: null,
      };

    case "USER_DELETE_FAIL":
      // Fallimento cancellazione utente
      return { ...state, loading: false, error: action.payload };

    case "USERS_ERROR":
      // Salvo l'errore e fermo il loading
      return { ...state, loading: false, error: action.payload };

    default:
      // Nessuna azione corrisponde: ritorno lo stato invariato
      return state;
  }
};
