//import libs
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { StyleSheet, View, ActivityIndicator, Alert, TextInput } from 'react-native';
import Orientation from 'react-native-orientation';
import { 
  Container, Content, Button, Text, Body
} from 'native-base';
import { NavigationActions } from 'react-navigation';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import { userIDChanged, passwordChanged, rememberMeChanged, loadSavedUserPass, loadSavedSession, loginUser, logoutUser, autoLoginSuccess } from '../../actions';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Styles } from '../../Styles';
import ShareVariables from '../../libs/ShareVariables';
import { appVersionName } from '../../apis/MPDS';


//create comp
class LoginScreen extends Component {
  // static navigationOptions = {
  //   title: '',
  //   header: null
  // };

  state = { showPassword: false, rememberMe: false, loading: false }

  componentWillMount() {
    Orientation.lockToPortrait();
    //LocalGroup.getLocalDB();
    //this.props.loadSavedUserPass();
    //this.props.loadSavedSession();
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

  goToHome() {
    this.props.autoLoginSuccess();

    const { dispatch } = this.props.navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Drawer' })
      ]
    });
    dispatch(resetAction);
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


  render() {
    const { userId, password, rememberMe } = this.props;
    return ( 
      <Container style={{ backgroundColor: Colors.background }}>
        <Content
          keyboardShouldPersistTaps='handled' 
          style={{ paddingTop: 50, paddingLeft: 20, paddingRight: 20, backgroundColor: '#ffffff' }}
        > 
            <Body>
              <Text style={{ color: '#4CAF50', fontSize: 24, fontWeight: 'bold' }}>
                Tài xế GHN
              </Text>
              <Text style={{ color: '#dd0000', fontSize: 24, fontWeight: 'bold' }}>{appVersionName}</Text>
            </Body>
            <View style={{ paddingLeft: 10, paddingTop: 32 }}>
              <View style={{ marginRight: 20, marginBottom: 14, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#E9E7EB', borderBottomWidth: 1 }}>
                <IconFA name="user-o" size={18} style={{ width: 32 }}/>
                <TextInput 
                  placeholder="Mã số"
                  value={userId}
                  onChangeText={(text) => this.props.userIDChanged(text)}
                  keyboardType='numeric'
                  underlineColorAndroid='transparent'
                  style={Styles.midTextStyle}
                />
              </View>
              <View style={{ marginRight: 20, marginBottom: 14, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#E9E7EB', borderBottomWidth: 1 }}>
                <IconFA name="lock" size={21}  style={{ width: 32 }} />
                <TextInput 
                  placeholder="Mật khẩu" 
                  secureTextEntry={!this.state.showPassword}
                  value={password}
                  onChangeText={(text) => this.props.passwordChanged(text)}
                  underlineColorAndroid='transparent'
                  style={Styles.midTextStyle}
                  autoCapitalize='none'
                />
              </View>
            </View>
            <CheckBox
              style={{ flex: 1, padding: 10 }} 
              checked={this.state.showPassword} 
              title='Hiển thị mật khẩu'
              onPress={() => this.setState({ showPassword: !this.state.showPassword })}
            />
            <CheckBox
                style={{ flex: 1, padding: 10 }}
                onPress={() => this.props.rememberMeChanged()}
                checked={rememberMe}
                title="Lưu tài khoản"
            />
            <Button 
              block
              success
              onPress={() => { 
                this.setState({ loading: true });
                this.props.loginUser(userId, password, rememberMe);
              }}
            >
              <Text>ĐĂNG NHẬP</Text>
            </Button>
        </Content>
        <LoadingSpinner loading={this.props.loading && this.state.loading} />
      </Container>
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
  { userIDChanged, passwordChanged, rememberMeChanged, loadSavedUserPass, loadSavedSession, loginUser, logoutUser, autoLoginSuccess }
)(LoginScreen);
