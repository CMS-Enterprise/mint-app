import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';

import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  session: sessionReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
