
import { SendLogs } from '../../apis/MPDS';
import { ActionLogCode, ScreenCode, ScreenGroup } from '../../components/Constant';
class LogAbstract {
  constructor() {
    this.timer = null;
    this.noSendNum = 0;
    this.userId = null;
    this.userName = null;
    this.tripCode = null;
    // console.log(DeviceInfo);
  }

  // getUserAgent() {
  //   // DeviceInfo.get
  //   return DeviceInfo.getUserAgent();
  // }

  log(actionCode, navigation) {
    const screenName = navigation.state.routeName;
    const { userId, userName, tripCode } = this;
    const screenId = ScreenCode[screenName];
    const featureId = ScreenGroup[screenId];
    const data = { actionCode, tripCode, userId, userName, screenId, status: 'OK', system: 'APP_DRIVER', featureId };
    // console.log('log', data);
    // this.sendLog(data);
  }

  logs(actionCode, navigation) {
    const screenName = navigation.state.routeName;
    this.startTimer();
    const { userId, tripCode, userName } = this;
    const screenId = ScreenCode[screenName];
    const featureId = ScreenGroup[screenId];
    const data = { actionCode, tripCode, userId, userName, screenId, status: 'OK', system: 'APP_DRIVER', featureId };
    // console.log('log', data);
    this.push(data);
  }

  sendLogs() {
    // console.log('sendLogs ' + this.noSendNum);
    const datas = this.getAll();
    if (datas && datas.length > 0) {
      SendLogs(datas);
      this.clearAll();
      this.noSendNum = 0;
    } else {
      this.noSendNum += 1;
      if (this.noSendNum === 5) {
        this.stopTimer();
      }
    }
  }

  async sendLog(data) {
    await SendLogs(data);
    // console.log('Xong');
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
    this.noSendNum = 0;
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.sendLogs();
      }, 2000);
    }
  }
   
  push(data) {
    throw new Error('You have to implement the method push(data)!');
  }

  getAll() {
    throw new Error('You have to implement the method push(data)!');
  }

  clearAll() {
    throw new Error('You have to implement the method push(data)!');
  }
}

export default LogAbstract;
