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

function alertMissOfCall(phoneNumber) {
  const title = 'Không đủ số cuộc gọi.';
  const message = 'Bạn không thực hiện đủ số cuộc gọi cho khách hàng. Gọi bây giờ?';
  Alert.alert(
    title,
    message,
    [
      { text: 'Gọi', onPress: () => Utils.phoneCall(phoneNumber, true) },
      { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
    ],
    { cancelable: false }
  );
}

export function updateOrderToFailWithReason2(phone, configuration, OrderCode = null) {
  return new Promise((resolve, reject) => {
    const ContactPhone = phone;
    const title = OrderCode ? `Chọn lý do lỗi cho đơn ${OrderCode}` : `Chọn lý do lỗi cho tất cả các đơn này`;
    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex: destructiveIndex,
        title
      },
      buttonIndex => {
  
        if (buttonIndex == cancelIndex || buttonIndex == destructiveIndex) {
          return resolve({ error: 'cancel', buttonIndex });
        } else if (buttonIndex == changeDateIndex) {
          return resolve({ error: 'chooseDate', buttonIndex });
        } else if (buttonIndex == cannotCallIndex || buttonIndex == cannotContactIndex) {
          //cannot contact
          Utils.validateCallCannotContact(ContactPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(ContactPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              } 
            });
        } else if (buttonIndex == notHangUpIndex) {
          //cannot contact
          Utils.validateCallNotHangUp(ContactPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(ContactPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              }
            });
        } else {
          return resolve({ error: null, buttonIndex });
        }
      }
    );
  });
}

  // [
  //   {  
  //     PDSDetailID,
  //     OrderCode,
  //     PDSType,
  //     NextStatus,
  //     ClientHubID,
  //     StoringCode,
  //     NewDate,
  //     Log
  //     Note,
  //     NoteCode,
  //   },
export function getUpdateOrderInfo(order, buttonIndex, nextDate = 0) {
  const OrderCode = order.OrderCode;
  const PickDeliveryType = order.PickDeliveryType;
  const noteId = codes[buttonIndex]; 
  const note = buttons[buttonIndex];
  const NextStatus = 'READY_TO_PICK';
  const action = 'DO_PICK';
  const success = false;
  return { OrderCode, nextDate, noteId, note, action, NextStatus, PickDeliveryType, success };
}

export function getUpdateOrderInfoForDone(order, nextDate = 0) {
  const OrderCode = order.OrderCode;
  const PickDeliveryType = order.PickDeliveryType;
  const noteId = ''; 
  const note = '';
  const NextStatus = 'PICKED';
  const action = 'DO_PICK_FAIL';
  const success = false;
  return { OrderCode, nextDate, noteId, note, action, NextStatus, PickDeliveryType, success };
}
