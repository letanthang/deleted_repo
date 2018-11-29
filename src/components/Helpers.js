import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { ActionSheet } from 'native-base';
import moment from 'moment';
import Utils from '../libs/Utils';
import { PickErrors, ReturnErrors } from './Constant';

const buttons = Object.values(PickErrors);
buttons.push('Cancel');
export const codes = Object.keys(PickErrors);
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

export function updateOrderToFailWithReason2(phone, configuration, orderCode = null) {
  return new Promise((resolve, reject) => {
    const senderPhone = phone;
    const title = orderCode ? `Chọn lý do lỗi cho đơn ${orderCode}` : `Chọn lý do lỗi cho tất cả các đơn này`;
    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex: destructiveIndex,
        title,
      },
      async(buttonIndex) => {
  
        if (buttonIndex == cancelIndex || buttonIndex == destructiveIndex) {
          return resolve({ error: 'cancel', buttonIndex });
        } else if (buttonIndex == changeDateIndex) {
          return resolve({ error: 'chooseDate', buttonIndex });
        } else if (buttonIndex == cannotCallIndex || buttonIndex == cannotContactIndex) {
          //cannot contact
          if(Platform.OS == 'ios'){
            Utils.validateCallCannotContact(senderPhone, configuration)
            .then((result) => {
              if (result) { 
                return resolve({ error: null, buttonIndex });
              } else {
                alertMissOfCall(senderPhone);
                return resolve({ error: 'moreCall', buttonIndex });
              } 
            });
          } else {
            try{
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                  'title': 'Quyền truy cập thông tin SĐT',
                  'message': 'Ứng dụng tài xế cần thông tin Số Điện Thoại khách hàng'
                }
              )
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Utils.validateCallCannotContact(senderPhone, configuration)
                .then((result) => {
                  if (result) { 
                    return resolve({ error: null, buttonIndex });
                  } else {
                    alertMissOfCall(senderPhone);
                    return resolve({ error: 'moreCall', buttonIndex });
                  } 
                });
              } else {
                console.log("LOG permission denied")
              }
            } catch (err){

            }
          }
        } else if (buttonIndex == notHangUpIndex) {
          //cannot contact
          if(Platform.OS == 'ios'){
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
            try{
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                  'title': 'Quyền truy cập thông tin SĐT',
                  'message': 'Ứng dụng tài xế cần thông tin Số Điện Thoại khách hàng'
                }
              )
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
                console.log("LOG permission denied")
              }
            } catch (err){

            }
          }
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
  //     senderHubId,
  //     StoringCode,
  //     NewDate,
  //     log
  //     Note,
  //     NoteCode,
  //   },
export function getUpdateOrderInfo(order, buttonIndex, newDate = null) {
  const { orderCode, type } = order;
  const noteId = codes[buttonIndex]; 
  const note = buttons[buttonIndex];
  const success = false;
  const willSucceeded = false;
  const nextDate = (newDate == null || newDate == 0) ? null : moment(newDate).format();
  return { orderCode, nextDate, newDate, noteId, note, type, success, willSucceeded };
}

export function getUpdateOrderInfoForDone(order, newDate = null) {
  const { orderCode, type } = order;
  const noteId = 'Storing'; 
  const note = '';
  const success = true;
  const willSucceeded = true;
  const nextDate = (newDate == null || newDate == 0) ? null : moment(newDate).format();
  return { orderCode, nextDate, newDate, noteId, note, type, success, willSucceeded };
}
