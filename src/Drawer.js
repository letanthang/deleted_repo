import React, { Component } from 'react';
import { Root } from 'native-base';
import { DrawerNavigator } from 'react-navigation';
import SideBar from './components/SideBar';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import HelpScreen from './HelpScreen';
import PickListScreen from './PickListScreen';
import PickGroupDetailScreen from './PickGroupDetailScreen';
import PickOrderScreen from './PickOrderScreen';
import ReturnListScreen from './ReturnListScreen';
import ReturnOrderScreen from './ReturnOrderScreen';
import DeliveryListScreen from './DeliveryListScreen';
import DeliveryOrderScreen from './DeliveryOrderScreen';

const AppDrawer = DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapScreen },
    Help: { screen: HelpScreen },
    PickList: { screen: PickListScreen },
    PickGroupDetail: { screen: PickGroupDetailScreen },
    PickOrder: { screen: PickOrderScreen },
    ReturnOrder: { screen: ReturnOrderScreen },
    DeliveryList: { screen: DeliveryListScreen },
    DeliveryOrder: { screen: DeliveryOrderScreen },
    ReturnList: { screen: ReturnListScreen }
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />
  }
);

class Drawer extends Component {
  static navigationOptions = {
    title: '',
    header: null
  }
  render() {
    return (
      <Root>
        <AppDrawer />
      </Root>
    );
  }
}

export default Drawer;
