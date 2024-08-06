import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sessionService } from 'redux-react-session';
import createSagaMiddleware from 'redux-saga';

import rootReducer from 'reducers/rootReducer';
import rootSaga from 'sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
  const middleware = [sagaMiddleware];

  switch (import.meta.env.NODE_ENV) {
    case 'development':
      return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(...middleware))
      );
    case 'test':
      return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(...middleware))
      );
    case 'production':
      return createStore(rootReducer, applyMiddleware(...middleware));
    default:
      return createStore(rootReducer, applyMiddleware(...middleware));
  }
}

const store = configureStore();

const validateSession = () => {
  return true;
};

const options = {
  refreshOnCheckAuth: true,
  redirectPath: '/signin',
  driver: 'LOCALSTORAGE',
  validateSession,
  expires: 500000
};

sessionService
  .initSessionService(store, options)
  .then(() =>
    // eslint-disable-next-line no-console
    console.log(
      'Redux React Session is ready and a session was refreshed from your storage'
    )
  )
  .catch(() =>
    // eslint-disable-next-line no-console
    console.log(
      'Redux React Session is ready and there is no session in your storage'
    )
  );

sagaMiddleware.run(rootSaga);

export default store;
