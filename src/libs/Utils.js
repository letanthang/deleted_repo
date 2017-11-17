import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';

class Utils {
  static getDisplayStatus(status, type = 2, nextStatus) {
    if (type === 1) {
      switch (status) {
        case 'Storing':
          return 'Đã lấy';
        case 'ReadyToPick':
          return 'Lấy lỗi';
        case 'Picking':
          if (nextStatus === null) return 'Lấy lỗi';
          return 'Đang lấy';
        default:
          return 'Đang lấy';
      }
    } else if (type === 3) {
      switch (status) {
        case 'Returned':
          return 'Đã trả';
        case 'WaitingToFinish':
          return 'Đã trả';
        case 'Return':
          return 'Trả lỗi';
        case 'NotReturn':
          return 'Trả lỗi';
        case 'Storing':
          return 'Trả lỗi';
        case 'Returning':
          return 'Đang trả';
        default:
          return 'Đang trả';
      }
    } else {
      switch (status) {
        case 'Delivering':
          return 'Đang giao';
        case 'Delivered':
          return 'Đã giao';
        case 'WaitingToFinish':
          return 'Đã giao';
        case 'Finish':
          return 'Đã giao';
        case 'Storing':
          return 'Giao lỗi';
        default:
          return 'Giao lỗi';
      }
    }
  }
  static getDisplayStatusColor(status, type = 2, nextStatus) {
    const DisplayStatus = this.getDisplayStatus(status, type, nextStatus);
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

  static getOrder(pds, OrderID) {
    return pds.PDSItems.find(o => o.OrderID === OrderID);
  }

  static getReturnGroupFromPG(pds, pickGroup) {
    const { ClientHubID } = pickGroup;
    const returnGroup = pds.ReturnItems.find(rg => rg.ClientHubID === ClientHubID);
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
