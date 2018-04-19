
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';
import mySaga from '../sagas';
import rootEpic from '../epics';

export default function configureStore() {
  const config = {
    key: 'root',
    storage,
    blacklist: ['other']
  };
  const reducer = persistCombineReducers(config, reducers);
  const sagaMiddleware = createSagaMiddleware();
  const epicMiddleware = createEpicMiddleware(rootEpic);
  const middlewares = [ReduxThunk, sagaMiddleware, epicMiddleware];

  const store = createStore(reducer, {}, applyMiddleware(...middlewares));
  const persistor = persistStore(store);
  sagaMiddleware.run(mySaga);
  return { store, persistor };
}
