import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Platform, Button as RNButton } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, Footer 
} from 'native-base';

import { updateOrderInfo, getOrderHistory, getOrdersInfo } from '../actions';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import ICO from 'react-native-vector-icons/Ionicons';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
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
import OrderDimension from './OrderDimension';


class PickOrderScreen extends Component {
  state = { modalShow: false }

  componentWillMount() {
    clientId = this.props.navigation.state.params.clientId;
    senderHubId = this.props.navigation.state.params.senderHubId;
    this.orderCode = this.props.navigation.state.params.orderCode;

    this.type = this.props.navigation.state.params.type;
    this.order = Utils.getOrder(this.props.db, this.orderCode, this.type);
    if (this.type === 'PICK') this.props.getOrdersInfo([this.orderCode]);
    this.props.getOrderHistory(this.orderCode);
    console.log('PickOrderScreen mount ', this.order);
  }

  componentWillReceiveProps(nextProps) {
    const { db, dimensionError } = nextProps;

    if (dimensionError && dimensionError !== this.props.dimensionError) {
      this.setState({ dimensionError })
    }

    const newOrder = Utils.getOrder(db, this.orderCode, this.type);
    if (this.order.dimemsionUpdated !== newOrder.dimemsionUpdated) {
      this.popupDialogIn.dismiss();
      this.popupDialogLast.show();
    }
    this.order = newOrder;
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
    const OrderInfos = getUpdateOrderInfoForDone(this.order);
    this.props.updateOrderInfo(this.orderCode, this.type, OrderInfos);
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getUpdateOrderInfo(this.order, buttonIndex, NewDate);
    this.props.updateOrderInfo(this.orderCode, this.type, OrderInfos);
  }

