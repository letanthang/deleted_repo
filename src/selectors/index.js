import _ from 'lodash';
import { createSelector } from 'reselect';
import Utils from '../libs/Utils';

export const getOrders = ({ pd }) => {
  const items = pd.pdsItems === null ? null : pd.pdsItems;
  _.forEach(items, (order) => {
      order.done = Utils.checkComplete(order);
  });
  return items;
};
export const getShopPGroup = ({ pd }) => pd.shopPGroup;
export const getPgroups = ({ pd }) => pd.pgroups;
export const getStopPoints = ({ pd }) => pd.stopPoints;

export const get3Type = createSelector(
  [getOrders, getShopPGroup, getPgroups, getStopPoints],
  (pdsItems, shopPGroup, pgroups, stopPoints) => {
    console.log('Get3Type');
    const DeliveryItems = _.filter(pdsItems, o => o.type === 'DELIVER');
    
    let items = _.filter(pdsItems, o => o.type === 'PICK' || o.type === 'TRANSIT_IN');
    const PickOrders = items;
    const temp = _.groupBy(items, 'senderHubId');

    let groups = {};
    //**** Thang add 03102018 add stop points *****/

    _.forEach(temp, (group, key) => {
      groups[key] = { orders: group };
      groups[key].info = {};
    });

    const stopPointInfo = {};
    _.forEach(stopPoints, (p) => {
      const key = p.contact.contactId;
      if (p.isUpdated !== true || p.isSucceeded !== false) {
        stopPointInfo[key] = p.contact;
        stopPointInfo[key].pointId = p.pointId;
        stopPointInfo[key].scanInfo = { pointId: p.pointId, hashId: p.sessionId, peId: p.peId, token: p.token, postId: key };
      }
    });

    _.forEach(stopPointInfo, (v, k) => {
      if (groups[k] === undefined) {
        groups[k] = { orders: [] };
        groups[k].info = v;
      } else {
        groups[k].info = v;
      }
    });

    let PickItems = [];
    const SpecialItems = [];
    _.forEach(groups, (v, k) => {
      
      const firstOrder = v.orders.length > 0 ? v.orders[0] : {};
      let { senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, type } = firstOrder;
      const { contactId, address, contactName, pointId, scanInfo } = v.info;

      senderHubId = senderHubId || contactId;
      senderAddress = senderAddress || address;
      clientId = clientId || contactId;
      clientName = clientName || contactName;
      senderName = senderName || contactName;
      type = type || 'TRANSIT_IN';
      
      const group = { key: senderHubId, senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, type, pointId, scanInfo };
      group.ShopOrders = v.orders;
      // group.ShopOrders.sort((a, b) => {
      //   const x = a.statusChangeDate ? a.statusChangeDate : 0;
      //   const y = b.statusChangeDate ? b.statusChangeDate : 0;
      //   return x - y;
      // });
      group.done = checkTripDone(group);
      const shopGroup = shopPGroup[senderHubId];
      group.shopGroup = shopGroup;
      group.shopGroupKey = group.done ? 'Đã xong' : shopGroup;
      group.shopGroupName = group.done ? 'Đã xong' : pgroups[shopGroup].groupName;
      group.position = pgroups[group.shopGroupKey].position;
      const sucessUnsyncedOrders = group.ShopOrders.filter(o => Utils.isSuccessedUnsynced(o));
      group.sucessUnsyncedNum = sucessUnsyncedOrders.length;
      const failUnsyncedOrders = group.ShopOrders.filter(o => Utils.isFailedUnsynced(o));
      group.failUnsyncedNum = failUnsyncedOrders.length;
      group.totalServiceCost = _.reduce(sucessUnsyncedOrders, (sum, current) => sum + current.collectAmount, 0);
      group.estimateTotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.collectAmount, 0);
      if (type === 'TRANSIT_IN') {
        SpecialItems.push(group);
      } else {
        PickItems.push(group);
      }
    });

    PickItems = SpecialItems.concat(PickItems);



    items = _.filter(pdsItems, o => o.type === 'RETURN');
    const ReturnOrders = items;
    groups = _.groupBy(items, 'senderHubId');
    const ReturnItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, Lat, Lng, type } = order;

      const group = { key: senderHubId, senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, Lat, Lng, type };
      group.ShopOrders = orders;
      // group.ShopOrders.sort((a, b) => {
      //   const x = a.statusChangeDate ? a.statusChangeDate : 0;
      //   const y = b.statusChangeDate ? b.statusChangeDate : 0;
      //   return x - y;
      // });
      const sucessUnsyncedOrders = group.ShopOrders.filter(o => Utils.isSuccessedUnsynced(o));
      group.sucessUnsyncedNum = sucessUnsyncedOrders.length;
      const failUnsyncedOrders = group.ShopOrders.filter(o => Utils.isFailedUnsynced(o));
      group.failUnsyncedNum = failUnsyncedOrders.length;
      group.totalServiceCost = _.reduce(sucessUnsyncedOrders, (sum, current) => sum + current.collectAmount, 0);
      group.estimateTotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.collectAmount, 0);
      ReturnItems.push(group);
    });



    // TRANSIT_IN
    items = _.filter(pdsItems, o => o.type === 'TRANSIT_IN123');
    const CvsOrders = items;
    groups = _.groupBy(items, 'senderHubId');
    const CvsItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, Lat, Lng, type } = order;

      const group = { key: senderHubId, senderAddress, senderHubId, clientId, clientName, senderName, senderPhone, inTripIndex, Lat, Lng, type };
      group.ShopOrders = orders;
      
      group.done = checkTripDone(group);
      const shopGroup = shopPGroup[senderHubId];
      group.shopGroup = shopGroup;
      group.shopGroupKey = group.done ? 'Đã xong' : shopGroup;
      group.shopGroupName = group.done ? 'Đã xong' : pgroups[shopGroup].groupName;
      group.position = pgroups[group.shopGroupKey].position;
      const sucessUnsyncedOrders = group.ShopOrders.filter(o => Utils.isSuccessedUnsynced(o));
      group.sucessUnsyncedNum = sucessUnsyncedOrders.length;
      const failUnsyncedOrders = group.ShopOrders.filter(o => Utils.isFailedUnsynced(o));
      group.failUnsyncedNum = failUnsyncedOrders.length;
      group.totalServiceCost = _.reduce(sucessUnsyncedOrders, (sum, current) => sum + current.collectAmount, 0);
      group.estimateTotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.collectAmount, 0);
      CvsItems.push(group);
    });


    return { PickItems, DeliveryItems, ReturnItems, CvsItems, PickOrders, ReturnOrders, CvsOrders };
  }
);

