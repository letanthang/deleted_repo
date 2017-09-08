import React, { Component } from 'react';
import { View } from 'react-native';
import { Root, StyleProvider } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import configureStore from './configureStore';
import LoginScreen from './screens/LoginScreen';
import Drawer from './Drawer';
import PickListScreen from './screens/PickListScreen';
import PickGroupDetailScreen from './screens/PickGroupDetailScreen';
import PickOrderScreen from './screens/PickOrderScreen';
import POUpdateWeightSizeScreen from './screens/POUpdateWeightSizeScreen';
import ReturnOrderScreen from './screens/ReturnOrderScreen';
import DeliveryListScreen from './screens/DeliveryListScreen';
import DeliveryOrderScreen from './screens/DeliveryOrderScreen';
import DeliveryGroupCreateScreen from './screens/DeliveryGroupCreateScreen';
import ReturnListScreen from './screens/ReturnListScreen';
import OrderListScreen from './screens/OrderListScreen';

import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';

export const store = configureStore();

class App extends Component {
  render() {
    const AppNavigator = StackNavigator(
      {
        Login: { screen: LoginScreen },
        Drawer: { screen: Drawer },
        DeliveryList: { screen: DeliveryListScreen },
        DeliveryGroupCreate: { screen: DeliveryGroupCreateScreen },
        PickList: { screen: PickListScreen },
        PickGroupDetail: { screen: PickGroupDetailScreen },
        PickOrder: { screen: PickOrderScreen },
        POUpdateWeightSize: { screen: POUpdateWeightSizeScreen },
        ReturnOrder: { screen: ReturnOrderScreen },
        DeliveryOrder: { screen: DeliveryOrderScreen },
        ReturnList: { screen: ReturnListScreen },
        OrderList: { screen: OrderListScreen },        
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
