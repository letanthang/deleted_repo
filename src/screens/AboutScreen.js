import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Button as Btn } from 'react-native';
import { 
  Container, Header, Left, Body, Card, 
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import md5 from 'md5';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';
import { goSupport } from '../actions';

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
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>14/03 - 2am</Text>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => this.setState({ clickNum: this.state.clickNum + 1 })}
          >
            <View style={{ flex: 1, height: 44 }}></View>
          </TouchableOpacity>
          {this.state.clickNum > 6 && !this.state.verified ?
          <View>
            <TextInput
              secureTextEntry
              placeholder='password'
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Btn 
              title="Verify"
              onPress={() => {
                if (md5(this.state.password) === 'ee9b4ea92c81bfcee752e0bcda322350') {
                  this.setState({ verified: true });
                } else {
                  alert('wrong password');
                  this.setState({ password: '' });
                }
              }}
            />
            <Text>{this.props.userID}</Text>
          </View>
          : null}
          {this.state.clickNum > 6 && this.state.verified ?
          <View>
            <TextInput
              placeholder='USER ID'
              value={this.state.UserID}
              onChangeText={(text) => this.setState({ UserID: text })}
            />
            <Btn 
              title="Go support"
              onPress={() => this.props.goSupport(this.state.UserID)}
            />
            <Text>{this.props.userID}</Text>
          </View>
          : null}
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = ({ auth }) => {
  const { userID } = auth;
  return { userID };
};

export default connect(mapStateToProps, { goSupport })(AboutScreen);
