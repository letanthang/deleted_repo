import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Content, Text, Button, Icon } from 'native-base';

class HelpScreen extends Component {
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
          <Body />
        </Header>
        <Content>
          <Text>Help</Text>
        </Content>

      </Container>
    );
  }
}

export default HelpScreen;
