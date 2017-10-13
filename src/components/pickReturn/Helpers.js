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

      if (buttonIndex == cancelIndex) {
        return;
      } else if (buttonIndex == changeDateIndex) {
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
  const OrderID = order.OrderID;
  const StoringCode = codes[buttonIndex]; 
  const reason = buttons[buttonIndex];
  const Log = `${StoringCode}|${reason}`;
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'ReadyToPick';
  const success = false;
  return { OrderID, NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID, success };
}

export function getUpdateOrderInfoForDone(order, NewDate = 0) {
  const OrderID = order.OrderID;
  const StoringCode = ''; 
  const Log = '';
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'Storing';
  const success = true;     
  return { OrderID, NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID, success };
}
