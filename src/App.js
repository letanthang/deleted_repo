import React, { Component } from 'react';
import { View } from 'react-native';
import { Root } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import LoginScreen from './LoginScreen';
import Drawer from './Drawer';
import PickGroupDetailScreen from './PickGroupDetailScreen';
import PickOrderScreen from './PickOrderScreen';
import POUpdateWeightSizeScreen from './POUpdateWeightSizeScreen';
import ReturnOrderScreen from './ReturnOrderScreen';
import DeliveryOrderScreen from './DeliveryOrderScreen';

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
    const AppNavigator = StackNavigator(
      {
        Login: { screen: LoginScreen },
        Drawer: { screen: Drawer },
        PickGroupDetail: { screen: PickGroupDetailScreen },
        PickOrder: { screen: PickOrderScreen },
        POUpdateWeightSize: { screen: POUpdateWeightSizeScreen },
        ReturnOrder: { screen: ReturnOrderScreen },
        DeliveryOrder: { screen: DeliveryOrderScreen },        
      },
      {
        initialRouteName: 'Login',
        headerMode: 'none',
      }
    );
    return (
      <Provider store={store}>
        <Root>
          <AppNavigator />
        </Root>
      </Provider>
    );
  }
}

export default App;
