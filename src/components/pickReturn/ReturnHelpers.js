import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import Utils from '../../libs/Utils';
import { ReturnErrors } from '../Constant';

const buttons = Object.values(ReturnErrors);
buttons.push('Cancel');
const codes = Object.keys(ReturnErrors);
const cancelIndex = buttons.length - 1;
const changeDateIndex = 3;
const destructiveIndex = -1;
const cannotContactIndex = 0;
const cannotCallIndex = 2;
const notHangUpIndex = 1;

export function alertMissOfCall(phoneNumber) {
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

export function updateOrderToFailWithReason2(phone, configuration) {
  return new Promise((resolve, reject) => {
    const ContactPhone = phone;
    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex: destructiveIndex,
        title: 'Chọn lý do lỗi'
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
  const NextStatus = 'RETURNED';
  const action = 'DO_RETURN';
  const success = false;
  return { OrderCode, nextDate, noteId, note, action, NextStatus, PickDeliveryType, success };
}

export function getUpdateOrderInfoForDone(order, nextDate = 0) {
  const OrderCode = order.OrderCode;
  const PickDeliveryType = order.PickDeliveryType;
  const noteId = ''; 
  const note = '';
  const NextStatus = 'FAIL_TO_RETURN';
  const action = 'DO_RETURN_FAIL';
  const success = false;
  return { OrderCode, nextDate, noteId, note, action, NextStatus, PickDeliveryType, success };
}
