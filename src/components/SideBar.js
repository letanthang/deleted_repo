//import lib
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, StyleSheet } from 'react-native';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  Container, Content, List, ListItem, 
  Text, Icon, Left, Body, Right 
} from 'native-base';
import { logoutUser, pdListFetch } from '../actions';
import Utils from '../libs/Utils';

//create cmp
class SideBar extends Component {
  shouldComponentUpdate({ navigation, user }) {
    const { dispatch } = navigation;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    });

    if (!user) {
      dispatch(resetAction);
      return false;
    }
    return true;
  }  
  
  onLogoutPress() {
    this.props.logoutUser();
  }

  onUpdateDataPress() {
    //this.props.navigation.navigate('Home', { needUpdateData: true });
    
    this.props.navigation.navigate('DrawerClose');
    this.props.pdListFetch({})
      // .then(result => {
      //   if (result) Utils.showToast('Cập nhật chuyến đi thành công.', 'success');
      // });
  }

  render() {
    let createdByName = '';
    let createdByPhone = '';
    if (this.props.pdsItems) {
      createdByName = this.props.Infos.createdByName;
      createdByPhone = this.props.Infos.createdByPhone;
    }
    
    const { UserID, FullName } = this.props.user;
    return (
      <Container>
        <Content>
          <View style={{ justifyContent: 'space-between', paddingBottom: 16, paddingTop: 16, paddingLeft: 16, height: 170, backgroundColor: '#56B85A' }}>
            <IC name="account-circle" size={70} color='white' />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{FullName}</Text>
          </View>

          <List>
            <ListItem icon>
                <Left>
                  <IC name="account" size={20} color='#FF9504' />
                </Left>
                <Body>
                  <Text>ĐP : {createdByName}</Text>
                </Body>
            </ListItem>
            <ListItem 
              icon
              onPress={() => Utils.phoneCall(createdByPhone, true)}
            >
              <Left>
                <IC name="cellphone" size={20} color='#FF9504' />
              </Left>
              <Body>
                <Text>SĐT ĐP : {createdByPhone}</Text>
              </Body>
              <Right>
                <IC name='phone' color='#FF9504' size={20} />
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem 
              onPress={this.onUpdateDataPress.bind(this)}
              icon
            >
              <Left>
                <IC name="autorenew" size={20} color='#4DDA64' />
              </Left>
              <Body>
                <Text>Cập nhật DL</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem 
              onPress={() => {
                this.props.navigation.navigate('About');
              }}
              icon
            >
              <Left>
                <IC name="information" size={20} color='#8F8E93' />
              </Left>
              <Body>
                <Text>Thông tin ứng dụng</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem 
              onPress={() => {
                this.props.navigation.navigate('Settings');
              }}
              icon
            >
              <Left>
                <IC name="settings" size={20} color='#8F8E93' />
              </Left>
              <Body>
                <Text>Cài đặt ứng dụng</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem 
              icon
              onPress={this.onLogoutPress.bind(this)}
            >
              <Left>
                <IC name="logout" size={20} color='#8F8E93' />
              </Left>
              <Body>
                <Text>Đăng xuất</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { user } = auth;
  const { pdsItems, Infos } = pd;
  return { user, pdsItems, Infos };
};
//make avai
export default connect(mapStateToProps, { logoutUser, pdListFetch })(SideBar);