  updateOrderToFailWithReason() {
    ActionLog.log(ActionLogCode.ORDER_PICK_FALSE, this.props.navigation);
    const order = this.order;
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
    const order = this.order;
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

  updateDimension(orderCode, done, dimemsionUpdated) {
    if (done) {
      Alert.alert(
        'Thông báo',
        'Không thể cập nhật kích thước. Đơn đã hoàn thành.',
        [
          
          { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return;
    }

    if (dimemsionUpdated) {
      Alert.alert(
        'Thông báo',
        'Không thể cập nhật. Đơn hàng đã cập nhật thông tin kích thước khối lượng.',
        [
          
          { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return;
    }
    this.popupDialogOut.show();
  }

  renderNotice(collectAmount, paymentTypeId, isFeeVisible) {
    if (collectAmount > 0 || isFeeVisible == false) return null;

    if (paymentTypeId == 2 ) {
      return (<Text style={{ fontWeight: 'bold' }}>Cước phí phát sinh đã tính vào tổng thu người nhận</Text>);
    } else if (paymentTypeId == 4 || paymentTypeId == 5) {
      return (<Text style={{ fontWeight: 'bold' }}>Cước phí phát sinh đã được tính vào Ví / Công nợ của Khách hàng.</Text>);
    }
    return null;
  }
  
  
  render() {
    const { navigate } = this.props.navigation;
    const order = this.order;
    if (!order) {
      this.goBack();
      return this.renderNullData();
    }
    const orderCode = this.orderCode;
    const history = this.props.orderHistory[orderCode];
    const historyString = Utils.getHistoryString(history);
    
    const { 
      receiverName, receiverPhone, externalCode,
      serviceName, width, height,
      collectAmount, weight, length, paymentTypeId,
      receiverAddress, clientRequiredNote, done, dimemsionUpdated
    } = order;

    const { isFeeVisible, oldServiceFee, newServiceFee } = this.state

    const diffFee = newServiceFee - oldServiceFee;

    const editSizeBgColor = (done || dimemsionUpdated) ? 'grey' : Colors.theme;
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
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu người gửi</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(collectAmount)} đ</Text>
              </View>

              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Khối lượng và kích thước</Text>
                <TouchableOpacity
                  style={{ backgroundColor: editSizeBgColor, borderRadius: 2 }}
                  onPress={this.updateDimension.bind(this, orderCode, done, dimemsionUpdated)}
                >
                  <IC name="pencil" size={20} color='white' />
                </TouchableOpacity>
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
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Khối lượng quy đổi</Text>
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
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{clientRequiredNote}</Text>
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
        {/* <LoadingSpinner loading={this.props.loading} /> */}
        <ActionModal
          visible={this.state.modalShow}
          onChooseDate={this.onChooseDate.bind(this)}
          onCancelDate={this.onCancelDate.bind(this)}
        />
        <PopupDialog
          ref={(popupDialog) => { this.popupDialogIn = popupDialog; }}
          containerStyle={{ zIndex: 10, elevation: 10 }}
          dialogStyle={{ top: - 44 }}
          width={0.94}
          height={isFeeVisible ? 520 : 400}
          dialogTitle={<DialogTitle title="Xác nhận thông tin" />}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16 }}>
              <Text style={{ color: 'red' }}>Chỉ bấm xác nhận khi KH đồng ý thông tin thay đổi này đã đúng với hàng thực tế</Text>
              <View style={{ paddingTop: 12, paddingBottom: 4 }}>
                <Text style={{ width: 158, fontWeight: 'bold' }}>KHỐI LƯỢNG CŨ</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                <Text style={{ width: 158 }}>Khối lượng</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>{accounting.formatNumber(weight)}</Text> gr</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                <Text style={{ width: 158 }}>Kích thước (DxRxC)</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>{length}</Text>x<Text style={{ fontWeight: 'bold' }}>{width}</Text>x<Text style={{ fontWeight: 'bold' }}>{height}</Text> cm3</Text>
              </View>
              
              <View style={{ paddingTop: 12, paddingBottom: 4 }}>
                <Text style={{ width: 158, fontWeight: 'bold' }}>KHỐI LƯỢNG MỚI</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                <Text style={{ width: 158 }}>Khối lượng</Text>
                <Text><Text style={{ fontWeight: 'bold', color: '#25a837' }}>{accounting.formatNumber(this.state.weight)}</Text> gr</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                <Text style={{ width: 158 }}>Kích thước (DxRxC)</Text>
                <Text><Text style={{ fontWeight: 'bold', color: '#25a837' }}>{this.state.length}</Text>x<Text style={{ fontWeight: 'bold', color: '#25a837' }}>{this.state.width}</Text>x<Text style={{ fontWeight: 'bold', color: '#25a837' }}>{this.state.height}</Text> cm3</Text>
              </View>
              
              { isFeeVisible === true || isFeeVisible === undefined ?
              <View>
                <View style={{ flexDirection: 'row', paddingTop: 8, borderBottomWidth: 1, borderBottomColor: '#E7E8E9' }} />
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                  <Text style={{ width: 158 }}>Cước phí cũ</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>{accounting.formatNumber(oldServiceFee)}</Text> vnđ</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                  <Text style={{ width: 158 }}>Cước phí mới</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>{accounting.formatNumber(newServiceFee)}</Text> vnđ</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingTop: 12 }}>
                  <Text style={{ width: 158 }}>Chênh lệch</Text>
                  <Text><Text style={{ fontWeight: 'bold', color: diffFee > 0 ? '#25a837' : '#f6411d' }}>{accounting.formatNumber(diffFee)}</Text> vnđ</Text>
                </View>
              </View>
              : null}
              <Text numberOfLines={2} style={{ color: 'red', paddingTop: 8 }}>{this.state.dimensionError}</Text>
            </View>
            
            <View
              style={{ flexDirection: 'row', borderTopColor: '#E7E8E9', borderTopWidth: 1, marginBottom: 2 }}
            >
              <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRightWidth: 1, borderRightColor: '#E7E8E9' }}>
                <RNButton
                  onPress={() => this.popupDialogIn.dismiss()}
                  title='Huỷ'
                  color='#057AFF'
                />
              </View>
              <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
                <RNButton
                  onPress={() => this.od.onSaveWeightSize()}
                  title='Xác nhận'
                  color='#057AFF'
                />
              </View>
            </View>
          </View>
        </PopupDialog>

        <PopupDialog
          ref={(popupDialog) => { this.popupDialogLast = popupDialog; }}
          containerStyle={{ zIndex: 10, elevation: 10 }}
          width={0.94}
          height={230}
          dialogTitle={<DialogTitle title="Phải thu người gởi" />}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ padding: 16, alignItems: 'center'}}>
              <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'baseline' }}>
                <Text style={{ color: collectAmount > 0 ? '#25a837' : '#f6411d', fontSize: 32 }}>{accounting.formatNumber(collectAmount)}</Text>
                <Text style={{ textAlignVertical: 'center' }}> vnđ</Text>
              </View>           
              {this.renderNotice(collectAmount, paymentTypeId, isFeeVisible)}
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1, marginBottom: 2 }}
            >
              <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
                <RNButton
                  onPress={() => this.popupDialogLast.dismiss()}
                  title='Đóng'
                  color='#057AFF'
                />
              </View>
            </View>
          </View>
        </PopupDialog>
        
        <PopupDialog
          ref={(popupDialog) => { this.popupDialogOut = popupDialog; }}
          containerStyle={{ zIndex: 10, elevation: 10 }}
          dialogStyle={{ top: - 32 }}
          width={0.94}
          height={388}
          dialogTitle={<DialogTitle title="Cập nhật thông tin" />}
          
        >
          <OrderDimension 
            myFunc={(ref) => { this.od = ref }} 
            popupDialogIn={this.popupDialogIn} 
            parent={this} 
            popupDialogOut={this.popupDialogOut} 
            orderCode={orderCode} />
        </PopupDialog>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth, other } = state;
  const { sessionToken } = auth;
  const { tripCode, loading, dimensionError } = pd;
  const { orderHistory } = other;
  const db = getOrders(state);
  return { db, tripCode, sessionToken, loading, orderHistory, dimensionError };
};


export default connect(
  mapStateToProps, 
  { updateOrderInfo, getOrderHistory, getOrdersInfo }
)(PickOrderScreen);
