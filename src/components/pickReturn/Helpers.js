import * as Communications from 'react-native-communications';
import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import Utils from '../../libs/Utils';
import { PickErrors, ReturnErrors } from '../Constant';

const buttons = Object.values(PickErrors);
buttons.push('Cancel');
const codes = Object.keys(PickErrors);
const cancelIndex = buttons.length - 1;
const destructiveIndex = -1;
const changeDateIndex = 0;
const cannotContactIndex = 1;
const cannotCallIndex = 2;
const notHangUpIndex = 3;

export function alertMissOfCall(phoneNumber) {
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

export function confirmUpdateOrderToDone(order) {
  const message = order === null ? 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang đã lấy?' : '';
  const title = order === null ? 'Cập nhật đồng loạt đơn hàng thành đã lấy ?' : 'Cập nhật đơn hàng thành đã lấy ?';
  Alert.alert(
    title,
    message,
    [
      { text: 'Đồng ý', onPress: () => updateOrderToDone(order) },
      { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
    ],
    { cancelable: false }
  );
}

export function confirmUpdateOrderToFail() {
  const message = 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang lỗi?';
  Alert.alert(
    'Cập nhật đồng loạt đơn hàng thành lấy lỗi?',
    message,
    [
      { text: 'Đồng ý', onPress: () => updateOrderToFailWithReason(null) },
      { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
    ],
    { cancelable: false }
  );
}

export function updateOrderToDone(order) {
  if (order !== null) {
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
    
    let status = null;
    if (PickDeliveryType === 3) status = 'Returned';
    if (PickDeliveryType === 1) status = 'Storing';
    updateOrder(order, status);
  } else {
    const { pds } = props;
    const Items = PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => checkComplete(o) === false && checkKeywork(o));
    if (orders.length === 0) return;

    let status = null;
    if (PickDeliveryType === 3) status = 'Returned';
    if (PickDeliveryType === 1) status = 'Storing';
    updateOrders(orders, status);
  }
  
}

export function updateOrderToFailWithReason(phone, configuration, callback) {

  console.log('updateOrderToFailWithReason pressed');
  const ContactPhone = phone;
  ActionSheet.show(
    {
      options: buttons,
      cancelButtonIndex: cancelIndex,
      destructiveButtonIndex: destructiveIndex,
      title: 'Chọn lý do lỗi'
    },
    buttonIndex => {
      console.log(`updateOrderToFailWithReason : ${typeof buttonIndex}${typeof changeDateIndex}`);

      if (buttonIndex == changeDateIndex) {
        callback('chooseDate', buttonIndex);
      } else if (buttonIndex == cannotCallIndex || buttonIndex == cannotContactIndex) {
        //cannot contact
        Utils.validateCallCannotContact(ContactPhone, configuration)
          .then((result) => {
            console.log(result);
            if (result) { 
              callback(null, buttonIndex);
            } else {
              callback('moreCall', buttonIndex);
              alertMissOfCall(ContactPhone);
            } 
          });
      } else if (buttonIndex == notHangUpIndex) {
        console.log(ContactPhone);
        //cannot contact
        Utils.validateCallNotHangUp(ContactPhone, configuration)
          .then((result) => {
            console.log(result);
            if (result) { 
              callback(null, buttonIndex); 
            } else {
              callback('moreCall', buttonIndex);
              alertMissOfCall(ContactPhone);
            }
          });
      } else {
        callback(null, buttonIndex);
      }
    }
  );
}

  // [
  //   {  
  //     PDSDetailID,
  //     OrderID,
  //     PDSType,
  //     NextStatus,
  //     ClientHubID,
  //     StoringCode,
  //     NewDate,
  //     Log
  //   },
export function getUpdateOrderInfo(order, buttonIndex, NewDate = 0) {
  const StoringCode = codes[buttonIndex]; 
  const reason = buttons[buttonIndex];
  const Log = `${StoringCode}|${reason}`;
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'ReadyToPick';     
  return { NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID };
}

export function getUpdateOrderInfoForDone(order, NewDate = 0) {
  const StoringCode = ''; 
  const Log = '';
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'Storing';     
  return { NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID };
}

export function updateOrder(order, status, infos = {}) {
  const { pickGroup, ClientHubID } = this;
  const { sessionToken, pdsId } = props;
  const { PickDeliverySessionDetailID, OrderID } = order;
  const { PickDeliveryType } = pickGroup;
  console.log(`updateOrder to status : ${status} | pdsId ${pdsId} | ClientHubID ${ClientHubID}`);
  console.log(order);
  props.updateOrderStatus({ 
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
