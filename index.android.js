import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/LoginScreen';
import App from './src/App';

const SimpleApp = StackNavigator({
  Home: { screen: LoginScreen },
});

AppRegistry.registerComponent('mpds_new', () => App);
