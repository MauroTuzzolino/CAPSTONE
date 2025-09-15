import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/authReducer";
import { userReducer } from "./reducers/userReducer";
import { articleReducer } from "./reducers/articleReducer";

// Uniamo tutti i reducer
const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  articles: articleReducer,
});

// Creiamo lo store con middleware thunk
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
