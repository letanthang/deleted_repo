
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';
import mySaga from './sagas';

export default function configureStore() {
  const config = {
    key: 'root',
    storage,
    blacklist: ['other']
  };
  const reducer = persistCombineReducers(config, reducers);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [ReduxThunk, sagaMiddleware];

  const store = createStore(reducer, {}, applyMiddleware(...middlewares));
  const persistor = persistStore(store);
  sagaMiddleware.run(mySaga);
  return { store, persistor };
}
