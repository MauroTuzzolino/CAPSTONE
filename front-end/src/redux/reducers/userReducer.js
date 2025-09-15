const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USERS_LOADING":
      return { ...state, loading: true, error: null };
    case "USERS_LOADED":
      return { ...state, loading: false, users: action.payload, error: null };
    case "USER_DELETED":
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };
    case "USER_UPDATED":
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case "USERS_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
