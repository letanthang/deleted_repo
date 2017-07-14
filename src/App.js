import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import LoginScreen from './LoginScreen';
import Drawer from './Drawer';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
class App extends Component {
  render() {
    const AppNavigator = StackNavigator({
      Login: { screen: LoginScreen },
      Drawer: { screen: Drawer }
    });
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

export default App;
