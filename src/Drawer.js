import React, { Component } from 'react';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SideBar from './components/SideBar';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import HelpScreen from './screens/HelpScreen';
import PickListScreen from './screens/PickListScreen';
import ReturnListScreen from './screens/ReturnListScreen';
import DeliveryListScreen from './screens/DeliveryListScreen';
import PerformanceScreen from './screens/PerformanceScreen';


const Drawer = DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapScreen },
    Help: { screen: HelpScreen },
    Performance: { screen: PerformanceScreen },
    DeliveryList: { screen: DeliveryListScreen },
    ReturnList: { screen: ReturnListScreen }
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />
  }
);

export default Drawer;
