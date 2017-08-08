import React, { Component } from 'react';
import { Root } from 'native-base';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SideBar from './components/SideBar';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import HelpScreen from './HelpScreen';
import PickListScreen from './PickListScreen';
import PickGroupDetailScreen from './PickGroupDetailScreen';
import PickOrderScreen from './PickOrderScreen';
import POUpdateWeightSizeScreen from './POUpdateWeightSizeScreen';
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
    POUpdateWeightSize: { screen: POUpdateWeightSizeScreen },
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
  // static navigationOptions = {
  //   title: '',
  //   header: null
  // }

  
  shouldComponentUpdate({ navigation, user }) {
    console.log('Drawer : componentShouldUpdate: ');
    console.log(user);
    const { dispatch } = navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    });

    if (!user) {
      console.log('user is null and navigate to Login');
      dispatch(resetAction);
      return false;
    }
    return true;
  }
  
  render() {
    return (
      <Root>
        <AppDrawer />
      </Root>
    );
  }
}
const mapStateToProps = ({ auth }) => {
  const { user } = auth;
  return { user };
};
export default connect(mapStateToProps)(Drawer);
