import _ from 'lodash';
import { createSelector } from 'reselect';
import Utils from '../libs/Utils';

export const getOrders = ({ pd }) => pd.pdsItems === null ? null : pd.pdsItems[0];
export const getShopPGroup = ({ pd }) => pd.shopPGroup;
export const getPgroups = ({ pd }) => pd.pgroups;

export const get3Type = createSelector(
  [getOrders, getShopPGroup, getPgroups],
  (pdsItems, shopPGroup, pgroups) => {
    // console.log('Get3Type');
    const DeliveryItems = _.filter(pdsItems, o => o.pickDeliveryType === 2);
    
    let items = _.filter(pdsItems, o => o.pickDeliveryType === 1);
    let groups = _.groupBy(items, 'clientHubId');
    const PickItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { address, clientHubId, clientId, clientName, contactName, contactPhone, displayOrder, Lat, Lng, pickDeliveryType } = order;
      
      // console.log(shopGroup); console.log(pgroups); console.log(shopGroupName);
      const group = { key: clientHubId, address, clientHubId, clientId, clientName, contactName, contactPhone, displayOrder, Lat, Lng, pickDeliveryType };
      group.ShopOrders = orders;
      group.ShopOrders.sort((a, b) => {
        const x = a.statusChangeDate ? a.statusChangeDate : 0;
        const y = b.statusChangeDate ? b.statusChangeDate : 0;
        return x - y;
      });
      group.done = checkTripDone(group);
      const shopGroup = shopPGroup[clientHubId];
      group.shopGroup = shopGroup;
      group.shopGroupKey = group.done ? 'Đã xong' : shopGroup;
      group.shopGroupName = group.done ? 'Đã xong' : pgroups[shopGroup].groupName;
      group.position = pgroups[group.shopGroupKey].position;
      const sucessUnsyncedOrders = group.ShopOrders.filter(o => Utils.isPickSuccessedUnsynced(o));
      group.sucessUnsyncedNum = sucessUnsyncedOrders.length;
      group.totalServiceCost = _.reduce(sucessUnsyncedOrders, (sum, current) => sum + current.senderPay, 0);
      group.estimateTotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.senderPay, 0);
      PickItems.push(group);
    });

    items = _.filter(pdsItems, o => o.pickDeliveryType === 3);
    groups = _.groupBy(items, 'clientHubId');
    const ReturnItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { address, clientHubId, clientId, clientName, contactName, contactPhone, displayOrder, Lat, Lng, pickDeliveryType } = order;

      const group = { key: clientHubId, address, clientHubId, clientId, clientName, contactName, contactPhone, displayOrder, Lat, Lng, pickDeliveryType };
      group.ShopOrders = orders;
      group.ShopOrders.sort((a, b) => {
        const x = a.statusChangeDate ? a.statusChangeDate : 0;
        const y = b.statusChangeDate ? b.statusChangeDate : 0;
        return x - y;
      });      
      const sucessUnsyncedOrders = group.ShopOrders.filter(o => Utils.isReturnSuccessedUnsynced(o));
      group.sucessUnsyncedNum = sucessUnsyncedOrders.length;
      group.totalServiceCost = _.reduce(sucessUnsyncedOrders, (sum, current) => sum + current.returnPay, 0);
      group.estimateTotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.returnPay, 0);
      ReturnItems.push(group);
    });

    return { PickItems, DeliveryItems, ReturnItems };
  }
);

export const getNumbers = createSelector(
  [get3Type],
  ({ PickItems, DeliveryItems, ReturnItems }) => {
    return calculateStatNumbers({ PickItems, DeliveryItems, ReturnItems });
  }
);


const calculateStatNumbers = ({ PickItems, DeliveryItems, ReturnItems }) => {
  // pick
      const pickGroupList = PickItems;
      const pickTotal = pickGroupList.length;
      const pickComplete = pickTotal === 0 ? 0 : pickGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && Utils.checkPickComplete(o.currentStatus);
        });
        return isComplete;
      }).length;

      // delivery
      const deliveryTotal = DeliveryItems.length;
      const deliveryComplete = deliveryTotal === 0 ? 0 : DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.currentStatus)).length;

      // return
      const returnGroupList = ReturnItems;
      const returnTotal = returnGroupList.length;
      const returnComplete = returnTotal === 0 ? 0 : returnGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && Utils.checkReturnComplete(o.currentStatus);
        });
        return isComplete;
      }).length;

  return { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete };
};

const checkTripDone = trip => {
  const ordersNum = trip.ShopOrders.length;
  const completedNum = trip.ShopOrders.filter(o => Utils.checkPickComplete(o.currentStatus)).length;
  return (ordersNum === completedNum);
};
