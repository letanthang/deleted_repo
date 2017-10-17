import * as Communications from 'react-native-communications';
import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import Utils from '../../libs/Utils';
import { ReturnErrors } from '../Constant';

const buttons = Object.values(ReturnErrors);
buttons.push('Cancel');
const codes = Object.keys(ReturnErrors);
const cancelIndex = buttons.length - 1;
const changeDateIndex = -3;
const destructiveIndex = -1;
const cannotContactIndex = 0;
const cannotCallIndex = 3;
const notHangUpIndex = 1;

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

export function updateOrderToFailWithReason2(phone, configuration) {
  return new Promise((resolve, reject) => {
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
          return resolve({ error: 'cancel', buttonIndex });
        } else if (buttonIndex == changeDateIndex) {
          return resolve({ error: 'chooseDate', buttonIndex });
        } else if (buttonIndex == cannotCallIndex || buttonIndex == cannotContactIndex) {
          //cannot contact
          Utils.validateCallCannotContact(ContactPhone, configuration)
            .then((result) => {
              console.log(result);
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(ContactPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              } 
            });
        } else if (buttonIndex == notHangUpIndex) {
          console.log(ContactPhone);
          //cannot contact
          Utils.validateCallNotHangUp(ContactPhone, configuration)
            .then((result) => {
              console.log(result);
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
  const NextStatus = 'Returned';
  const success = true;     
  return { OrderID, NextStatus, StoringCode, NewDate, Log, PDSType, PDSDetailID, success };
}
