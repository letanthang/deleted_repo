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
export function getUpdateOrderInfo(order, buttonIndex, NewDate = 0) {
  const OrderCode = order.OrderCode;
  const PickDeliveryType = order.PickDeliveryType;
  const StoringCode = codes[buttonIndex]; 
  const reason = buttons[buttonIndex];
  const Log = `${StoringCode}|${reason}`;
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'READY_TO_PICK';
  const NoteCode = StoringCode;
  const Note = reason;
  const success = false;
  return { OrderCode, PickDeliveryType, NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID, Note, NoteCode, success };
}

export function getUpdateOrderInfoForDone(order, NewDate = 0) {
  const OrderCode = order.OrderCode;
  const PickDeliveryType = order.PickDeliveryType;
  const StoringCode = ''; 
  const Log = '';
  const PDSType = order.PickDeliveryType;
  const PDSDetailID = order.PickDeliverySessionDetailID;
  const NextStatus = 'PICKED';
  const success = true;     
  return { OrderCode, PickDeliveryType, NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID, success };
}
