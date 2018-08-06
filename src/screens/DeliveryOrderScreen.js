import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Button as Btn } from 'react-native';
import ICO from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ActionSheet, Footer
} from 'native-base';
import { updateOrderStatus, getConfiguration, getOrderHistory, fetchOrderDetail, updateOrderInfo } from '../actions';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import FormButton from '../components/FormButton';
import LogoButton from '../components/LogoButton';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import { getDeliveryDoneOrderInfo, getDeliveryFailOrderInfo, updateOrderToFailWithReason2, CODES } from './Helper';
import { ActionLogCode, ErrorToLogCode } from '../components/Constant';
import ActionLog from '../libs/ActionLog';


let order = null;
let orderCode = null;
class DeliveryOrderScreen extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false }
  componentWillMount() {
    orderCode = this.props.navigation.state.params.orderCode;
    order = Utils.getOrder(this.props.db, orderCode, 'DELIVER');
    if (order.hasDetail !== true) {
      this.props.fetchOrderDetail(orderCode, 'DELIVER');
    }
    this.props.getOrderHistory(orderCode);
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.db != nextProps.db) {
      const newOrder = Utils.getOrder(nextProps.db, orderCode, 'DELIVER');
      order = newOrder;
    }
  }

  onChooseDate(date) {
    //string
    // const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    //timestamp
    const timestamp = date.getTime();
    this.confirmUpdateOrderFail(this.buttonIndex, timestamp);
    //this.setState({ modalShow: !this.state.modalShow });
  }
  
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  confirmUpdateOrder() {
    ActionLog.log(ActionLogCode.ORDER_DELIVER_TRUE, this.props.navigation);
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên: Đã giao ?';
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrderToDone() }
      ],
      { cancelable: false }
    );
  }

  updateOrderToDone() {
    const OrderInfos = getDeliveryDoneOrderInfo(order);
    this.props.updateOrderInfo(orderCode, 'DELIVER', OrderInfos);
    this.props.updateOrderStatus({ OrderInfos });
  }

  confirmUpdateOrderFail(buttonIndex, NewDate = 0) {
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên: Giao lỗi ?';
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrderToFail(buttonIndex, NewDate) }
      ],
      { cancelable: false }
    );
  }
  updateOrderToFailWithReason() {
    ActionLog.log(ActionLogCode.ORDER_DELIVER_FALSE, this.props.navigation);

    updateOrderToFailWithReason2(order.receiverPhone, this.props.configuration, order.orderCode)
    .then(({ error, buttonIndex }) => {

      const errCode = CODES[buttonIndex];
          const logCode = ErrorToLogCode[errCode];
          if (logCode) {
            ActionLog.log(logCode, this.props.navigation);
          }

      if (error === null) {
        this.confirmUpdateOrderFail(buttonIndex);
      } else if (error === 'cancel') {
      } else if (error === 'moreCall') {
      } else if (error === 'chooseDate') {
        this.buttonIndex = buttonIndex;
        this.setState({ modalShow: true });
      }
    });
  }
  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getDeliveryFailOrderInfo(order, buttonIndex, NewDate);
    this.props.updateOrderInfo(orderCode, 'DELIVER', OrderInfos);
    this.props.updateOrderStatus({ OrderInfos });
    if (this.state.modalShow) this.setState({ modalShow: false });
  }
  
  renderButtons() {
    const done = order.done;
    if (done) {
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', margin: 8 }}
        >
          <OrderStatusText 
            order={order}
          />
        </View>
      );
    }
    return (
      <View style={{ paddingBottom: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='danger'
            disabled={done}
            text='Lỗi'
            width={100}
            onPress={() => this.updateOrderToFailWithReason()}
          />
        </View>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='success'
            disabled={done}
            text='Giao'
            width={100}
            onPress={() => this.confirmUpdateOrder()}
          />
        </View>
      </View>
    );
  }

  render() {

    const { goBack } = this.props.navigation;
    // remove displayOrder
    const { 
      receiverName, receiverPhone, receiverAddress, moneyCollect,
      clientName, senderPhone, clientRequiredNote, clientExtraNote,
      displayOrder,
    } = order;

    const historyString = Utils.getHistoryString(this.props.orderHistory[orderCode]);

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            <LogoButton dispatch={this.props.navigation.dispatch} />
            </View>
            
          </Left>
          <Body style={Styles.bodyStyle}>
            <Title>[{displayOrder}] {orderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
          </Right>
        </Header>
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <Content style={{ backgroundColor: Colors.row, paddingTop: 0 }}>
          <List>
            <View style={Styles.rowHeaderStyle}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Thông tin khách hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tên khách hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{receiverName}</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Số điện thoại</Text>
                <TouchableOpacity
                  onPress={() => Utils.phoneCall(receiverPhone, true)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ color: '#00b0ff', marginRight: 8 }}>{receiverPhone}</Text>
                  <ICO name='ios-call-outline' size={25} color='#006FFF' />
                </TouchableOpacity>
            </View>
            <View style={Styles.rowLastStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{receiverAddress}</Text>
            </View>
            <View style={Styles.rowHeaderStyle}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Thông tin đơn hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(moneyCollect)} đ</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Nhà cung cấp</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{clientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>SĐT NCC</Text>
              <TouchableOpacity
                onPress={() => Utils.phoneCall(senderPhone, true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: '#00b0ff', marginRight: 8 }}>{senderPhone}</Text>
                <ICO name='ios-call-outline' size={25} color='#006FFF' />
              </TouchableOpacity>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú khách hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{clientExtraNote}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{historyString}</Text>
              </View>
            </View>
            <View style={Styles.rowLastStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú bắt buộc</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{clientRequiredNote}</Text>
            </View>
          </List>
          <ActionModal
            visible={this.state.modalShow}
            onChooseDate={this.onChooseDate.bind(this)}
            onCancelDate={this.onCancelDate.bind(this)} 
          />
        </Content>
        <Footer style={{ backgroundColor: 'transparent', borderTopWidth: 0, alignItems: 'center' }}>
          {this.renderButtons()}
        </Footer>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth, config, other } = state;
  const { sessionToken } = auth;
  const { tripCode, loading } = pd;
  const { configuration } = config;
  const { orderHistory } = other;
  const db = getOrders(state);
  return { db, tripCode, sessionToken, loading, configuration, orderHistory };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus, getConfiguration, getOrderHistory, fetchOrderDetail, updateOrderInfo }
)(DeliveryOrderScreen);
