import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';

const pickStatus = { Storing: 'Đã lấy', ReadyToPick: 'Lấy lỗi', Picking: 'Đang lấy', Progress: 'Đang xử lý' };
const returnStatus = { Returned: 'Đã trả', Returning: 'Đang trả', NotReturn: 'Trả lỗi', Storing: 'Trả lỗi', Progress: 'Đang xử lý' };
const deliverStatus = { Delivering: 'Đang giao', Delivered: 'Đã giao', Storing: 'Giao lỗi' };

class Utils {
  static getDisplayStatus({ CurrentStatus, NextStatus, PickDeliveryType }) {
    if (PickDeliveryType === 1) {
      return pickStatus[CurrentStatus] ? pickStatus[CurrentStatus] : 'Đang lấy';
    } else if (PickDeliveryType === 3) {
      return returnStatus[CurrentStatus] ? pickStatus[CurrentStatus] : 'Đang trả';
    } else {
      return deliverStatus[CurrentStatus] ? pickStatus[CurrentStatus] : 'Đang giao';
    }
  }

  static getDisplayStatusColor({ CurrentStatus, NextStatus, PickDeliveryType }) {
    const DisplayStatus = this.getDisplayStatus({ CurrentStatus, NextStatus, PickDeliveryType });
    switch (DisplayStatus) {
      case 'Giao lỗi':
        return 'red';
      case 'Lấy lỗi':
        return 'red';
      case 'Trả lỗi':
        return 'red';
      case 'Đã giao':
        return 'green';
      case 'Đã lấy':
        return 'green';
      case 'Đã trả':
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
    const unCompleteStatus = 'Delivering';
    if (status === unCompleteStatus) {
      return false;
    }
    return true;
  }

  static checkPickComplete(status) {
    const completeList = ['ReadyToPick', 'Storing'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }

  static checkPickDone(status) {
    const completeList = ['Storing'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }

  static checkReturnComplete(status) {
    const completeList = ['WaitingToFinish', 'Returned', 'Return', 'NotReturn'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }

  static checkReturnDone(status) {
    const completeList = ['WaitingToFinish', 'Returned'];
    if (completeList.includes(status)) {
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
  static getOrder(items, OrderID, PickDeliveryType) {
    return items[Utils.getKey(OrderID, PickDeliveryType)];
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
