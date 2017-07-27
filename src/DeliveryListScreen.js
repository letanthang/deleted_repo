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
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {
    
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const deliveryList = this.props.pds.DeliveryItems;
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
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body>
            <Title>C đi giao ({this.props.deliveryComplete}/{this.props.deliveryTotal})</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="DS NHOM">
            <DeliveryGroupList deliveryList={deliveryList} navigation={this.props.navigation} />
          </Tab>
          <Tab heading="TAO NHOM">
            <DeliveryGroupCreate deliveryList={deliveryList} />
          </Tab>
        </Tabs>
        
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryListScreen);
