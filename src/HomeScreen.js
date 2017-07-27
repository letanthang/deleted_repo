import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { 
  Container, Header, Title, Left, Body, 
  Right, Content, Text, Button, Icon,
  Card, CardItem, Item, Thumbnail 
} from 'native-base';
import { connect } from 'react-redux';
import { pdListFetch } from './actions';
import PDCard from './components/home/PDCard';

const efficiencyIcon = require('../resources/ic_summary.png');

class HomeScreen extends Component {
  componentWillMount() {
    if (!this.props.user) return;
    console.log('====================================');
    console.log('HomeScreen : CWM');
    console.log('====================================');
    const sessionToken = this.props.user.SessionToken;
    this.props.pdListFetch(sessionToken);
  }
  onPickPress() {
    console.log('PickList pressed!');
    const { navigate } = this.props.navigation;
    navigate('PickList');
  }
  onDeliveryPress() {
    console.log('DeliveryList pressed!');
    const { navigate } = this.props.navigation;
    navigate('DeliveryList');
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
          <Right>
        
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
            
          </Right>
        </Header>
        <Content style={{ padding: 10 }}>

          <PDCard
            type='pick'
            onPress={this.onPickPress.bind(this)}
            upNumber={0}
            downNumber={this.props.pickTotal}
          />

          <PDCard
            type='delivery'
            onPress={this.onPickPress.bind(this)}
            upNumber={0}
            downNumber={this.props.deliveryTotal}
          />

          <PDCard
            type='return'
            onPress={this.onDeliveryPress.bind(this)}
            upNumber={0}
            downNumber={this.props.returnTotal}
          />
          
          <Card>
            <CardItem>
              <View style={styles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>
                    Năng suất làm việc
                  </Text>
                </View>
              </View>
              <View style={styles.cardItemRight}>
                <Image source={efficiencyIcon} />
              </View>
            </CardItem>
          </Card>
          
        </Content>
      </Container>
    );
  }
}

const styles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = ({ auth, pd }) => {
  const { pdList, loading, error, pickTotal, deliveryTotal, returnTotal } = pd;
  const { user } = auth;
  return { pdList, loading, error, user, pickTotal, deliveryTotal, returnTotal };
};

export default connect(mapStateToProps, { pdListFetch })(HomeScreen);
