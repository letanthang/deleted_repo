import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';
import { Toast } from 'native-base';
import moment from 'moment';

import { HistoryActions } from '../components/Constant';

const pickStatus = { STORING: 'Đã lấy', PICKED: 'Đã lấy', COMPLETED: 'Lấy lỗi', READY_TO_PICK: 'Lấy lỗi', PICKING: 'Đang lấy', Progress: 'Đang xử lý' };
const pickCompleteStatus = ['PICKED', 'COMPLETED', 'READY_TO_PICK', 'STORING', 'Progress'];
const pickSuccessStatus = ['PICKED', 'STORING'];
const pickFailStatus = ['READY_TO_PICK', 'COMPLETED'];

const returnStatus = { RETURNED: 'Đã trả', RETURNING: 'Đang trả', FAIL_TO_RETURN: 'Trả lỗi', STORING: 'Trả lỗi', Progress: 'Đang xử lý' };
const returnCompleteStatus = ['RETURNED', 'STORING', 'FAIL_TO_RETURN', 'Progress'];
const returnSuccessStatus = ['RETURNED'];
const returnFailStatus = ['FAIL_TO_RETURN', 'STORING'];

const deliverStatus = { DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', COMPLETED: 'Đã giao', FAIL_TO_DELIVER: 'Giao lỗi', STORING: 'Giao lỗi' };
const deliverCompleteStatus = ['DELIVERED', 'STORING', 'FAIL_TO_DELIVER', 'COMPLETED', 'Progress'];

class Utils {
  static getDisplayStatus({ status, nextStatus, type }) {
    let displayStatus = '';
    if (type === 'PICK') {
      if (!pickCompleteStatus.includes(status) && pickCompleteStatus.includes(nextStatus)) {
        displayStatus = pickStatus[nextStatus] ? pickStatus[nextStatus] : nextStatus;
        displayStatus = `*${displayStatus}*`;
      } else {
        displayStatus = pickStatus[status] ? pickStatus[status] : status;
      }
    } else if (type === 'DELIVER') {
      if (!deliverCompleteStatus.includes(status) && deliverCompleteStatus.includes(nextStatus)) {
        displayStatus = deliverStatus[nextStatus] ? deliverStatus[nextStatus] : nextStatus;
        displayStatus = `*${displayStatus}*`;
      } else {
        displayStatus = deliverStatus[status] ? deliverStatus[status] : status;
      }
    } else if (type === 'RETURN') {
      if (!returnCompleteStatus.includes(status) && returnCompleteStatus.includes(nextStatus)) {
        displayStatus = returnStatus[nextStatus] ? returnStatus[nextStatus] : nextStatus;
        displayStatus = `*${displayStatus}*`;
      } else {
        displayStatus = returnStatus[status] ? returnStatus[status] : status;
      }
    }
    return displayStatus;
  }

  static getStatus({ status, nextStatus, type }) {
    let displayStatus = '';
    let alert = false;
    if (type === 'PICK') {
      if (!pickCompleteStatus.includes(status) && pickCompleteStatus.includes(nextStatus)) {
        displayStatus = pickStatus[nextStatus] ? pickStatus[nextStatus] : nextStatus;
        //displayStatus = `*${displayStatus}*`;
        alert = true;
      } else {
        displayStatus = pickStatus[status] ? pickStatus[status] : status;
      }
    } else if (type === 'DELIVER') {
      if (!deliverCompleteStatus.includes(status) && deliverCompleteStatus.includes(nextStatus)) {
        displayStatus = deliverStatus[nextStatus] ? deliverStatus[nextStatus] : nextStatus;
        // displayStatus = `*${displayStatus}*`;
        alert = true;
      } else {
        displayStatus = deliverStatus[status] ? deliverStatus[status] : status;
      }
    } else if (type === 'RETURN') {
      if (!returnCompleteStatus.includes(status) && returnCompleteStatus.includes(nextStatus)) {
        displayStatus = returnStatus[nextStatus] ? returnStatus[nextStatus] : nextStatus;
        // displayStatus = `*${displayStatus}*`;
        alert = true;
      } else {
        displayStatus = returnStatus[status] ? returnStatus[status] : status;
      }
    }
    
    return { displayStatus, alert };
  }

  static getDisplayStatusColor({ status, nextStatus, type }) {
    const DisplayStatus = this.getDisplayStatus({ status, nextStatus, type });
    switch (DisplayStatus) {
      case 'Giao lỗi':
      case '*Giao lỗi*':
        return 'red';
      case 'Lấy lỗi':
      case '*Lấy lỗi*':
        return 'red';
      case 'Trả lỗi':
      case '*Trả lỗi*':
        return 'red';
      case 'Đã giao':
      case '*Đã giao*':
        return 'green';
      case 'Đã lấy':
      case '*Đã lấy*':
        return 'green';
      case 'Đã trả':
      case '*Đã trả*':
        return 'green';
      case 'Đang xử lý':
        return 'black';
      default:
        return 'yellow';
    }
  }
  static checkDeliveryComplete(status) {
    // const completeList = ['Delivered', 'WaitingToFinish', 'Finish', 'Storing'];
    // if (completeList.includes(status)) {
    //   return true;
    // }
    // return false;
    const unCompleteStatus = 'DELIVERING';
    if (status === unCompleteStatus) {
      return false;
    }
    return true;
  }


  static checkPickComplete(status) {
    // if (pickCompleteStatus.includes(status)) {
    //   return true;
    // }
    // return false;
    const unCompleteStatus = 'PICKING';
    if (status === unCompleteStatus) {
      return false;
    }
    return true;
  }

  static checkPickSuccess(status) {
    if (pickSuccessStatus.includes(status)) {
      return true;
    }
    return false;
  }

  static isPickSuccessedUnsynced({ nextStatus, status }) {
    if (!pickCompleteStatus.includes(status) && pickSuccessStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }
  
  static isFailedUnsynced({ nextStatus, status }) {
    if (!pickCompleteStatus.includes(status) && pickFailStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static isPickCompletedUnsynced({ nextStatus, status }) {
    if (!pickCompleteStatus.includes(status) && pickCompleteStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static checkPickCompleteForUnsync({ nextStatus, status }) {
    if (pickCompleteStatus.includes(status) || pickCompleteStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static isReturnSuccessedUnsynced({ nextStatus, status }) {
    if (!returnCompleteStatus.includes(status) && returnSuccessStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static isReturnFailedUnsynced({ nextStatus, status }) {
    if (!returnCompleteStatus.includes(status) && returnFailStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static isReturnCompletedUnsynced({ nextStatus, status }) {
    if (!returnCompleteStatus.includes(status) && returnCompleteStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static checkReturnComplete(status) {
    if (returnCompleteStatus.includes(status)) {
      return true;
    }
    return false;
  }
  static checkReturnCompleteForUnsync({ nextStatus, status }) {
    if (returnCompleteStatus.includes(status) || returnCompleteStatus.includes(nextStatus)) {
      return true;
    }
    return false;
  }

  static checkReturnFail(status) {
    const completeList = ['Return', 'NotReturn'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }
  static getKey = (orderID, type) => `${orderID}-${type}`;
  static getOrder(items, code, type) {
    return items[Utils.getKey(code, type)];
  }

  static getReturnGroup(ReturnItems, senderHubId) {
    const returnGroup = ReturnItems.find(rg => rg.senderHubId === senderHubId);
    return returnGroup;
  }
  static checkPickGroupHasRP(pds, pickGroup) {
    const { senderHubId } = pickGroup;
    const returnGroup = pds.ReturnItems.find(rg => rg.senderHubId === senderHubId);
    if (returnGroup) return true;
    return false;
  }
  static validateCallCannotContact(phone, configuration) {
    const phoneNumber = Utils.fixPhoneNumber(phone);
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    let { minDurationCallLogUnconnected, repeatCallUnconnected } = configuration;
    if (minDurationCallLogUnconnected === undefined) {
      minDurationCallLogUnconnected = 5;
      repeatCallUnconnected = 3;
    }

    return new Promise((resolve, reject) => {
      CallHistory.list(
        (history) => {
          const json = JSON.parse(history);
          const callLogs = json.filter(item => item.phoneNumber == phoneNumber && item.callType == 'OUTGOING_TYPE');
          resolve(callLogs.length >= repeatCallUnconnected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  static validateCallNotHangUp(phone, configuration) {
    const phoneNumber = Utils.fixPhoneNumber(phone);
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    let { minDurationCallLogNoAnswer, repeatCallUnconnected } = configuration;
    if (minDurationCallLogNoAnswer === undefined) {
      minDurationCallLogNoAnswer = 5;
      repeatCallUnconnected = 3;
    }

    return new Promise((resolve, reject) => {
      CallHistory.list(
        (history) => {
          const json = JSON.parse(history);
          const callLogs = json.filter(item => item.phoneNumber == phoneNumber && item.callType == 'OUTGOING_TYPE');
          resolve(callLogs.length >= repeatCallUnconnected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  static fixPhoneNumber(phone) {
    let number = phone;
    if (phone.startsWith('84')) {
      number = `0${phone.substr(2)}`;
    }
    return number;
  }

  static phoneCall(phone, prompt) {
    if (!phone) {
      alert('Không có số điện thoại!');
      return;
    }
    //fix phone
    const number = Utils.fixPhoneNumber(phone);
    phonecall(number, prompt);
  }
  static showToast(text, type = 'success') {
    //ToastAndroid.show(nextProps.error, ToastAndroid.SHORT);
    try {
      //console.log('Toast is called');
      Toast.show({
        text,
        position: 'bottom',
        type,
        duration: 1500
      });
    } catch (error) {
      console.log(error);
    }
  }
  static getHistoryString(history) {
    if (!history) return '';
    return history.reduce((accum, item) => {
      const { date, createdByName, createdById, historyType } = item;

      const newLine = moment(date).format('DD/MM H:mm') + '   NV: ' + createdByName + ' ' + createdById + ' ' + HistoryActions[historyType];
      return accum + '\n' + newLine;
    }, '');
  }
  static getFullNote(note, newDate) {
    if (newDate == null || newDate == 0) { return note; }
    console.log(new Date(newDate));
    const strDate = moment(newDate).format('DD/MM ');
    if (new Date(newDate).getHours() > 12) {
      return `${note} ${strDate} Chiều`;
    } 
    return `${note} ${strDate} Sáng`;
  }
}

export default Utils;
