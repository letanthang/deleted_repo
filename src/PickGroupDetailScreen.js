import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, List,
  Header, Body, Left, Right,
  Button, Icon, Item,
  Title, Text
} from 'native-base';
import ChkBox from 'react-native-check-box';
import { updateOrderStatus } from './actions';
import LoadingSpinner from './components/LoadingSpinner';

class PickGroupDetailScreen extends Component {
  

  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.ClientHubID = this.pickGroup.ClientHubID;
  }
  componentDidUpdate() {
    this.pickGroup = this.props.pds.PickReturnItems.find(pg => pg.ClientHubID === this.ClientHubID);
  }

  pickGroup = null;
  ClientHubID = null;
  
  updateOrder(order, status) {
    const { pickGroup, ClientHubID } = this;
    const { sessionToken, pdsId } = this.props;
    const { PickDeliverySessionDetailID, OrderID } = order;
    const { PickDeliveryType } = pickGroup;
    console.log(`updateOrder to status : ${status} | pdsId ${pdsId} | ClientHubID ${ClientHubID}`);
    console.log(order);
    this.props.updateOrderStatus({ 
      sessionToken, 
      pdsId, 
      PickDeliverySessionDetailID, 
      OrderID, 
      PickDeliveryType, 
      status,
      ClientHubID 
    });
  }
  renderOrder(order) {
    const { 
      OrderCode, RecipientName, RecipientPhone, ServiceCost, 
      Height, Width, Weight, Length, CurrentStatus
    } = order;
    return (
      <View style={{ padding: 5 }}>
        <Text>{OrderCode}</Text>
        <Text>{RecipientName} - {RecipientPhone}</Text>
        <Text>{Weight} g|{Length}-{Width}-{Height} (cm3)</Text>
        <Text>Tiền thu: {ServiceCost} đ</Text>
        <Item>
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => console.log('loi pressed')}
            isChecked={false}
            rightText="LOI" 
          /> 
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={this.updateOrder.bind(this, order, 'Storing')}
            isChecked={CurrentStatus === 'Storing'}
            rightText="DA LAY" 
          /> 
        </Item>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { pickGroup } = this;
    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log(pickGroup);
    console.log('====================================');

    return (
      
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.navigate('DrawerOpen')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Button
            transparent
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body>
            <Title>[{pickGroup.DisplayOrder}] {pickGroup.ClientName}</Title>
          </Body>
          <Right>
            <Button
              transparent
            >
              <Icon name="information-circle" />
            </Button>
          </Right>
        </Header>
      
        <Content>
          <List
            dataArray={pickGroup.PickReturnSOs}
            renderRow={this.renderOrder.bind(this)}
          />
        </Content>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
      
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  return { sessionToken, pdsId, pds, loading };
};


export default connect(mapStateToProps, { updateOrderStatus })(PickGroupDetailScreen);
