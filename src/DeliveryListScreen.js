import React, { Component } from 'react';
import { 
  Container, Content, Right, Left, Body, 
  Icon, Button, Title, Card, CardItem,
  Text, Header, Tab, Tabs 
} from 'native-base';
import { connect } from 'react-redux';
import DeliveryGroupList from './components/DeliveryGroupList';
import DeliveryGroupCreate from './components/DeliveryGroupCreate';

class DeliveryListScreen extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('DeliveryListScreen: CWM called!');
    console.log('====================================');
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('====================================');
    console.log('DeliveryListScreen: CDU called');
    console.log(this.props.pickList);
    console.log('====================================');
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => navigate('DrawerOpen')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>C đi giao ({this.props.deliveryComplete}/{this.props.deliveryTotal})</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="DS NHOM">
            <DeliveryGroupList {...this.props} />
          </Tab>
          <Tab heading="TAO NHOM">
            <DeliveryGroupCreate deliveryList={this.props.deliveryList} />
          </Tab>
        </Tabs>
        
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { deliveryList, deliveryTotal, deliveryComplete } = pd;
  return { deliveryList, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryListScreen);