export const getNumbers = createSelector(
  [get3Type],
  ({ PickItems, DeliveryItems, ReturnItems, CvsItems, PickOrders, ReturnOrders, CvsOrders }) => {
    return calculateStatNumbers({ PickItems, DeliveryItems, ReturnItems, CvsItems, PickOrders, ReturnOrders, CvsOrders });
  }
);


const calculateStatNumbers = ({ PickItems, DeliveryItems, ReturnItems, CvsItems, PickOrders, ReturnOrders, CvsOrders }) => {
  // pick
      const pickGroupList = PickItems;
      const pickTotal = pickGroupList.length;
      const pickComplete = pickTotal === 0 ? 0 : pickGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && o.done;
        });
        return isComplete;
      }).length;

      const pickOrderTotal = PickOrders.length;
      const pickOrderComplete = PickOrders.filter(o => o.done).length;

      // delivery
      const deliveryTotal = DeliveryItems.length;
      const deliveryComplete = deliveryTotal === 0 ? 0 : DeliveryItems.filter(o => o.done).length;

      // return
      const returnGroupList = ReturnItems;
      const returnTotal = returnGroupList.length;
      const returnComplete = returnTotal === 0 ? 0 : returnGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && o.done;
        });
        return isComplete;
      }).length;

      const returnOrderTotal = ReturnOrders.length;
      const returnOrderComplete = ReturnOrders.filter(o => o.done).length;

      // cvs
      const cvsGroupList = CvsItems;
      const cvsTotal = cvsGroupList.length;
      const cvsComplete = cvsTotal === 0 ? 0 : cvsGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && o.done;
        });
        return isComplete;
      }).length;

      const cvsOrderTotal = CvsOrders.length;
      const cvsOrderComplete = CvsOrders.filter(o => o.done).length;

  return { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete, cvsTotal, cvsComplete, pickOrderTotal, pickOrderComplete, returnOrderTotal, returnOrderComplete, cvsOrderTotal, cvsOrderComplete };
};

const checkTripDone = trip => {
  const ordersNum = trip.ShopOrders.length;
  if (ordersNum === 0) return false;

  const completedNum = trip.ShopOrders.filter(o => o.done).length;
  return (ordersNum === completedNum);
};
