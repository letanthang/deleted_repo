class Utils {
  static getDisplayStatus(status) {
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
        return 'Đang giao';
    }
  }
  static checkDeliveryComplete(status) {
    const completeList = ['Delivered', 'WaitingToFinish', 'Finish', 'Storing'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }

  static checkPickComplete(status) {
    const completeList = ['', 'Storing'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }

  static checkReturnComplete(status) {
    const completeList = ['', 'Returned'];
    if (completeList.includes(status)) {
      return true;
    }
    return false;
  }
}

export default Utils;
