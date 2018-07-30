import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, Footer 
} from 'native-base';

import { updateOrderInfo, getOrderHistory } from '../actions';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import ICO from 'react-native-vector-icons/Ionicons';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, OrderStyles, Colors } from '../Styles';
import DataEmptyCheck from '../components/DataEmptyCheck';
import LogoButton from '../components/LogoButton';
import FormButton from '../components/FormButton';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import { getUpdateOrderInfo, getUpdateOrderInfoForDone, updateOrderToFailWithReason2, codes } from '../components/Helpers';
import { ActionLogCode, ErrorToLogCode } from '../components/Constant';
import ActionLog from '../libs/ActionLog';

let clientId = null;
let senderHubId = null;
let orderCode = null;
let order = {};
class PickOrderScreen extends Component {
  state = { modalShow: false }

  componentWillMount() {
    clientId = this.props.navigation.state.params.clientId;
    senderHubId = this.props.navigation.state.params.senderHubId;
    orderCode = this.props.navigation.state.params.orderCode;
    order = Utils.getOrder(this.props.db, orderCode, 'PICK');
    this.props.getOrderHistory(orderCode);
    console.log('PickOrderScreen mount ', order);
  }

  componentWillReceiveProps(nextProps) {
    const { db } = nextProps;
    const newOrder = Utils.getOrder(db, orderCode, 'PICK');
    if (order.status !== newOrder.status) {
      this.goBack()
    }
    order = newOrder;
  }
  goBack() {
    this.props.navigation.goBack();
    if (this.props.navigation.state.params.refresh) {
      this.props.navigation.state.params.refresh();
    }
  }

  componentDidUpdate() {
  }
  onChooseDate(date) {
    //string
    // const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    //timestamp
    const timestamp = date.getTime();
    this.updateOrderToFail(this.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  confirmUpdateOrderToDone() {
    ActionLog.log(ActionLogCode.ORDER_PICK_TRUE, this.props.navigation);
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên sang đã lấy?';
    const title = 'Cập nhật đơn hàng thành đã lấy ?';
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
    const OrderInfos = getUpdateOrderInfoForDone(order);
    this.props.updateOrderInfo(order.orderCode, order.type, OrderInfos);
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getUpdateOrderInfo(order, buttonIndex, NewDate);
    this.props.updateOrderInfo(order.orderCode, order.type, OrderInfos);
  }

  updateOrderToFailWithReason() {
    ActionLog.log(ActionLogCode.ORDER_PICK_FALSE, this.props.navigation);
    updateOrderToFailWithReason2(order.senderPhone, this.props.configuration, order.orderCode)
    .then(({ error, buttonIndex }) => {

      const orderCode = codes[buttonIndex];
      const logCode = ErrorToLogCode[orderCode];
      if (logCode) {
        ActionLog.log(logCode, this.props.navigation);
      }

      if (error === null) {
        this.updateOrderToFail(buttonIndex);
      } else if (error === 'cancel') {
      } else if (error === 'moreCall') {
      } else if (error === 'chooseDate') {
        this.buttonIndex = buttonIndex;
        this.setState({ modalShow: true });
      }
    });
  }

  renderNullData() {
    return (
      <Container>
        <Header />
        <Content style={{ padding: 16 }}>
          <Body><Text>Đơn hàng không tồn tài</Text></Body>
        </Content>
      </Container>
    );
  }

  renderButtons() {
    const done = Utils.checkCompleteForUnsync(order);
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
            onPress={this.updateOrderToFailWithReason.bind(this)}
          />
        </View>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='success'
            disabled={done}
            text='Lấy'
            width={100}
            onPress={this.confirmUpdateOrderToDone.bind(this)}
          />
        </View>
      </View>
    );
  }
  
  render() {
    const { navigate } = this.props.navigation;
    if (!order) {
      this.goBack();
      return this.renderNullData();
    } 
    const history = this.props.orderHistory[orderCode];
    const historyString = Utils.getHistoryString(history);
    
    const { 
      receiverName, receiverPhone, externalCode,
      serviceName, width, height,
      moneyCollect, weight, length, serviceCost,
      receiverAddress, clientExtraNote, done,
    } = order;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => this.goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            <LogoButton dispatch={this.props.navigation.dispatch} />
          </View>
          </Left>
          <Body style={Styles.bodyStyle}>
            <Title>{orderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
            {/* { !done ?
            <Button
              transparent
              onPress={() => navigate('POUpdateWeightSize', { orderCode, clientId, senderHubId })}
            >
              <Icon name="create" />
            </Button>
            : null } */}
            {Platform.OS == 'android' ?
            <Button
              transparent
              onPress={() => navigate('OrderLabelNew', { orderCode })}
            >
              <IC name="printer" size={28} color="white" />
            </Button>
            : null}
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
          <DataEmptyCheck
            data={order}
            message='Không có dữ liệu'
          >
            <List>
              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Tổng quan</Text>
              </View>
              {/* <View style={Styles.rowStyle}> 
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã nhận hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{externalCode || 'Không có'}</Text>
              </View> */}
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã đơn hàng shop</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{externalCode || 'Không có'}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Gói dịch vụ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{serviceName}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu người gởi</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(moneyCollect)} đ</Text>
              </View>
              {/* <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Phí vận chuyển</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{serviceCost} đ</Text>
              </View> */}

              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Khối lượng và kích thước</Text>
              </View>
              <View style={Styles.rowStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Khối lượng</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{weight} g</Text>
              </View>
              <View style={Styles.rowStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Kích thước</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{length}cm x {width}cm x {height}cm</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Khối lượng qui đổi</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{length * width * height * 0.2} g</Text>
              </View>

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
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Ghi chú</Text>
              </View>
              <View style={[Styles.rowStyle]}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú khách hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{clientExtraNote}</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                <View>
                  <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{historyString}</Text>
                </View>
              </View>
            </List>
            
          </DataEmptyCheck>
        </Content>
        <Footer style={{ backgroundColor: 'transparent', borderTopWidth: 0, alignItems: 'center' }}>
          {this.renderButtons()}
        </Footer>
        <LoadingSpinner loading={this.props.loading} />
        <ActionModal
          visible={this.state.modalShow}
          onChooseDate={this.onChooseDate.bind(this)}
          onCancelDate={this.onCancelDate.bind(this)}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth, other } = state;
  const { sessionToken } = auth;
  const { tripCode, loading } = pd;
  const { orderHistory } = other;
  const db = getOrders(state);
  return { db, tripCode, sessionToken, loading, orderHistory };
};


export default connect(
  mapStateToProps, 
  { updateOrderInfo, getOrderHistory }
)(PickOrderScreen);
