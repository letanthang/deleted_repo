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
    const completeList = ['WaitingToFinish', 'Returned'];
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

  static checkReturnFail(CurrentStatus, NextStatus) {
    return CurrentStatus === 'Return' && NextStatus === 'Return';
  }

  static getOrder(pds, OrderID, ClientHubID = null, PickDeliveryType = null) {
    let order = null;
    let pickGroups = null;

    if (PickDeliveryType === 2) {
      order = pds.DeliveryItems.find(o => o.OrderID === OrderID);
      return order;
    }
    // PickDeliveryType : 1 || 3 || null

    if (ClientHubID !== null) {
      pickGroups = pds.PickReturnItems.filter(pg => pg.ClientHubID === ClientHubID 
          && pg.PickDeliveryType === PickDeliveryType);
    } else {
      pickGroups = pds.PickReturnItems;
    }
    
    console.log(pickGroups);
    pickGroups.every(pickGroup => {
      const ord = pickGroup.PickReturnSOs.find(o => o.OrderID === OrderID);
      if (ord !== undefined) {
        order = ord;
        return false;
      }
      return true; 
    });
    return order;
  }

  static getReturnGroupFromPG(pds, pickGroup) {
    const { ClientHubID } = pickGroup;
    const returnGroup = pds.PickReturnItems.find(rg => rg.ClientHubID === ClientHubID
      && rg.PickDeliveryType === 3);
    return returnGroup;
  }
  static checkPickGroupHasRP(pds, pickGroup) {
    const { ClientHubID } = pickGroup;
    const returnGroup = pds.PickReturnItems.find(rg => rg.ClientHubID === ClientHubID
      && rg.PickDeliveryType === 3);
    if (returnGroup) return true;
    return false;
  }

}

export default Utils;
