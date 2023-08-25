import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { restoreCSRF, csrfFetch } from '../store/csrf';
import sessionReducer from './session';
import { groupReducer } from './groups'

//For testing purposes
import * as sessionActions from "../store/session";

const demoUser = {
  email: "eztest@user.io",
  password: "password1",
}

//Reducers

export const rootReducer = combineReducers({
  session: sessionReducer,
  group: groupReducer,
});

//Enhancer

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//Store

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
}

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}




export default configureStore;
