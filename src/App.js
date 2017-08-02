import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import LoginScreen from './LoginScreen';
import Drawer from './Drawer';

const store = createStore(reducers, /* preloadedState, */ composeWithDevTools(
  applyMiddleware(ReduxThunk),
  // other store enhancers if any
));

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
class App extends Component {
  render() {
    const AppNavigator = StackNavigator({
      Login: { screen: LoginScreen },
      Drawer: { screen: Drawer }
    });
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

export default App;
