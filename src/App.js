import codePush from 'react-native-code-push';
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { Root, StyleProvider } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './configureStore';
import LoginScreen from './screens/LoginScreen';
import Drawer from './Drawer';
import PickGroupDetailScreen from './screens/PickGroupDetailScreen';
import ReturnGroupDetailScreen from './screens/ReturnGroupDetailScreen';
import PickOrderScreen from './screens/PickOrderScreen';
import POUpdateWeightSizeScreen from './screens/POUpdateWeightSizeScreen';
import ReturnOrderScreen from './screens/ReturnOrderScreen';
import DeliveryListScreen from './screens/DeliveryListScreen';
import DeliveryOrderScreen from './screens/DeliveryOrderScreen';
import DeliveryGroupCreateScreen from './screens/DeliveryGroupCreateScreen';
import ReturnListScreen from './screens/ReturnListScreen';
import OrderListScreen from './screens/OrderListScreen';
import TripListScreen from './screens/TripListScreen';
import CvsListScreen from './screens/CvsListScreen';
import AddOrderScreen from './screens/AddOrderScreen';
import PickConfirmScreen from './screens/PickConfirmScreen';
import SignatureScreen from './screens/SignatureScreen';
import GroupPickScreen from './screens/GroupPickScreen';
import BluetoothExampleScreen from './screens/BluetoothExampleScreen';
import OrderLabelScreen from './screens/OrderLabelScreen';
import OrderLabelOldScreen from './screens/OrderLabelScreen/old';
import OrderLabelNewScreen from './screens/OrderLabelScreen/new';
import OrderLabelsScreen from './screens/OrderLabelScreen/multi';

import getTheme from '../native-base-theme/components';
// import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { live } from './apis/MPDS';

if (false || (process.env.NODE_ENV || '').toLowerCase() === 'production') {
  // disable console. log in production
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {};
  console.debug = function () {};
}

const { store, persistor } = configureStore();
let currentScreen = '';

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}
function backPress() {
  console.log(currentScreen);
  if (currentScreen === 'Home') {
    return true;
  }
  return false;
}

//export const store = configureStore();
class App extends Component {
  componentDidMount() {
    if (live) codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
    BackHandler.addEventListener('hardwareBackPress', backPress);
  }

  render() {
    console.log('Root render');
    // const { store } = this.props;
    const AppNavigator = StackNavigator(
      {
        Login: { screen: LoginScreen },
        Drawer: { screen: Drawer },
        DeliveryList: { screen: DeliveryListScreen },
        DeliveryGroupCreate: { screen: DeliveryGroupCreateScreen },
        TripList: { screen: TripListScreen },
        CvsList: { screen: CvsListScreen },
        PickGroupDetail: { screen: PickGroupDetailScreen },
        ReturnGroupDetail: { screen: ReturnGroupDetailScreen },
        PickOrder: { screen: PickOrderScreen },
        POUpdateWeightSize: { screen: POUpdateWeightSizeScreen },
        ReturnOrder: { screen: ReturnOrderScreen },
        DeliveryOrder: { screen: DeliveryOrderScreen },
        ReturnList: { screen: ReturnListScreen },
        OrderList: { screen: OrderListScreen },
        AddOrder: { screen: AddOrderScreen },
        PickConfirm: { screen: PickConfirmScreen },
        Signature: { screen: SignatureScreen },
        GroupPick: { screen: GroupPickScreen },
        BluetoothExample: { screen: BluetoothExampleScreen },
        OrderLabel: { screen: OrderLabelScreen },
        OrderLabelOld: { screen: OrderLabelOldScreen },
        OrderLabelNew: { screen: OrderLabelNewScreen },
        OrderLabels: { screen: OrderLabelsScreen },
      },
      {
        initialRouteName: 'Login',
        headerMode: 'none',
      }
    );
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Root>
            <StyleProvider style={getTheme(platform)}>
              <AppNavigator
                onNavigationStateChange={(prevState, currentState) => {
                  currentScreen = getActiveRouteName(currentState);
                }}
              />
            </StyleProvider>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}


// App.defaultProps = {
//   store,
//   persistor
// };
const codePushOptions = { checkFrequency: (live ? codePush.CheckFrequency.ON_APP_RESUME : codePush.CheckFrequency.MANUAL) };
export default codePush(codePushOptions)(App);
