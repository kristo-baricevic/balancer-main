import { applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { legacy_createStore as createStore } from "redux";

const configureTestStore = (preloadedState = {}) => {
  const middleware = [thunk];
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
};

export default configureTestStore;
