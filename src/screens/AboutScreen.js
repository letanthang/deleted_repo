import React, { Component } from 'react';
import { View } from 'react-native';
import { 
  Container, Header, Left, Body, Card, 
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';

class AboutScreen extends Component {
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            </View>
          </Left>
          <Body />
        </Header>
        <Content style={{ padding: 10 }}>
          <Card>
            <CardItem style={{ backgroundColor: Colors.row }}>
              <View style={HomeStyles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Build Number</Text>
                </View>
              </View>
              <View style={HomeStyles.cardItemRight}>
                <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>27102017-5pm</Text>
              </View>
            </CardItem>
          </Card>
        </Content>

      </Container>
    );
  }
}

export default AboutScreen;
