import React, { Component } from 'react';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SideBar from './components/SideBar';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import HelpScreen from './HelpScreen';
import PickListScreen from './PickListScreen';
import ReturnListScreen from './ReturnListScreen';
import DeliveryListScreen from './DeliveryListScreen';


const Drawer = DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapScreen },
    Help: { screen: HelpScreen },
    DeliveryList: { screen: DeliveryListScreen },
    ReturnList: { screen: ReturnListScreen }
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />
  }
);

export default Drawer;
