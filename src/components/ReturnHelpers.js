import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import moment from 'moment';
import Utils from '../libs/Utils';
import { ReturnErrors } from './Constant';

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
    const contactPhone = phone;
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
          Utils.validateCallCannotContact(contactPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(contactPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              } 
            });
        } else if (buttonIndex == notHangUpIndex) {
          //cannot contact
          Utils.validateCallNotHangUp(contactPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(contactPhone);
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
  //     orderCode,
  //     PDSType,
  //     nextStatus,
  //     clientHubId,
  //     StoringCode,
  //     NewDate,
  //     log
  //     Note,
  //     NoteCode,
  //   },
export function getUpdateOrderInfo(order, buttonIndex, newDate = null) {
  const { orderCode, pickDeliveryType } = order;
  const noteId = codes[buttonIndex]; 
  const note = buttons[buttonIndex];
  const nextStatus = 'FAIL_TO_RETURN';
  const action = 'DO_RETURN_FAIL';
  const success = false;
  const nextDate = newDate === null ? null : moment(newDate).format();
  return { orderCode, nextDate, newDate, noteId, note, action, nextStatus, pickDeliveryType, success };
}

export function getUpdateOrderInfoForDone(order, newDate = null) {
  const { orderCode, pickDeliveryType } = order;
  const noteId = 'Returned';
  const note = '';
  const nextStatus = 'RETURNED';
  const action = 'DO_RETURN_SUCCESS';
  const success = true;
  const nextDate = newDate === null ? null : moment(newDate).format();
  return { orderCode, nextDate, newDate, noteId, note, action, nextStatus, pickDeliveryType, success };
}
