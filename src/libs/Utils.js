class Utils {
  static getDisplayStatus(status) {
    switch (status) {
      case 'Delivering':
        return 'Đang giao';
      case 'Delivered':
        return 'Đã giao';
      case 'WaitingToFinish':
        return 'Đã giao';
      case 'Storing':
        return 'giao lỗi';
      default:
        return 'Đang giao';
    }
  }
}

export default Utils;
