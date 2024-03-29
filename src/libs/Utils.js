import CallHistory from 'react-native-call-history';
import { phonecall } from 'react-native-communications';
import { Platform } from 'react-native';
import { Toast } from 'native-base';
import moment from 'moment';

import { HistoryActions, HistoryStatus } from '../components/Constant';

const mapStatus1 = { PICK: 'lấy', DELIVER: 'giao', RETURN: 'trả', TRANSIT_IN: 'lấy' };
const mapStatus2 = { PICK: 'Lấy', DELIVER: 'Giao', RETURN: 'Trả', TRANSIT_IN: 'Lấy' };

class Utils {
  static getDisplayStatus({ isUpdated, isSucceeded, isCancel, willSucceeded, isProgressing, type }) {
    const type1 = mapStatus1[type];
    const type2 = mapStatus2[type];
    let displayStatus = '';

    if (isCancel === true) {
      displayStatus = 'Đã huỷ';
    } else if (isUpdated === true) {
      displayStatus = isSucceeded ? `Đã ${type1}` : `${type2} lỗi`;
    } else if (isProgressing) {
      displayStatus = 'Đang xử lý';
    } else if (willSucceeded !== undefined) {
      displayStatus = willSucceeded ? `*Đã ${type1}*` : `*${type2} lỗi*`;
    } else {
      displayStatus = `Đang ${type1}`;
    }

    return displayStatus;
  }

  static getDisplayStatusColor({ isUpdated, isSucceeded, isCancel, willSucceeded, isProgressing }) {
    if (isCancel === true) {
      return 'black'
    } else if (isUpdated === true) {
      return isSucceeded ? 'green' : 'red';
    } else if (isProgressing) {
      return 'black'
    } else if (willSucceeded !== undefined) {
      return willSucceeded ? 'green' : 'red';
    } else {
      return 'yellow';
    }
  }
  


  static checkComplete({ isUpdated, isProgressing, isCancel }) {
    return isUpdated || isCancel || isProgressing === true;
  }

  static checkSuccess({ isUpdated, isSucceeded }) {
    return isUpdated && isSucceeded;
  }

  static isSuccessedUnsynced({ isUpdated, willSucceeded }) {
    return !isUpdated && willSucceeded === true;
  }
  
  static isFailedUnsynced({ isUpdated, willSucceeded }) {
    return !isUpdated && willSucceeded === false;
  }

  static isCompletedUnsynced({ isUpdated, willSucceeded }) {
    return !isUpdated && willSucceeded !== undefined;
  }

  static checkCompleteForUnsync({ isUpdated, willSucceeded, isCancel }) {
    return isUpdated || isCancel || willSucceeded !== undefined; 
  }

