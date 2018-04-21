import React, { Component } from 'react';
import { View, Alert, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ActionSheet
} from 'native-base';
import { updateOrderStatus, getConfiguration, getOrderHistory } from '../actions';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import FormButton from '../components/FormButton';
import LogoButton from '../components/LogoButton';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import { getDeliveryDoneOrderInfo, getDeliveryFailOrderInfo, updateOrderToFailWithReason2 } from './Helper';

let order = null;
let code = null;
class DeliveryOrderScreen extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false }
  componentWillMount() {
    code = this.props.navigation.state.params.code;
    order = Utils.getOrder(this.props.db, code, 2);
    this.props.getOrderHistory(code);
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.db != nextProps.db) {
      const newOrder = Utils.getOrder(nextProps.db, code, 2);
      if (order.status !== newOrder.status) {
        this.props.navigation.goBack();
      }
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
    updateOrderToFailWithReason2(order.receiverPhone, this.props.configuration, order.code)
    .then(({ error, buttonIndex }) => {
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
    const { 
      receiverName, receiverPhone, deliveryAddress, moneyCollect,
      clientName, contactPhone, requiredNote,
      displayOrder, soNote
    } = order;

    const historyString = Utils.getHistoryString(this.props.orderHistory[code]);

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
            <Title>[{displayOrder}] {code}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
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
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                  onPress={() => Utils.phoneCall(receiverPhone, true)}
                >
                  <Text>{receiverPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowLastStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{deliveryAddress}</Text>
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
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                  onPress={() => Utils.phoneCall(contactPhone, true)}
                >
                  <Text>{contactPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{soNote}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{historyString}</Text>
              </View>
            </View>
            <View style={Styles.rowLastStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú xem hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{requiredNote}</Text>
            </View>
          </List>

          {this.renderButtons()}
          <ActionModal
            visible={this.state.modalShow}
            onChooseDate={this.onChooseDate.bind(this)}
            onCancelDate={this.onCancelDate.bind(this)} 
          />
        </Content>
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
  { updateOrderStatus, getConfiguration, getOrderHistory }
)(DeliveryOrderScreen);
