//import lib
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Container, Content, Button, List, ListItem, Text, Icon } from 'native-base';

//create cmp
class SideBar extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={{ marginTop: 20 }}>
        <Content>
          <View style={{ padding: 3, borderColor: 'green', borderWidth: 3 }}>
            <Image 
              source={{ uri: 'https://giaohangnhanh.vn/wp-content/uploads/2017/06/2711dd32-72dd-47ba-ba70-ae81941d0f2b1.png' }} 
              style={{ height: 150, width: null, flex: 1 }}
            />
          </View>
          
          <List>
            <ListItem>
              <Button
                transparent
                iconLeft

                onPress={() => navigate('Home')}
              >
                <Icon name='home' />
                <Text>Home</Text>
              </Button>
              
            </ListItem>
            <ListItem>
              <Button
                transparent
                iconLeft
                onPress={() => this.props.navigation.navigate('Map')}
              >
                <Icon name='map' />
                <Text>Map</Text>
              </Button>
            </ListItem>
            <ListItem>
              <Button
                transparent
                iconLeft

                onPress={() => navigate('Help')}
              >
                <IconFA name='bar-chart' />
                <Text>Huong dan</Text>
              </Button>
              
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

//make avai
export default SideBar;
