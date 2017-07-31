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
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
  }
  componentDidUpdate() {
    this.pickGroup = this.props.pds.PickReturnItems.find(pg => pg.ClientHubID === this.ClientHubID 
      && pg.PickDeliveryType === this.PickDeliveryType);
  }

  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;
  
  updateOrderToDone(order) {
    let status = null;
    if (this.pickGroup.PickDeliveryType === 3) status = 'WaitingToFinish';
    if (this.pickGroup.PickDeliveryType === 1) status = 'Storing';
    this.updateOrder(order, status);
  }

  updateOrderToFail(order) {
    let status = null;
    let infos = {};
    if (this.pickGroup.PickDeliveryType === 3) {
      status = 'Storing';
      const StoringCode = 'GHN-SC9649';
      const NewDate = 0;
      const Log = 'GHN-SC9649|KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG';
      infos = { StoringCode, NewDate, Log };
    } 
    if (this.pickGroup.PickDeliveryType === 1) {
      status = 'ReadyToPick';
      const StoringCode = 'GHN-PC952A';
      const NewDate = 0;
      const Log = 'GHN-PC952A|NGƯỜI GỬI HẸN LẠI NGÀY LẤY(5/8/2017)';
      infos = { StoringCode, NewDate, Log };
    } 
    this.updateOrder(order, status, infos);
  }

  updateOrder(order, status, infos = {}) {
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
      ClientHubID,
      ...infos 
    });
  }
  renderOrder(order) {
    const { 
      OrderCode, RecipientName, RecipientPhone, ServiceCost, 
      Height, Width, Weight, Length, CurrentStatus
    } = order;

    let rightText;
    let doneStatus;
    let failStatus;
    let disabled;
    let backgroundColor = '#fff';
    if (this.pickGroup.PickDeliveryType === 1) {
      rightText = 'ĐÃ LẤY';
      doneStatus = 'Storing';
      failStatus = 'ReadyToPick';
      disabled = CurrentStatus !== 'Picking';
    } else if (this.pickGroup.PickDeliveryType === 3) {
      rightText = 'ĐÃ TRẢ';
      doneStatus = 'Returned';
      failStatus = 'Storing';
      disabled = CurrentStatus !== 'Returning';
    }

    if (disabled) backgroundColor = '#bbb';
    
    return (
      <View style={{ padding: 5, backgroundColor }}>
        <Text>{OrderCode}</Text>
        <Text>{RecipientName} - {RecipientPhone}</Text>
        <Text>{Weight} g|{Length}-{Width}-{Height} (cm3)</Text>
        <Text>Tiền thu: {ServiceCost} đ</Text>
        <Item>
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={this.updateOrderToFail.bind(this, order)}
            isChecked={CurrentStatus === failStatus}
            rightText="LỖI" 
          /> 
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={this.updateOrderToDone.bind(this, order)}
            isChecked={CurrentStatus === doneStatus}
            rightText={rightText} 
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
