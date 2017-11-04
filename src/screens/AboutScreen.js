import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Button as Btn } from 'react-native';
import { 
  Container, Header, Left, Body, Card, 
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';
import { goSupport } from '../actions';

class AboutScreen extends Component {
  state = { clickNum: 0 }
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
          <TouchableOpacity
            onPress={() => this.setState({ clickNum: this.state.clickNum + 1 })}
          >
            <Card>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Build Number</Text>
                  </View>
                </View>
                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>04112017-10am</Text>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          {this.state.clickNum > 7 ?
          <View>
            <TextInput 
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
