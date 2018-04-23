import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import moment from 'moment';
import Utils from '../libs/Utils';
import { PickErrors, ReturnErrors } from './Constant';

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

export function updateOrderToFailWithReason2(phone, configuration, code = null) {
  return new Promise((resolve, reject) => {
    const senderPhone = phone;
    const title = code ? `Chọn lý do lỗi cho đơn ${code}` : `Chọn lý do lỗi cho tất cả các đơn này`;
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
          Utils.validateCallCannotContact(senderPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(senderPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              } 
            });
        } else if (buttonIndex == notHangUpIndex) {
          //cannot contact
          Utils.validateCallNotHangUp(senderPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(senderPhone);
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
  //     code,
  //     PDSType,
  //     nextStatus,
  //     senderHubId,
  //     StoringCode,
  //     NewDate,
  //     log
  //     Note,
  //     NoteCode,
  //   },
export function getUpdateOrderInfo(order, buttonIndex, newDate = null) {
  const { code, type } = order;
  const noteId = codes[buttonIndex]; 
  const note = buttons[buttonIndex];
  const nextStatus = 'READY_TO_PICK';
  const action = 'PICK_FAIL';
  const success = false;
  const nextDate = newDate === null ? null : moment(newDate).format();
  return { code, nextDate, newDate, noteId, note, action, nextStatus, type, success };
}

export function getUpdateOrderInfoForDone(order, newDate = null) {
  const { code, type } = order;
  const noteId = 'Storing'; 
  const note = '';
  const nextStatus = 'PICKED';
  const action = 'PICK_SUCCESS';
  const success = true;
  const nextDate = newDate === null ? null : moment(newDate).format();
  return { code, nextDate, newDate, noteId, note, action, nextStatus, type, success };
}
