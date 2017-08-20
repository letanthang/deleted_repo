import React, { Component } from 'react';
import { View } from 'react-native';
import { Root, StyleProvider } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import LoginScreen from './screens/LoginScreen';
import Drawer from './Drawer';
import PickListScreen from './screens/PickListScreen';
import PickGroupDetailScreen from './screens/PickGroupDetailScreen';
import PickOrderScreen from './screens/PickOrderScreen';
import POUpdateWeightSizeScreen from './screens/POUpdateWeightSizeScreen';
import ReturnOrderScreen from './screens/ReturnOrderScreen';
import DeliveryOrderScreen from './screens/DeliveryOrderScreen';

import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';

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
        PickList: { screen: PickListScreen },
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
          <StyleProvider style={getTheme(platform)}>
            <AppNavigator />
          </StyleProvider>
        </Root>
      </Provider>
    );
  }
}

export default App;
