import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, 
  Header, Tab, Tabs 
} from 'native-base';
import { connect } from 'react-redux';
import DeliveryGroupList from '../components/delivery/DeliveryGroupList';
import DeliveryByGroup from '../components/delivery/DeliveryByGroup';
import DeliveryGroupCreate from '../components/delivery/DeliveryGroupCreate';
import Utils from '../libs/Utils';
import { Colors } from '../Styles';

class DeliveryListScreen extends Component {
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const deliveryList = this.props.pds.DeliveryItems;
    const deliveryListRun = this.props.pds.DeliveryItems.filter(o => !Utils.checkDeliveryComplete(o.CurrentStatus));
    const deliveryListDone = this.props.pds.DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.CurrentStatus));
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>C đi giao ({this.props.deliveryComplete}/{this.props.deliveryTotal})</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="Nhóm">
            <DeliveryByGroup deliveryList={deliveryListRun} navigation={this.props.navigation} />
          </Tab>
          <Tab heading="Tạo Nhóm">
            <DeliveryGroupCreate deliveryList={deliveryList} />
          </Tab>
          <Tab heading="Đã giao">
            <DeliveryGroupList deliveryList={deliveryListDone} navigation={this.props.navigation} />
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
