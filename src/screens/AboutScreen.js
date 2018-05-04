import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Button as Btn } from 'react-native';
import { 
  Container, Header, Left, Body, Card, 
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import md5 from 'md5';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';

class AboutScreen extends Component {
  state = { clickNum: 0, password: '', verified: false }
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
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ padding: 10 }}
        >
          <TouchableOpacity>
            <Card>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Build Number</Text>
                  </View>
                </View>
                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>29/03 8am</Text>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => this.setState({ clickNum: this.state.clickNum + 1 })}
          >
            <View style={{ flex: 1, height: 44 }}></View>
          </TouchableOpacity>
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = ({ auth }) => {
  const { userID } = auth;
  return { userID };
};

export default connect(mapStateToProps, {})(AboutScreen);