  static getKey = (orderID, type) => `${orderID}-${type}`;
  static getOrder(items, orderCode, type) {
    return items[Utils.getKey(orderCode, type)];
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
  static validateCallCannotContact(phone, config) {
    const configuration = config || {};
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
          const json = JSON.parse(history).slice(0, 500);
          const callLogs = json.filter(item => item.phoneNumber.replace(/\s/g,'') == phoneNumber.replace(/\s/g,'') && item.callType == 'OUTGOING_TYPE');
          resolve(callLogs.length >= repeatCallUnconnected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  static validateCallNotHangUp(phone, config) {
    const configuration = config || {};
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
          const json = JSON.parse(history).slice(0, 500);
          const callLogs = json.filter(item => item.phoneNumber.replace(/\s/g,'') == phoneNumber.replace(/\s/g,'') && item.callType == 'OUTGOING_TYPE');
          resolve(callLogs.length >= repeatCallUnconnected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  static fixPhoneNumber(phone) {
    console.log("Utils >> fixPhoneNumber Func >> ",phone);
    let number = phone;
    if (phone.startsWith('84')) {
      number = `0${phone.substr(2)}`;
    } else if (!phone.startsWith('0')) {
      number = `0${phone}`;
    }
    console.log("Utils >> fixPhoneNumber Func >>  84 >>",number);
    
    //change 11 so -> 10 so 
    if(number.length >= 11){
    if(number.startsWith('0120')){
      number = `070${number.substr(4)}`
    }else if(number.startsWith('0121')){
      number = `079${number.substr(4)}`  
    }else if(number.startsWith('0122')){
      number = `077${number.substr(4)}`  
    }else if(number.startsWith('0126')){
      number = `076${number.substr(4)}`  
    }else if(number.startsWith('0128')){
      number = `078${number.substr(4)}`  
    }else if(number.startsWith('0123')){
      number = `083${number.substr(4)}`  
    }else if(number.startsWith('0124')){
      number = `084${number.substr(4)}`  
    }else if(number.startsWith('0125')){
      number = `085${number.substr(4)}`  
    }else if(number.startsWith('0127')){
      number = `081${number.substr(4)}`  
    }else if(number.startsWith('0129')){
      number = `082${number.substr(4)}`  
    }else if(number.startsWith('0162')){
      number = `032${number.substr(4)}`  
    }else if(number.startsWith('0163')){
      number = `033${number.substr(4)}`  
    }else if(number.startsWith('0164')){
      number = `034${number.substr(4)}`  
    }else if(number.startsWith('0165')){
      number = `035${number.substr(4)}`  
    }else if(number.startsWith('0166')){
      number = `036${number.substr(4)}`  
    }else if(number.startsWith('0167')){
      number = `037${number.substr(4)}`  
    }else if(number.startsWith('0168')){
      number = `038${number.substr(4)}`  
    }else if(number.startsWith('0169')){
      number = `039${number.substr(4)}`  
    }else if(number.startsWith('0186')){
      number = `056${number.substr(4)}`  
    }else if(number.startsWith('0188')){
      number = `058${number.substr(4)}`  
    }else if(number.startsWith('0199')){
      number = `059${number.substr(4)}`  
    }
  }

    return number;
  }

  static phoneCall(phone, prompt) {
    console.log("Utils >> phoneCall Func >> ",phone,prompt);
    if (!phone) {
      alert('Không có số điện thoại!');
      return;
    }

    //fix phone
    const number = Utils.fixPhoneNumber(phone);
    console.log("Utils >> phoneCall Func >> fixNumber ",number,prompt);
    phonecall(number, prompt);
  }
  // type?: "danger" | "success" | "warning";
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
    try {
      if (!history) return '';
      return history.reduce((accum, item) => {
        const { createdTime, createdByName, createdById, historyType, data } = item;
        if (historyType !== 'UPDATE_ITEM') return accum;

        let newLine = '';
        if (data && data.length > 50) {
          const { action, failNote, nextRedoTime } = JSON.parse(data);
          const nextDate = nextRedoTime ? moment(nextRedoTime).format('DD/MM H:mm') : '';
          newLine = moment(createdTime).format('DD/MM H:mm') + ' ' + createdByName + ' ' + createdById + ' ' + HistoryStatus[action];
          newLine += failNote ? ' - ' + failNote : '';
          newLine += nextDate ? ' - ' + nextDate : '';
        } else {
          newLine = moment(createdTime).format('DD/MM H:mm') + '   NV: ' + createdByName + ' ' + createdById + ' ' + HistoryStatus[data];
        }
        // const arr = data.split(' - ');
        // if (arr.length > 1) {
        //   const temp = arr[0].split(' ');
        //   const action = temp[0];
        //   newLine = moment(createdTime).format('DD/MM H:mm') + '   NV: ' + createdByName + ' ' + createdById + ' ' + HistoryStatus[action] + ' ' + arr[1];
        // } else {
        //   newLine = moment(createdTime).format('DD/MM H:mm') + '   NV: ' + createdByName + ' ' + createdById + ' ' + data;
        // }   
        
        return accum + '\n' + newLine;
      }, '');  
    } catch (error) {
      console.log('Util.getHistoryString', error.message)
      return '';
    }
  }
  static getFullNote(note, newDate) {
    if (newDate == null || newDate == 0) { return note; }
    console.log(new Date(newDate));
    const strDate = moment(newDate).format('DD/MM ');
    if (new Date(newDate).getHours() >= 14) {
      return `${note} ${strDate} Chiều`;
    } 
    return `${note} ${strDate} Sáng`;
  }
  static getDateForNote(noteId, newDate) {
    if (!newDate) {
      switch (noteId) {
        //KHÔNG LẤY HÀNG KỊP
        case 'GHN-PCA940':
          return new Date();

        // 'KHÁCH KHÔNG NGHE MÁY'
        case 'GHN-PC8D3E':
        case 'GHN-PC8KA0': 
        case 'GHN-PC8KA1': {
          const now = new Date();
          if (now.getHours() < 14) {
            console.log('sang');
            now.setHours(14);
          } else {
            now.setHours(26);
          }
          now.setMinutes(0);
          return now;
        }
        default:
          return newDate;
      }
    }
    return newDate;
  }
}

export default Utils;
