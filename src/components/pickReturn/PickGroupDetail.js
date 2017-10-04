import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, Modal, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import * as Communications from 'react-native-communications';
import { 
  Content, ActionSheet, List, Button, Text as Txt
} from 'native-base';
import { updateOrderStatus, getConfiguration } from '../../actions';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import FormButton from '../FormButton';
import StatusText from '../StatusText';
import DatePicker from '../DatePicker';
import DataEmptyCheck from '../DataEmptyCheck';
import { PickErrors, ReturnErrors } from '../Constant';

class PickGroupDetail extends Component {
  state = { keyword: '', modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  buttons = null;
  codes = null;
  cancelIndex = null;
  destructiveIndex = -1;
  changeDateIndex = null;
  cannotContactIndex = null;
  cannotCallIndex = null;
  notHangUpIndex = null;
  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;
  order = {};
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    console.log('====================================');
    console.log('====================================');    
    
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
    if (this.PickDeliveryType === 1) {
      this.buttons = Object.values(PickErrors);
      this.buttons.push('Cancel');
      this.codes = Object.keys(PickErrors);
      this.cancelIndex = this.buttons.length - 1;
      this.changeDateIndex = 0;
      this.cannotContactIndex = 1;
      this.cannotCallIndex = 2;
      this.notHangUpIndex = 3;

    } else {
      this.buttons = Object.values(ReturnErrors);
      this.buttons.push('Cancel');
      this.codes = Object.keys(ReturnErrors);
      this.cancelIndex = this.buttons.length - 1;
      this.cannotContactIndex = 0;
      this.cannotCallIndex = 3;
      this.notHangUpIndex = 1;
    }
  }

  componentDidMount() {
    console.log('PickgGroupDetail cdm');
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    console.log('DeliveryByGroup cwrp');
    const { keyword } = nextProps;
    this.setState({ keyword });
  }

