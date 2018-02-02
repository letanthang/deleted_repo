import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';

const pickStatus = { STORING: 'Đã lấy', PICKED: 'Đã lấy', READY_TO_PICK: 'Lấy lỗi', PICKING: 'Đang lấy', Progress: 'Đang xử lý' };
const pickCompleteStatus = ['PICKED', 'READY_TO_PICK', 'STORING', 'Progress'];

const returnStatus = { RETURNED: 'Đã trả', RETURNING: 'Đang trả', FAIL_TO_RETURN: 'Trả lỗi', STORING: 'Trả lỗi', Progress: 'Đang xử lý' };
const returnCompleteStatus = ['RETURNED', 'STORING', 'FAIL_TO_RETURN', 'Progress'];

const deliverStatus = { DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', FAIL_TO_DELIVER: 'Giao lỗi', STORING: 'Giao lỗi' };
const deliverCompleteStatus = ['DELIVERED', 'STORING', 'FAIL_TO_DELIVER', 'Progress'];

class Utils {
  static getDisplayStatus({ CurrentStatus, NextStatus, PickDeliveryType }) {
    let status = '';
    if (PickDeliveryType === 1) {
      if (!pickCompleteStatus.includes(CurrentStatus) && pickCompleteStatus.includes(NextStatus)) {
        status = pickStatus[NextStatus] ? pickStatus[NextStatus] : NextStatus;
        status = `*${status}*`;
      } else {
        status = pickStatus[CurrentStatus] ? pickStatus[CurrentStatus] : CurrentStatus;
      }
    } else if (PickDeliveryType === 2) {
      if (!deliverCompleteStatus.includes(CurrentStatus) && deliverCompleteStatus.includes(NextStatus)) {
        status = deliverStatus[NextStatus] ? deliverStatus[NextStatus] : NextStatus;
        status = `*${status}*`;
      } else {
        status = deliverStatus[CurrentStatus] ? deliverStatus[CurrentStatus] : CurrentStatus;
      }
    } else if (PickDeliveryType === 3) {
      if (!returnCompleteStatus.includes(CurrentStatus) && returnCompleteStatus.includes(NextStatus)) {
        status = returnStatus[NextStatus] ? returnStatus[NextStatus] : NextStatus;
        status = `*${status}*`;
      } else {
        status = returnStatus[CurrentStatus] ? returnStatus[CurrentStatus] : CurrentStatus;
      }
    }
    return status;
  }

  static getStatus({ CurrentStatus, NextStatus, PickDeliveryType }) {
    let status = '';
    let alert = false;
    if (PickDeliveryType === 1) {
      if (!pickCompleteStatus.includes(CurrentStatus) && pickCompleteStatus.includes(NextStatus)) {
        status = pickStatus[NextStatus] ? pickStatus[NextStatus] : NextStatus;
        //status = `*${status}*`;
        alert = true;
      } else {
        status = pickStatus[CurrentStatus] ? pickStatus[CurrentStatus] : CurrentStatus;
      }
    } else if (PickDeliveryType === 2) {
      if (!deliverCompleteStatus.includes(CurrentStatus) && deliverCompleteStatus.includes(NextStatus)) {
        status = deliverStatus[NextStatus] ? deliverStatus[NextStatus] : NextStatus;
        // status = `*${status}*`;
        alert = true;
      } else {
        status = deliverStatus[CurrentStatus] ? deliverStatus[CurrentStatus] : CurrentStatus;
      }
    } else if (PickDeliveryType === 3) {
      if (!returnCompleteStatus.includes(CurrentStatus) && returnCompleteStatus.includes(NextStatus)) {
        status = returnStatus[NextStatus] ? returnStatus[NextStatus] : NextStatus;
        // status = `*${status}*`;
        alert = true;
      } else {
        status = returnStatus[CurrentStatus] ? returnStatus[CurrentStatus] : CurrentStatus;
      }
    }
    
    return { status, alert };
  }

  static getDisplayStatusColor({ CurrentStatus, NextStatus, PickDeliveryType }) {
    const DisplayStatus = this.getDisplayStatus({ CurrentStatus, NextStatus, PickDeliveryType });
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

  static checkPickCompleteForUnsync({ NextStatus, CurrentStatus }) {
    if (pickCompleteStatus.includes(CurrentStatus) || pickCompleteStatus.includes(NextStatus)) {
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
  static checkReturnCompleteForUnsync({ NextStatus, CurrentStatus }) {
    if (returnCompleteStatus.includes(CurrentStatus) || returnCompleteStatus.includes(NextStatus)) {
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
  static getOrder(items, OrderCode, PickDeliveryType) {
    return items[Utils.getKey(OrderCode, PickDeliveryType)];
  }

  static getReturnGroupFromPG(ReturnItems, pickGroup) {
    const { ClientHubID } = pickGroup;
    const returnGroup = ReturnItems.find(rg => rg.ClientHubID === ClientHubID);
    return returnGroup;
  }
  static checkPickGroupHasRP(pds, pickGroup) {
    const { ClientHubID } = pickGroup;
    const returnGroup = pds.ReturnItems.find(rg => rg.ClientHubID === ClientHubID);
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
}

export default Utils;
