//import lib
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { 
  Container, Content, Button, List, ListItem, 
  Text, Icon, Left, Body 
} from 'native-base';
import { logoutUser } from '../actions';

//create cmp
class SideBar extends Component {
  shouldComponentUpdate({ navigation, user }) {
    console.log('Drawer : componentShouldUpdate: ');
    console.log(user);
    const { dispatch } = navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    });

    if (!user) {
      console.log('user is null and navigate to Login');
      dispatch(resetAction);
      return false;
    }
    return true;
  }  
  
  onLogoutPress() {
    console.log('onLogoutPress called');
    this.props.logoutUser();
  }

  onUpdateDataPress() {
    console.log('onUpdateDataPress pressed');
    this.props.navigation.navigate('Home', { needUpdateData: true });
  }

  render() {
    console.log('SideBar: render called');
    const { UserID, FullName } = this.props.user;
    return (
      <Container style={{ marginTop: 20 }}>
        <Content>
          <View style={{ padding: 3, height: 170, backgroundColor: '#56B85A', borderColor: 'green', borderWidth: 3 }}>
            <IconFA name="user-circle" size={50} />
            <Text style={{ color: 'white', marginTop: 50 }}>{FullName}</Text>
          </View>

          <List>
            <ListItem icon>
                <Left>
                  <IconFA name="user-circle" size={15} />
                </Left>
                <Body>
                  <Text>ĐP:{UserID} - {FullName}</Text>
                </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <IconFA name="mobile" size={18} />
              </Left>
              <Body>
                <Text>SĐT:0908</Text>
              </Body>
            </ListItem>
            <ListItem 
              onPress={this.onUpdateDataPress.bind(this)}
              icon
            >
              <Left>
                <IconFA name="download" size={15} />
              </Left>
              <Body>
                <Text>Cập nhật dữ liệu</Text>
              </Body>
            </ListItem>
            
            <ListItem 
              onPress={() => this.props.navigation.navigate('Home')}
              icon
            >
              <Left>
                <IconFA name="home" size={15} />
              </Left>
              <Body>
                <Text>Màn hình chính</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <IconFA name="map" size={15} />
              </Left>
              <Body>
                <Text>Bản đồ</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <IconFA name="info-circle" size={15} />
              </Left>
              <Body>
                <Text>Thông tin ứng dụng</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <IconFA name="map" size={15} />
              </Left>
              <Body>
                <Text>Góp ý</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <IconFA name="map" size={15} />
              </Left>
              <Body>
                <Text>Hướng dẫn</Text>
              </Body>
            </ListItem>
            <ListItem 
              icon
              onPress={this.onLogoutPress.bind(this)}
            >
              <Left>
                <Icon name="log-out" size={15} />
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  buttonStyle: {
    
  }
});

const mapStateToProps = ({ auth }) => {
  const { user } = auth;
  return { user };
};
//make avai
export default connect(mapStateToProps, { logoutUser })(SideBar);
