import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { 
  Content, ActionSheet, List
} from 'native-base';
import { CheckBox, SearchBar } from 'react-native-elements';
import { updateOrderStatus } from '../../actions';
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
  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;
  order = {};
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    console.log('====================================');
    console.log('PickGroupDetail: cwm is called. pickgroup = ');
    console.log(this.props.navigation.state.params.pickGroup);
    console.log('====================================');    
    
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
    if (this.PickDeliveryType === 1) {
      this.buttons = Object.values(PickErrors);
      this.buttons.push('Cancel');
      this.codes = Object.keys(PickErrors);
      this.cancelIndex = this.buttons.length - 1;
      this.changeDateIndex = 0;
    } else {
      this.buttons = Object.values(ReturnErrors);
      this.buttons.push('Cancel');
      this.codes = Object.keys(ReturnErrors);
      this.cancelIndex = this.buttons.length - 1;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('DeliveryByGroup cwrp');
    const { keyword } = nextProps;
    this.setState({ keyword });
  }
  
  updateOrderToDone(order) {
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;

    let status = null;
    if (this.PickDeliveryType === 3) status = 'Returned';
    if (this.PickDeliveryType === 1) status = 'Storing';
    this.updateOrder(order, status);
  }

  updateOrderToFailWithReason(order) {
    this.order = order;
    ActionSheet.show(
      {
        options: this.buttons,
        cancelButtonIndex: this.cancelIndex,
        destructiveButtonIndex: this.destructiveIndex,
        title: 'Chọn lý do giao lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${typeof buttonIndex}${typeof this.changeDateIndex}`);

        if (buttonIndex != this.cancelIndex 
          && buttonIndex != this.changeDateIndex 
          && buttonIndex != this.destructiveIndex) {
          this.updateOrderToFail(order, buttonIndex);
        } else if (buttonIndex == this.changeDateIndex) {
          console.log('Hien modal popup');
          this.setState({ modalShow: true, buttonIndex });
        }
      }
    );
  }

  updateOrderToFail(order, buttonIndex, NewDate = 0) {
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
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
            
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{CODAmount} đ</Text>
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
          onPress={this.updateOrderToDone.bind(this, order)}
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
    console.log(pickGroup);
    console.log('====================================');

    return (
      
      <Content style={{ backgroundColor: Colors.background }}>
        <DataEmptyCheck
          data={orders}
          message='Không có dữ liệu'
        >
          <List
            dataArray={orders}
            renderRow={this.renderOrder.bind(this)}
          />
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

const mapStateToProps = ({ auth, pd }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  return { sessionToken, pdsId, pds, loading };
};


export default connect(mapStateToProps, { updateOrderStatus })(PickGroupDetail);
