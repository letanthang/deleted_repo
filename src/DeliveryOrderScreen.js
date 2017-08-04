import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem, ActionSheet 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from './actions';
import Utils from './libs/Utils';
import LoadingSpinner from './components/LoadingSpinner';

const BUTTONS = ['KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG', 'KHÁCH ĐỔI Khong nghe may', 'Khach huy don giao', 'Cancel'];
const DESTRUCTIVE_INDEX = -1;
const CANCEL_INDEX = 3;

class DeliveryOrderScreen extends Component {

  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`DeliveryOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = deliveryList.find(o => o.OrderID === OrderID);
    console.log('====================================');
    console.log('DeliveryOrderScreen cdu');
    console.log(order);
    console.log('====================================');
  }

  updateOrderToDone(order) {
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Delivered';
    this.props.updateOrderStatus({ 
      sessionToken, pdsId, PickDeliverySessionDetailID, OrderID, PickDeliveryType, status 
    });
  }

  updateOrderToFailWithReason(order) {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Chọn lý do giao lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${buttonIndex}`);
        if (buttonIndex !== CANCEL_INDEX && buttonIndex !== DESTRUCTIVE_INDEX) {
          this.updateOrderToFail(order, BUTTONS[buttonIndex]);
        }
      }
    );
  }

  updateOrderToFail(order, reason) {
    console.log(`giao loi pressed with reason ${reason}`);
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Storing';
    const StoringCode = 'GHN-SC9649';
    const NewDate = 0;
    const Log = 'GHN-SC9649|KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG';
    this.props.updateOrderStatus({ 
      sessionToken, 
      pdsId, 
      PickDeliverySessionDetailID, 
      OrderID, 
      PickDeliveryType, 
      status,
      StoringCode,
      NewDate,
      Log 
    });
  }
  
  renderButtons(order, currentStatus) {
    const displayStatus = Utils.getDisplayStatus(currentStatus);

    if (displayStatus === 'Đang giao') {
      return (
        <Grid>
          <Col style={{ margin: 2 }}>
            <Button 
              block style={{ backgroundColor: '#06B2F5' }}
              onPress={this.updateOrderToFailWithReason.bind(this, order)}
            >
              <Text>GIAO LỖI</Text>
            </Button>
          </Col>
          <Col style={{ margin: 2 }}>
          <Button 
            block style={{ backgroundColor: '#06B2F5' }}
            onPress={this.updateOrderToDone.bind(this, order)}
          >
            <Text>ĐÃ GIAO</Text>
            </Button>
          </Col>
        </Grid>
      );
    }

    return this.renderDisabledButtons();
  }

  renderDisabledButtons() {
    return (
      <Grid>
        <Col style={{ margin: 2 }}>
          <Button block disabled style={{ backgroundColor: '#aaa' }}>
          <Text>GIAO LỖI</Text>
          </Button>
        </Col>
        <Col style={{ margin: 2 }}>
        <Button block disabled style={{ backgroundColor: '#aaa' }}>
          <Text>ĐÃ GIAO</Text>
          </Button>
        </Col>
      </Grid>
    );
  }

  
  render() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = deliveryList.find(o => o.OrderID === OrderID);

    const { navigate, goBack } = this.props.navigation;
    const { 
      RecipientName, RecipientPhone, Address, CODAmount,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      DisplayOrder, Note, Log, CurrentStatus, NextStatus
    } = order;

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
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body style={{ flex: 3 }}>
            <Title>[{DisplayOrder}] {OrderCode}</Title>
          </Body>
          <Right>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Thông tin khách hàng</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Tên khách hàng</Text>
              </Left>
              <Right>
                <Text>{RecipientName}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Số điện thoại</Text>
              </Left>
              <Right style={{ flex: 2 }}>
                <Button
                  transparent
                  iconRight
                  onPress={() => phonecall(RecipientPhone, true)}
                >
                  <Text>{RecipientPhone}</Text>
                  <Icon name='call' />
                </Button>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Địa chỉ</Text>
              </Left>
              <Right style={{ flex: 2 }}>
                <Text>{Address}</Text>
              </Right>
            </ListItem>
            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Thông tin đơn hàng</Text>
            </ListItem>
            <ListItem>
              <Left><Text>Tổng thu</Text></Left>
              <Right><Text>{CODAmount}</Text></Right>
            </ListItem>
            <ListItem>
              <Left><Text>Nhà cung cấp</Text></Left>
              <Right style={{ flex: 2 }}><Text>{ClientName}</Text></Right>
            </ListItem>
            <ListItem>
              <Left><Text>SĐT NCC</Text></Left>
              <Right style={{ flex: 2 }}>
                <Button
                  transparent
                  iconRight
                >
                  <Text>{ContactPhone}</Text>
                  <Icon name='call' />
                </Button>
              </Right>
            </ListItem>
            <ListItem>
              <Left><Text>Ghi chú đơn hàng</Text></Left>
              <Right style={{ flex: 1 }}>
                <Text>{Note}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>Lịch sử đơn hàng</Text>
              <Text>{Log}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <Left><Text>Ghi chú xem hàng</Text></Left>
              <Right>
                <Text>{RequiredNote}</Text>
              </Right>
            </ListItem>
          </List>

          {this.renderButtons(order, CurrentStatus)}
        </Content>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
    );
  }
}

const mapStateToProps = ({ pd, auth }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  return { pds, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus }
)(DeliveryOrderScreen);
