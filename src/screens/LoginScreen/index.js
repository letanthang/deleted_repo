//import libs
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { StyleSheet, View, Alert, TextInput } from 'react-native';
import Orientation from 'react-native-orientation';
import { 
  Container, Content, Button, Text, Body
} from 'native-base';
import { NavigationActions } from 'react-navigation';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import { userIDChanged, passwordChanged, rememberMeChanged, loadSavedUserPass, loadSavedSession, loginUser, logoutUser } from '../../actions';
import HrWebView from './HrWebView';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Styles } from '../../Styles';
import ShareVariables from '../../libs/ShareVariables';


//create comp
class LoginScreen extends Component {
  // static navigationOptions = {
  //   title: '',
  //   header: null
  // };

  // state = { showPassword: false, rememberMe: false, loading: false }

  componentWillMount() {
    Orientation.lockToPortrait();
    new ShareVariables().LoginHeader['X-Auth'] = this.props.sessionToken;
    firebase.messaging().requestPermissions();
    // console.log(this.props.user);
    if (this.props.user) {
      console.log('navigate away2!');
      this.goToHome();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;

    if (user) {
      console.log('navigate away!');
      this.goToHome();
    }
  }
  componentWillUpdate() {
    if (this.props.user) {
      console.log('navigate away1!');
      this.goToHome();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    //show login error
    if (!prevProps.error && this.props.error) {
      Alert.alert(
        'Lỗi đăng nhập',
        this.props.error,
        [
          { text: 'Báo lỗi', onPress: () => console.log('Bao loi pressed!') },
          { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      );
    }
  }

  goToHome() {
    const { dispatch } = this.props.navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Drawer' })
      ]
    });
    dispatch(resetAction);
  }

  render() {
    return (
      <HrWebView
        loginSuccess={t62 => this.props.loginUser(t62)}
      />
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50,
    alignItems: 'center'
  },
  headerStyle: {
    color: '#FF4CAF50'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  }
});

const mapStateToProps = ({ auth }) => {
  const { userId, password, rememberMe, user, error, loading, sessionToken } = auth;
  return { userId, password, rememberMe, user, error, loading, sessionToken };
};

//make it available
export default connect(
  mapStateToProps, 
  { userIDChanged, passwordChanged, rememberMeChanged, loadSavedUserPass, loadSavedSession, loginUser, logoutUser }
)(LoginScreen);
