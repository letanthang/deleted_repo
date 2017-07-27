//import lib
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { 
  Container, Content, Button, List, ListItem, 
  Text, Icon, Left, Body 
} from 'native-base';

//create cmp
class SideBar extends Component {
  render() {
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
                <IconFA name="mobile" size={15} />
              </Left>
              <Body>
                <Text>SĐT:0908</Text>
              </Body>
            </ListItem>
            <ListItem icon>
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
export default connect(mapStateToProps)(SideBar);
