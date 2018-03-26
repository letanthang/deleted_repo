import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List 
} from 'native-base';
import { updateOrderInfo, getConfiguration } from '../actions';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, OrderStyles, Colors } from '../Styles';
import DataEmptyCheck from '../components/DataEmptyCheck';
import LogoButton from '../components/LogoButton';
import FormButton from '../components/FormButton';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import { getUpdateOrderInfo, getUpdateOrderInfoForDone, updateOrderToFailWithReason2 } from '../components/Helpers';

let clientId = null;
let clientHubId = null;
let orderCode = null;
let order = {};
class PickOrderScreen extends Component {
  state = { modalShow: false }

  componentWillMount() {
    clientId = this.props.navigation.state.params.clientId;
    clientHubId = this.props.navigation.state.params.clientHubId;
    orderCode = this.props.navigation.state.params.orderCode;
    order = Utils.getOrder(this.props.db, orderCode, 1);
  }
  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    const { db } = nextProps;
    const newOrder = Utils.getOrder(db, orderCode, 1);
    if (order.currentStatus !== newOrder.currentStatus) {
      this.props.navigation.goBack();
    }
    order = newOrder;
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
    this.props.updateOrderInfo(order.orderCode, order.pickDeliveryType, OrderInfos);
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getUpdateOrderInfo(order, buttonIndex, NewDate);
    this.props.updateOrderInfo(order.orderCode, order.pickDeliveryType, OrderInfos);
  }

  updateOrderToFailWithReason() {
    updateOrderToFailWithReason2(order.contactPhone, this.props.configuration, order.orderCode)
    .then(({ error, buttonIndex }) => {
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
    const done = Utils.checkPickCompleteForUnsync(order);
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
    const { navigate, goBack } = this.props.navigation;
    if (!order) {
      goBack();
      return this.renderNullData();
    } 

    const { 
      recipientName, recipientPhone, ExternalCode,
      serviceName, width, height,
      senderPay, weight, length, serviceCost,
      log, deliveryAddress, soNote, requiredNote
    } = order;

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
            <Title>{orderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
            {/* <Button
              transparent
              onPress={() => navigate('POUpdateWeightSize', { orderCode, clientId, clientHubId })}
            >
              <Icon name="create" />
            </Button> */}
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
              <View style={Styles.rowStyle}> 
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã nhận hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ExternalCode || 'Không có'}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã đơn hàng shop</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ExternalCode || 'Không có'}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Gói dịch vụ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{serviceName}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu người gởi</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(senderPay)} đ</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Phí vận chuyển</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{serviceCost} đ</Text>
              </View>

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
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{recipientName}</Text>
              </View>
              <View style={Styles.rowStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Số điện thoại</Text>
                  <Button
                    transparent
                    iconRight
                    small
                    onPress={() => Utils.phoneCall(recipientPhone, true)}
                    style={{ paddingLeft: 0 }}
                  >
                    <Text>{recipientPhone}</Text>
                    <Icon name='call' />
                  </Button>
              </View>
              <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{deliveryAddress}</Text>
              </View>
              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Ghi chú</Text>
              </View>
              <View style={[Styles.rowStyle]}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{soNote}</Text>
              </View>
              <View style={[Styles.rowStyle]}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú xem hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{requiredNote}</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                <View>
                  <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{log}</Text>
                </View>
              </View>
            </List>
            {this.renderButtons()}
          </DataEmptyCheck>
        </Content>
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
  const { pd, auth } = state;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const db = getOrders(state);
  return { db, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderInfo, getConfiguration }
)(PickOrderScreen);
