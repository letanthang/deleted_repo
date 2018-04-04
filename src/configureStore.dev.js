
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ReduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
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
  //devTool options
  const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });
  const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middlewares),
    // other store enhancers if any
  ));
  const persistor = persistStore(store);
  // persistor.purge();
  sagaMiddleware.run(mySaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    const acceptCallback = () => {
      //const nextRootReducer = require('./reducers/index').default;
      const nextRootReducer = require('./reducers/index').default; 
      store.replaceReducer(nextRootReducer);
    };
    module.hot.accept(acceptCallback);
  }
  //remote
  // const store = createStore(reducers, /* preloadedState, */ composeWithDevTools(
  //   applyMiddleware(ReduxThunk),
  //   // other store enhancers if any
  // ));

  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
  //   applyMiddleware(ReduxThunk)
  // ));

  // const composeEnhancers =
  //   typeof window === 'object' &&
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
  //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  //       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  //     }) : compose;

  // const enhancer = composeEnhancers(
  //   applyMiddleware(ReduxThunk),
  //   // other store enhancers if any
  // );

  // const store = createStore(reducers, enhancer);

  //const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
  return { store, persistor };
}
