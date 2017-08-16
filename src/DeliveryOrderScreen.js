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
import { Styles } from './Styles';

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
              block 
              style={{ backgroundColor: '#06B2F5' }}
              small
              onPress={this.updateOrderToFailWithReason.bind(this, order)}
            >
              <Text>GIAO LỖI</Text>
            </Button>
          </Col>
          <Col style={{ margin: 2 }}>
          <Button 
            block 
            style={{ backgroundColor: '#06B2F5' }}
            small
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
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
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
          <List style={{ backgroundColor: 'white' }}>
            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Thông tin khách hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Tên khách hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{RecipientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Số điện thoại</Text>
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                  onPress={() => phonecall(RecipientPhone, true)}
                >
                  <Text>{RecipientPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Address}</Text>
            </View>
            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Thông tin đơn hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Tổng thu</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{CODAmount}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Nhà cung cấp</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ClientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>SĐT NCC</Text>
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                >
                  <Text>{ContactPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Ghi chú đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Note}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColor]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Log}</Text>
              </View>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Ghi chú xem hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{RequiredNote}</Text>
            </View>
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
