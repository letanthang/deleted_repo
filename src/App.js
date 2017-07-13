import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './LoginScreen';
import Drawer from './Drawer';

class App extends Component {
  render() {
    const AppNavigator = StackNavigator({
      Login: { screen: LoginScreen },
      Drawer: { screen: Drawer }
    });
    return (
      <AppNavigator />
    );
  }
}

export default App;
