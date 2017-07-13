//import libs
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
  Container, Content, Button, Text, 
  Body, Input, Form, Item, Icon, ListItem, CheckBox } from 'native-base';
import { NavigationActions } from 'react-navigation';
import IconFA from 'react-native-vector-icons/FontAwesome';
//create comp
class LoginScreen extends Component {
  static navigationOptions = {
    title: '',
    header: null
  };
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
        <Content style={{ paddingTop: 50 }}> 
            <Body>
              <Text style={{ color: '#4CAF50', fontSize: 24, fontWeight: 'bold' }}>m-PDS</Text>
              <Text>ĐĂNG NHẬP</Text>    
            </Body>
            <Form>
              <Item style={{ marginRight: 20 }}>
                <IconFA name="user-o" size={20} />
                <Input placeholder="Mã số" />
              </Item>
              <Item>
                <IconFA name="lock" size={20} />
                <Input placeholder="Mật khẩu" />
              </Item>
            </Form>
            <ListItem>
              <CheckBox checked={true} />
              <Body>
                <Text>Daily Stand Up</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={false} />
              <Body>
                <Text>Discussion with Client</Text>
              </Body>
            </ListItem>
            <Body>
              <Button 
                success
                onPress={() => dispatch(resetAction)}
              >
                <Text>ĐĂNG NHẬP</Text>
              </Button>
            </Body>
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

//make it available
export default LoginScreen;
