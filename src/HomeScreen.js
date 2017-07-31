import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { 
  Container, Header, Title, Left, Body, 
  Right, Content, Text, Button, Icon,
  Card, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import { pdListFetch } from './actions';
import PDCard from './components/home/PDCard';
import LoadingSpinner from './components/LoadingSpinner';

const efficiencyIcon = require('../resources/ic_summary.png');

class HomeScreen extends Component {
  componentWillMount() {
    if (!this.props.user) return;
    console.log('====================================');
    console.log('HomeScreen : CWM');
    const sessionToken = this.props.user.SessionToken;
    console.log(this.props.pds);
    console.log('====================================');
    if (!this.props.pds) this.props.pdListFetch(sessionToken);
  }
  componentDidUpdate() {
    console.log('====================================');
    console.log('HomeScreen : CDU');
    console.log(this.props.pds);
    console.log(this.props.deliveryComplete);
    console.log('====================================');
  }
  onPickPress() {
    console.log('PickList pressed!');
    const { navigate } = this.props.navigation;
    navigate('PickList');
  }
  onReturnPress() {
    console.log('ReturnList pressed!');
    const { navigate } = this.props.navigation;
    navigate('ReturnList');
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
            upNumber={this.props.pickComplete}
            downNumber={this.props.pickTotal}
          />

          <PDCard
            type='delivery'
            onPress={this.onDeliveryPress.bind(this)}
            upNumber={this.props.deliveryComplete}
            downNumber={this.props.deliveryTotal}
          />

          <PDCard
            type='return'
            onPress={this.onReturnPress.bind(this)}
            upNumber={this.props.returnComplete}
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
        <LoadingSpinner loading={this.props.loading} />
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
  const { 
    pds, loading, error, pickTotal, pickComplete, 
    deliveryTotal, deliveryComplete, returnTotal, returnComplete } = pd;
  const { user } = auth;
  return { 
    pds, 
    loading, 
    error, 
    user, 
    pickTotal,
    pickComplete, 
    deliveryTotal, 
    deliveryComplete, 
    returnTotal, 
    returnComplete 
  };
};

export default connect(mapStateToProps, { pdListFetch })(HomeScreen);
