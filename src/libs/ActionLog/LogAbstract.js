import { ActionLogCode } from '../../components/Constant';
import { SendLogs } from '../../apis/MPDS';

class LogAbstract {
  constructor() {
    this.timer = null;
    this.noSendNum = 0;
  }

  log(actionCode, tripCode, userId) {
    console.log('log');
    this.startTimer();
    const data = { actionCode, tripCode, userId };
    this.push(data);
  }

  sendLogs() {
    console.log('sendLogs ' + this.noSendNum);
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
