import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';
import { Toast } from 'native-base';

const pickStatus = { STORING: 'Đã lấy', PICKED: 'Đã lấy', COMPLETED: 'Đã lấy', READY_TO_PICK: 'Lấy lỗi', PICKING: 'Đang lấy', Progress: 'Đang xử lý' };
const pickCompleteStatus = ['PICKED', 'COMPLETED', 'READY_TO_PICK', 'STORING', 'Progress'];
const pickSuccessStatus = ['PICKED', 'STORING'];

const returnStatus = { RETURNED: 'Đã trả', RETURNING: 'Đang trả', FAIL_TO_RETURN: 'Trả lỗi', STORING: 'Trả lỗi', Progress: 'Đang xử lý' };
const returnCompleteStatus = ['RETURNED', 'STORING', 'FAIL_TO_RETURN', 'Progress'];

const deliverStatus = { DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', COMPLETED: 'Đã giao', FAIL_TO_DELIVER: 'Giao lỗi', STORING: 'Giao lỗi' };
const deliverCompleteStatus = ['DELIVERED', 'STORING', 'FAIL_TO_DELIVER', 'COMPLETED', 'Progress'];

class Utils {
  static getDisplayStatus({ currentStatus, nextStatus, pickDeliveryType }) {
    let status = '';
    if (pickDeliveryType === 1) {
      if (!pickCompleteStatus.includes(currentStatus) && pickCompleteStatus.includes(nextStatus)) {
        status = pickStatus[nextStatus] ? pickStatus[nextStatus] : nextStatus;
        status = `*${status}*`;
      } else {
        status = pickStatus[currentStatus] ? pickStatus[currentStatus] : currentStatus;
      }
    } else if (pickDeliveryType === 2) {
      if (!deliverCompleteStatus.includes(currentStatus) && deliverCompleteStatus.includes(nextStatus)) {
        status = deliverStatus[nextStatus] ? deliverStatus[nextStatus] : nextStatus;
        status = `*${status}*`;
      } else {
        status = deliverStatus[currentStatus] ? deliverStatus[currentStatus] : currentStatus;
      }
    } else if (pickDeliveryType === 3) {
      if (!returnCompleteStatus.includes(currentStatus) && returnCompleteStatus.includes(nextStatus)) {
        status = returnStatus[nextStatus] ? returnStatus[nextStatus] : nextStatus;
        status = `*${status}*`;
      } else {
        status = returnStatus[currentStatus] ? returnStatus[currentStatus] : currentStatus;
      }
    }
    return status;
  }

  static getStatus({ currentStatus, nextStatus, pickDeliveryType }) {
    let status = '';
    let alert = false;
    if (pickDeliveryType === 1) {
      if (!pickCompleteStatus.includes(currentStatus) && pickCompleteStatus.includes(nextStatus)) {
        status = pickStatus[nextStatus] ? pickStatus[nextStatus] : nextStatus;
        //status = `*${status}*`;
        alert = true;
      } else {
        status = pickStatus[currentStatus] ? pickStatus[currentStatus] : currentStatus;
      }
    } else if (pickDeliveryType === 2) {
      if (!deliverCompleteStatus.includes(currentStatus) && deliverCompleteStatus.includes(nextStatus)) {
        status = deliverStatus[nextStatus] ? deliverStatus[nextStatus] : nextStatus;
        // status = `*${status}*`;
        alert = true;
      } else {
        status = deliverStatus[currentStatus] ? deliverStatus[currentStatus] : currentStatus;
      }
    } else if (pickDeliveryType === 3) {
      if (!returnCompleteStatus.includes(currentStatus) && returnCompleteStatus.includes(nextStatus)) {
        status = returnStatus[nextStatus] ? returnStatus[nextStatus] : nextStatus;
        // status = `*${status}*`;
        alert = true;
      } else {
        status = returnStatus[currentStatus] ? returnStatus[currentStatus] : currentStatus;
      }
    }
    
    return { status, alert };
  }

  static getDisplayStatusColor({ currentStatus, nextStatus, pickDeliveryType }) {
    const DisplayStatus = this.getDisplayStatus({ currentStatus, nextStatus, pickDeliveryType });
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

  static checkPickCompleteForUnsync({ nextStatus, currentStatus }) {
    if (pickCompleteStatus.includes(currentStatus) || pickCompleteStatus.includes(nextStatus)) {
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
  static checkReturnCompleteForUnsync({ nextStatus, currentStatus }) {
    if (returnCompleteStatus.includes(currentStatus) || returnCompleteStatus.includes(nextStatus)) {
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
  static getOrder(items, orderCode, pickDeliveryType) {
    return items[Utils.getKey(orderCode, pickDeliveryType)];
  }

  static getReturnGroupFromPG(ReturnItems, pickGroup) {
    const { clientHubId } = pickGroup;
    const returnGroup = ReturnItems.find(rg => rg.clientHubId === clientHubId);
    return returnGroup;
  }
  static checkPickGroupHasRP(pds, pickGroup) {
    const { clientHubId } = pickGroup;
    const returnGroup = pds.ReturnItems.find(rg => rg.clientHubId === clientHubId);
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
    //fix phone
    const number = Utils.fixPhoneNumber(phone);
    phonecall(number, prompt);
  }
  static showToast(text, type) {
    //ToastAndroid.show(nextProps.error, ToastAndroid.SHORT);
    try {
      //console.log('Toast is called');
      Toast.show({
        text,
        position: 'bottom',
        type,
        duration: 1100
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Utils;
