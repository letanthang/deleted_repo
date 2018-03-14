import React, { Component } from 'react';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SideBar from './components/SideBar';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import HelpScreen from './screens/HelpScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';
import LogScreen from './screens/LogScreen';

import PerformanceScreen from './screens/PerformanceScreen';


const Drawer = DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    About: { screen: AboutScreen },
    Log: { screen: LogScreen },
    Settings: { screen: SettingsScreen },
    Map: { screen: MapScreen },
    Help: { screen: HelpScreen },
    Performance: { screen: PerformanceScreen }
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />
  }
);

export default Drawer;