  alertMissOfCall(phoneNumber) {
    console.log(phoneNumber);
    const title = 'Không đủ số cuộc gọi.';
    const message = 'Bạn không thực hiện đủ số cuộc gọi cho khách hàng. Gọi bây giờ?';
    Alert.alert(
      title,
      message,
      [
        { text: 'Gọi', onPress: () => Communications.phonecall(phoneNumber, true) },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  confirmUpdateOrderToDone(order) {
    const message = order === null ? 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang đã lấy?' : '';
    const title = order === null ? 'Cập nhật đồng loạt đơn hàng thành đã lấy ?' : 'Cập nhật đơn hàng thành đã lấy ?';
    Alert.alert(
      title,
      message,
      [
        { text: 'Đồng ý', onPress: () => this.updateOrderToDone(order) },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  confirmUpdateOrderToFail() {
    const message = 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang lỗi?';
    Alert.alert(
      'Cập nhật đồng loạt đơn hàng thành lấy lỗi?',
      message,
      [
        { text: 'Đồng ý', onPress: () => this.updateOrderToFailWithReason(null) },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }
  
  updateOrderToDone(order) {
    if (order !== null) {
      if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
      
      let status = null;
      if (this.PickDeliveryType === 3) status = 'Returned';
      if (this.PickDeliveryType === 1) status = 'Storing';
      this.updateOrder(order, status);
    } else {
      const { pds } = this.props;
      const Items = this.PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
      const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
      const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === false && this.checkKeywork(o));
      if (orders.length === 0) return;

      let status = null;
      if (this.PickDeliveryType === 3) status = 'Returned';
      if (this.PickDeliveryType === 1) status = 'Storing';
      this.updateOrders(orders, status);
    }
    
  }

  updateOrderToFailWithReason(order) {
    console.log('updateOrderToFailWithReason pressed');
    this.order = order;
    ActionSheet.show(
      {
        options: this.buttons,
        cancelButtonIndex: this.cancelIndex,
        destructiveButtonIndex: this.destructiveIndex,
        title: 'Chọn lý do lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${typeof buttonIndex}${typeof this.changeDateIndex}`);

        if (buttonIndex == this.changeDateIndex) {
          console.log('Hien modal popup');
          this.setState({ modalShow: true, buttonIndex });
        } else if (buttonIndex == this.cannotCallIndex || buttonIndex == this.cannotContactIndex) {
          //cannot contact
          Utils.validateCallCannotContact(this.pickGroup.ContactPhone, this.props.configuration)
            .then((result) => {
              console.log(result);
              if (result) { 
                this.updateOrderToFail(order, buttonIndex); 
              } else {
                this.alertMissOfCall(this.pickGroup.ContactPhone);
              } 
            });
        } else if (buttonIndex == this.notHangUpIndex) {
          console.log(this.pickGroup.ContactPhone);
          //cannot contact
          Utils.validateCallNotHangUp(this.pickGroup.ContactPhone, this.props.configuration)
            .then((result) => {
              console.log(result);
              if (result) { 
                this.updateOrderToFail(order, buttonIndex); 
              } else {
                this.alertMissOfCall(this.pickGroup.ContactPhone);
              }
            });
        } else {
          this.updateOrderToFail(order, buttonIndex);
        }
      }
    );
  }

  updateOrderToFail(order, buttonIndex, NewDate = 0) {
    let orders = null;
    if (order !== null) {
      if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
    } else {
      const { pds } = this.props;
      const Items = this.PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
      const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
      orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === false && this.checkKeywork(o));
      
      if (orders.length === 0) return;
    }
    
    const StoringCode = this.codes[buttonIndex]; 
    const reason = this.buttons[buttonIndex];
    const Log = `${StoringCode}|${reason}`;

    let status = null;
    let infos = {};
    if (this.PickDeliveryType === 3) {
      status = 'Return';
      infos = { StoringCode, NewDate, Log };
    } 
    if (this.PickDeliveryType === 1) {
      status = 'ReadyToPick';     
      infos = { StoringCode, NewDate, Log };
    } 
    if (order !== null) {
      this.updateOrder(order, status, infos);
    } else {
      this.updateOrders(orders, status, infos);
    }
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
  updateOrders(orders, status, infos = {}) {
    console.log('updateOrders: update dong loat');
    const { pickGroup, ClientHubID } = this;
    const { sessionToken, pdsId } = this.props;
    const { PickDeliveryType } = pickGroup;
    console.log(`updateOrders to status : ${status} | pdsId ${pdsId} | ClientHubID ${ClientHubID}`);
    console.log(orders);
    const ordersInfo = _.map(orders, (item) => {
      const { OrderID, PickDeliverySessionDetailID } = item;
      return { OrderID, PickDeliverySessionDetailID };
    });
    console.log(ordersInfo);

    this.props.updateOrderStatus({ 
      sessionToken,
      pdsId,
      PickDeliverySessionDetailID: null, 
      OrderID: ordersInfo, 
      PickDeliveryType, 
      status,
      ClientHubID,
      ...infos 
    });
  }
  onOrderPress(order) {
    console.log(`onOrderPress called with type = ${this.pickGroup.PickDeliveryType}, order=`);
    console.log(order);
    const { navigate } = this.props.navigation;
    const { OrderID } = order;
    const { ClientID, ClientHubID } = this.pickGroup;
    
    if (this.PickDeliveryType === 1) {
      navigate('PickOrder', { OrderID, order, ClientID, ClientHubID });
    } else if (this.PickDeliveryType === 3) {
      navigate('ReturnOrder', { OrderID, order, ClientHubID });
    }
  }
  renderInfosForPick({ Weight, Length, Width, Height }) {
    if (this.PickDeliveryType === 3) return null;
    return (
      <View>
        <View style={Styles.itemStyle}>
          <Text style={Styles.weakColorStyle}>{Weight} g | {Length}-{Width}-{Height} (cm3)</Text>
        </View>
      </View>
    );
  }
  renderOrder(order) {
    const { 
      OrderCode, RecipientName, RecipientPhone,
      Height, Width, Weight, Length, CurrentStatus, NextStatus,
      ExternalCode, CODAmount
    } = order;
    const PickDeliveryType = this.PickDeliveryType;

    let rightText;
    let doneStatus;
    let failStatus;
    let done;
    let fail;
    let disabled;
    const DisplayStatus = Utils.getDisplayStatus(CurrentStatus, PickDeliveryType, NextStatus);
    const StatusColor = Utils.getDisplayStatusColor(CurrentStatus, PickDeliveryType, NextStatus);
    if (PickDeliveryType === 1) {
      rightText = 'LẤY';
      doneStatus = 'Storing';
      failStatus = 'ReadyToPick';
      fail = CurrentStatus === failStatus;
      done = Utils.checkPickDone(CurrentStatus);
      disabled = CurrentStatus !== 'Picking';
    } else if (PickDeliveryType === 3) {
      rightText = 'TRẢ';
      doneStatus = 'Returned';
      failStatus = 'Storing';
      fail = Utils.checkReturnFail(CurrentStatus, NextStatus);
      done = Utils.checkReturnDone(CurrentStatus);
      disabled = CurrentStatus !== 'Returning';
    }

    console.log(`OrderCode: ${OrderCode} | CurrentStatus: ${CurrentStatus} | doneStatus ${doneStatus}`);
    
    return (
      <TouchableOpacity
        onPress={this.onOrderPress.bind(this, order)}
      >
        <View style={[Styles.orderWrapperStyle]}>
          <View style={Styles.item2Style}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{OrderCode}</Text>
              <StatusText text={DisplayStatus} colorTheme={StatusColor} style={{ marginLeft: 10 }} show={disabled} />
            </View>
            
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(CODAmount)} đ</Text>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {ExternalCode}</Text>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={Styles.weakColorStyle}>Nhận: {RecipientName} - {RecipientPhone}</Text>
          </View>
          
          {this.renderInfosForPick({ Weight, Length, Width, Height })}
          
          {this.renderActionButtons(disabled, rightText, order)}
          
        </View>
      </TouchableOpacity>
    );
  }
  renderActionButtons(disabled, rightText, order) {
    if (disabled) return null;
    return (
      <View style={[Styles.itemStyle, Styles.actionItemStyle]}>
        <FormButton
          disabled={disabled}
          theme='danger'
          text='LỖI'
          width={100}
          onPress={this.updateOrderToFailWithReason.bind(this, order)}
        />
        <FormButton
          disabled={disabled}
          theme='success'
          text={rightText}
          width={100}
          onPress={this.confirmUpdateOrderToDone.bind(this, order)}
        />
      </View>
    );
  }

  checkComplete({ CurrentStatus, PickDeliveryType }) {
    if (PickDeliveryType === 1) {
      return Utils.checkPickComplete(CurrentStatus);
    } else {
      return Utils.checkReturnComplete(CurrentStatus);
    }
  }
  checkKeywork({ OrderCode }) {
    return this.state.keyword === '' || OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase());
  }

  render() {
    const { done, pds } = this.props;
    const Items = this.PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === done && this.checkKeywork(o));

    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log('====================================');

    return (
      
      <Content style={{ backgroundColor: Colors.background }}>

        <DataEmptyCheck
          data={orders}
          message='Không có dữ liệu'
        >
          <View>
          <List
            dataArray={orders}
            renderRow={this.renderOrder.bind(this)}
          />
          {this.renderMassUpdateButton(done)}
          </View>
          
        </DataEmptyCheck>
       
        <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalShow}
            onShow={() => this.setState({ androidDPShow: true })}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
          >
            <View 
              style={{ 
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#000000aa'
              }}
            >
              <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 10 }} >
                <Text
                  style={{ alignSelf: 'center', color: 'black', fontWeight: 'bold', margin: 20 }}
                >
                  Chọn ngày
                </Text>
                <DatePicker
                  date={this.state.date}
                  androidDPShow={this.state.androidDPShow}
                  mode='date'
                  onDateChange={(date) => {
                    this.setState({ date });
                    console.log(`date changed to : ${date}`);
                    }}
                />
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
                >
                    <Btn
                      onPress={this.onChooseDate.bind(this)}
                      title='ĐỒNG Ý'
                      color='#057AFF'
                    />
                </View>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
                >
                    <Btn
                      onPress={this.onCancelDate.bind(this)}
                      title='HUỶ'
                      color='#057AFF'
                    />
                </View>
              </View>
            </View>
          </Modal>
      </Content>
    );
  }
  renderMassUpdateButton(done) {
    if (done) return null;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 8 }}>
          <Button
            rounded
            onPress={() => this.confirmUpdateOrderToFail(null)}
          >
            <Txt>
              Tất cả lỗi
            </Txt>
          </Button>
          <Button
            rounded
            onPress={() => this.confirmUpdateOrderToDone(null)}
          >
            <Txt>
              Tất cả lấy
            </Txt>
          </Button>
        </View>
    );
  }
  onChooseDate() {
    const date = this.state.date;
    //string
    const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    console.log(stringDate);
    //timestamp
    const timestamp = this.state.date.getTime();
    this.updateOrderToFail(this.order, this.state.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow, buttonIndex: null, androidDPShow: false });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow, date: new Date(), androidDPShow: false });
  }
}

const mapStateToProps = ({ auth, pd, other }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  const { configuration } = other;
  return { sessionToken, pdsId, pds, loading, configuration };
};


export default connect(mapStateToProps, { updateOrderStatus, getConfiguration })(PickGroupDetail);
