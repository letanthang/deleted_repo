
//import libs
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
  Container, Content, Button, Text, 
  Body, Input, Form, Item, CheckBox, ListItem 
} from 'native-base';
import { NavigationActions } from 'react-navigation';
import IconFA from 'react-native-vector-icons/FontAwesome';
import ChkBox from 'react-native-check-box';
import { connect } from 'react-redux';
import { userIDChanged, passwordChanged, loginUser, logoutUser } from './actions';

//create comp
class LoginScreen extends Component {
  static navigationOptions = {
    title: '',
    header: null
  };

  state = { showPassword: false, rememberMe: false }

  componentWillMount() {
    console.log('MPDS_new : componentWillMount');
  }
  componentWillReceiveProps(nextProps) {
    // this.props still here -> the old set of props
    console.log('MPDS_new : componentWillReceiveProps');
  }

  render() {
    const { dispatch } = this.props.navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Drawer' })
      ]
    });
    
    return ( 
      <Container>
        <Content 
        style={{ paddingTop: 50, paddingLeft: 20, paddingRight: 20, backgroundColor: '#ffffff' }}
        > 
            <Body>
              <Text style={{ color: '#4CAF50', fontSize: 24, fontWeight: 'bold' }}>
                m-PDS
              </Text> 
            </Body>
            <Form>
              <Item style={{ marginRight: 20 }}>
                <IconFA name="user-o" size={20} />
                <Input 
                  placeholder="Mã số" 
                  value={this.props.userID}
                  onChangeText={(text) => this.props.userIDChanged(text)}
                />
              </Item>
              <Item style={{ marginRight: 20 }}>
                <IconFA name="lock" size={20} />
                <Input 
                  placeholder="Mật khẩu" 
                  secureTextEntry={!this.state.showPassword}
                  value={this.props.password}
                  onChangeText={(text) => this.props.passwordChanged(text)}
                />
              </Item>
            </Form>
            <ListItem onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
              <CheckBox checked={this.state.showPassword} />
              <Body>
                <Text>Hiển thị mật khẩu</Text>
              </Body>
            </ListItem>
            <ChkBox
                style={{ flex: 1, padding: 10 }}
                onClick={() => this.setState({ rememberMe: !this.state.rememberMe })}
                isChecked={this.state.rememberMe}
                rightText="Lưu tài khoản"
            />
            <Button 
              block
              success
              onPress={() => loginUser({ userID: this.props.userID, password: this.props.password })}
            >
              <Text>ĐĂNG NHẬP</Text>
            </Button>
        </Content>
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
  }
});

const mapStateToProps = ({ auth }) => {
  const { userID, password, user, error, loading } = auth;
  return { userID, password, user, error, loading };
};

//make it available
export default connect(
  mapStateToProps, 
  { userIDChanged, passwordChanged, loginUser, logoutUser }
)(LoginScreen);
