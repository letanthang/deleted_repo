import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { 
  Content, ActionSheet, List
} from 'native-base';
import { CheckBox, SearchBar } from 'react-native-elements';
import { updateOrderStatus } from '../../actions';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import FormButton from '../FormButton';

const BUTTONS = ['KHÁCH khong lien lac duoc', 'KHÁCH Khong nghe may', 'Khach huy don', 'Cancel'];
const DESTRUCTIVE_INDEX = -1;
const CANCEL_INDEX = 3;

class PickGroupDetail extends Component {
  state = { keyword: '' };
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    console.log('====================================');
    console.log('PickGroupDetail: cwm is called. pickgroup = ');
    console.log(this.props.navigation.state.params.pickGroup);
    console.log('====================================');    
    
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
  }

  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;

  componentWillReceiveProps(nextProps) {
    console.log('DeliveryByGroup cwrp');
    const { keyword } = nextProps;
    this.setState({ keyword });
  }
  
  updateOrderToDone(order) {
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Return') return;

    let status = null;
    if (this.pickGroup.PickDeliveryType === 3) status = 'WaitingToFinish';
    if (this.pickGroup.PickDeliveryType === 1) status = 'Storing';
    this.updateOrder(order, status);
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

  updateOrderToFail(order) {
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Return') return;

    let status = null;
    let infos = {};
    if (this.pickGroup.PickDeliveryType === 3) {
      status = 'Return';
      const StoringCode = 'GHN-RCD0D6';
      const NewDate = 0;
      const Log = 'GHN-RCD0D6|NGƯỜI GỬI KHÔNG NHẬN HÀNG TRẢ';
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
  onOrderPress(order) {
    console.log('onOrderPress called with type = ');
    console.log(this.pickGroup.PickDeliveryType);
    const { navigate } = this.props.navigation;
    const { OrderID } = order;
    const { ClientID } = this.pickGroup;

    if (this.pickGroup.PickDeliveryType === 1) {
      navigate('PickOrder', { OrderID, order, ClientID });
    } else if (this.pickGroup.PickDeliveryType === 3) {
      navigate('ReturnOrder', { OrderID, order });
    }
  }
  renderInfosForPick({ Weight, Length, Width, Height, ServiceCost, disabled }) {
    if (this.pickGroup.PickDeliveryType === 3) return null;
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
      OrderCode, RecipientName, RecipientPhone, ServiceCost, 
      Height, Width, Weight, Length, CurrentStatus, NextStatus,
      ExternalCode
    } = order;

    let rightText;
    let doneStatus;
    let failStatus;
    let done;
    let fail;
    let disabled;
    if (this.pickGroup.PickDeliveryType === 1) {
      rightText = 'LẤY';
      doneStatus = 'Storing';
      failStatus = 'ReadyToPick';
      fail = CurrentStatus === failStatus;
      done = Utils.checkPickDone(CurrentStatus);
      disabled = CurrentStatus !== 'Picking';
    } else if (this.pickGroup.PickDeliveryType === 3) {
      rightText = 'TRẢ';
      doneStatus = 'Returned';
      failStatus = 'Storing';
      fail = Utils.checkReturnFail(CurrentStatus, NextStatus);
      done = Utils.checkReturnDone(CurrentStatus);
      disabled = CurrentStatus !== 'Return';
    }

    console.log(`OrderCode: ${OrderCode} | CurrentStatus: ${CurrentStatus} | doneStatus ${doneStatus}`);
    
    return (
      <TouchableOpacity
        onPress={this.onOrderPress.bind(this, order)}
      >
        <View style={[Styles.orderWrapperStyle]}>
          <View style={Styles.item2Style}>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{OrderCode}</Text>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{ServiceCost} đ</Text>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={[Styles.weakColorStyle]}>Mã shop: {ExternalCode}</Text>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={Styles.weakColorStyle}>{RecipientName} - {RecipientPhone}</Text>
          </View>
          
          {this.renderInfosForPick({ Weight, Length, Width, Height, ServiceCost, disabled })}
          
          
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
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { DisplayOrder } = this.pickGroup;
    const { done } = this.props;

    this.pickGroup = this.props.pds.PickReturnItems.find(pg => pg.ClientHubID === this.ClientHubID 
      && pg.PickDeliveryType === this.PickDeliveryType && pg.DisplayOrder === DisplayOrder);
      
    const { pickGroup } = this;
    

    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log(pickGroup);
    console.log('====================================');

    return (
      
      <Content style={{ backgroundColor: Colors.background }}>
        <List
          dataArray={pickGroup.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus) === done 
            && (this.state.keyword === '' || o.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase())))}
          renderRow={this.renderOrder.bind(this)}
        />
      </Content>
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  return { sessionToken, pdsId, pds, loading };
};


export default connect(mapStateToProps, { updateOrderStatus })(PickGroupDetail);
