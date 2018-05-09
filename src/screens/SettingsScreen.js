import React, { Component } from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { 
  Container, Header, Left, Body, Card, 
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';
import { pdListClearTrip } from '../actions';

class SettingsScreen extends Component {
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
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>03 2018</Text>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <View>
            <Switch value />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigate('Log')}
            >
              <Text>API Logs</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => this.props.pdListClearTrip()}
            >
              <Text>Reset Trip -> lost Data !</Text>
            </TouchableOpacity>
          </View>
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const { layoutMode, animated } = state.config;

  return { layoutMode, animated };
};


export default connect(mapStateToProps, { pdListClearTrip })(SettingsScreen);
