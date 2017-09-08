
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

export default function configureStore() {
  //devTool options
  const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });
  const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
    applyMiddleware(ReduxThunk),
    // other store enhancers if any
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    const acceptCallback = () => {
      //const nextRootReducer = require('./reducers/index').default;
      const nextRootReducer = combineReducers(require('./reducers/index')); 
      store.replaceReducer(nextRootReducer);
    };

    module.hot.accept('./reducers', acceptCallback);
    module.hot.acceptCallback = acceptCallback;
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
  return store;
};
