import React, { Component } from 'react';
import { Container, Header, Title, Left, Body, Right, Content, Text, Button, Icon } from 'native-base';

class HomeScreen extends Component {
  componentWillMount() {
    console.log('hehe');
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigate('DrawerOpen')}
            >          
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>MPDS</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>Chuyen di lay </Text>
          <Text>Chuyen di giao </Text>
          <Text>Chuyen di tra </Text>
        </Content>

      </Container>
    );
  }
}

export default HomeScreen;
