import _ from 'lodash';
import { createSelector } from 'reselect';
import Utils from '../libs/Utils';

export const getOrders = ({ pd }) => pd.PDSItems === null ? null : pd.PDSItems[0];

export const get3Type = createSelector(
  [getOrders],
  PDSItems => {
    console.log('Get3Type');
    const DeliveryItems = _.filter(PDSItems, o => o.PickDeliveryType === 2);
    
    let items = _.filter(PDSItems, o => o.PickDeliveryType === 1);
    let groups = _.groupBy(items, 'ClientHubID');
    const PickItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

      const group = { key: ClientHubID, Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
      group.ShopOrders = orders;
      group.TotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.CODAmount, 0);
      PickItems.push(group);
    });

    items = _.filter(PDSItems, o => o.PickDeliveryType === 3);
    groups = _.groupBy(items, 'ClientHubID');
    const ReturnItems = [];
    _.forEach(groups, (orders, key) => {
      const order = orders[0];
      const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

      const group = { key: ClientHubID, Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
      group.ShopOrders = orders;
      group.TotalServiceCost = _.reduce(group.ShopOrders, (sum, current) => sum + current.CODAmount, 0);
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
          isComplete = isComplete && Utils.checkPickComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;

      // delivery
      const deliveryTotal = DeliveryItems.length;
      const deliveryComplete = deliveryTotal === 0 ? 0 : DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.CurrentStatus)).length;

      // return
      const returnGroupList = ReturnItems;
      const returnTotal = returnGroupList.length;
      const returnComplete = returnTotal === 0 ? 0 : returnGroupList.filter(pg => {
        let isComplete = true;
        pg.ShopOrders.forEach(o => {
          isComplete = isComplete && Utils.checkReturnComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;

  return { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete };
};

