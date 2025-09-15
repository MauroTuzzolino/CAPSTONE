const initialState = {
  isAuthenticated: false,
  user: null,
  userLoaded: false,
  loading: false,
  error: null,
  forgotPasswordMessage: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOADING":
      return { ...state, loading: true, userLoaded: false };

    case "USER_LOADED":
      return { ...state, isAuthenticated: true, user: action.payload, userLoaded: true, loading: false, error: null };

    case "AUTH_ERROR":
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, userLoaded: true, loading: false };

    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };

    case "LOGIN_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FORGOT_PASSWORD_REQUEST":
      return { ...state, loading: true, error: null, forgotPasswordMessage: null };

    case "FORGOT_PASSWORD_SUCCESS":
      return { ...state, loading: false, forgotPasswordMessage: action.payload };

    case "FORGOT_PASSWORD_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
