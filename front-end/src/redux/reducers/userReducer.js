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

    case "USER_DELETED":
      // Rimuovo l'utente dallo stato filtrando per id
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };

    case "USER_UPDATED":
      // Aggiorno un utente sostituendolo con i nuovi dati
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };

    case "USERS_ERROR":
      // Salvo l'errore e fermo il loading
      return { ...state, loading: false, error: action.payload };

    default:
      // Nessuna azione corrisponde: ritorno lo stato invariato
      return state;
  }
};
