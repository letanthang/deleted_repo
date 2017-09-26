import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  pds: null,
  pdsId: null,
  currentDeliveryOrder: null,
  pickTotal: 0,
  pickComplete: 0,
  deliveryTotal: 0,
  deliveryComplete: 0,
  returnTotal: 0,
  returnComplete: 0,
  loading: false,
  error: ''
};

export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PDLIST_FETCH:
      console.log('turn on spinner');
      return { ...state, loading: true, error: '' };
    case PDLIST_FETCH_SUCCESS: {
      console.log('update home screen with numbers');
      const pds = action.payload.pds;
      transformPDS(pds);
      addGroup(pds, action.payload.orderGroup);
      console.log('pds add group');
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(pds);
      
      
      return { ...state, 
        error: '',
        pds,
        pdsId: pds.PickDeliverySessionID, 
        loading: false,
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete
      };
    }
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PDLIST_NO_TRIP:
      return { ...nameInitialState, error: action.payload };
    
    case UPDATE_ORDER_STATUS: {
      console.log('pdReducer: UPDATE_ORDER_STATUS !!!!!!turn on spinner!!!!!');
      return {
        ...state,
        loading: true
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      console.log('pdReducer: UPDATE_ORDER_STATUS_FAIL');
      return {
        ...state,
        loading: false,
        error: 'update status fail'
      };
    }

    case UPDATE_ORDER_STATUS_SUCCESS: {
      console.log('================================================');
      console.log('pdReducer: UPDATE_ORDER_STATUS_SUCCESS is called');
      console.log('state before:');
      console.log(state.pds);

      const { OrderID, PickDeliveryType, CurrentStatus, ClientHubID } = action.payload;
      let orderIds;
      if (OrderID instanceof Array) {
        orderIds = _.map(OrderID, item => item.OrderID);
      } else {
        orderIds = [OrderID];
      }

      const pds = _.cloneDeep(state.pds);
      _.each(orderIds, ID => {
        if (PickDeliveryType === 2) {
          order = Utils.getOrder(pds, ID, null, 2);
          //order.CurrentStatus = 'WaitingToFinish';
          order.CurrentStatus = CurrentStatus;
        } else {
          order = Utils.getOrder(pds, ID, ClientHubID, PickDeliveryType);
          order.CurrentStatus = CurrentStatus;
          order.NextStatus = CurrentStatus;
        }
      });
      let order = {};
      
      
      transformPDS(pds);

      console.log('state after:');
      console.log(pds);
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(pds);     

      console.log('================================================');
      return {
        ...state,
        loading: false,
        error: '',
        pds,
        deliveryTotal,
        deliveryComplete,
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete
      };
    }

    case PD_UPDATE_WEIGHT_SIZE:
      return { ...state, loading: true };

    case PD_UPDATE_WEIGHT_SIZE_FAIL:
      return { ...state, loading: false };

    case PD_UPDATE_WEIGHT_SIZE_SUCCESS: {
      const pds = state.pds;
      const { OrderID, ClientHubID, ServiceCost, Length, Width, Height, Weight } = action.payload;
      const order = Utils.getOrder(pds, OrderID, ClientHubID, 1);
      if (order.CODAmount != 0) {
        order.CODAmount = ServiceCost;
      }
      
      order.Length = Length;
      order.Weight = Weight;
      order.Height = Height;
      order.Width = Width;
      return { ...state, pds, loading: false };
    }

    case PD_UPDATE_GROUP: {
      const pds = _.cloneDeep(state.pds);
      //const pds = state.pds;
      const orders = pds.DeliveryItems;
      const orderGroup = action.payload;
      console.log('pdReducer: Pd udpate group');
      console.log(orderGroup);
      orders.forEach((order, index) => {
        const group = orderGroup[order.OrderID];
        console.log(order.OrderID);
        console.log(group);
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
      console.log(orders);
      console.log(pds);
      return { ...state, pds };
    }
      
    default:
      return state;
  }
};

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
//
//

const transformPDS = (pds) => {
  // create PickItems, DeliveryItems, ReturnItems
  pds.DeliveryItems = pds.PDSItems.filter(o => o.PickDeliveryType === 2);

  let items = pds.PDSItems.filter(o => o.PickDeliveryType === 1);
  let groups = _.groupBy(items, 'ClientHubID');
  pds.PickItems = [];
  _.forEach(groups, (orders,key) => {
    const order = orders[0];
    const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

    const group = { key: ClientHubID, Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
    group.PickReturnSOs = orders;
    pds.PickItems.push(group);
  });

  items = pds.PDSItems.filter(o => o.PickDeliveryType === 3);
  groups = _.groupBy(items, 'ClientHubID');
  pds.ReturnItems = [];
  _.forEach(groups, (orders,key) => {
    const order = orders[0];
    const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

    const group = { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
    group.PickReturnSOs = orders;
    pds.ReturnItems.push(group);
  });
}

const addGroup = (pds, orderGroup) => {
  pds.DeliveryItems.forEach((order, index) => {
    pds.DeliveryItems[index].Group = orderGroup[order.OrderID] || null;
  });

  //add 'key' for order
  pds.PDSItems.forEach((order, index) => {
    pds.PDSItems[index].key = order.OrderID;
  });
};

const calculateStatNumbers = (pds) => {
  // pick
      const pickGroupList = pds.PickItems;
      const pickTotal = pickGroupList.length;
      const pickComplete = pickTotal === 0 ? 0 : pickGroupList.filter(pg => {
        let isComplete = true;
        pg.PickReturnSOs.forEach(o => {
          isComplete = isComplete && Utils.checkPickComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;
      console.log(`fetch success with pickComplete = ${pickComplete}`);

      // delivery
      const deliveryTotal = pds.DeliveryItems.length;
      const deliveryComplete = deliveryTotal === 0 ? 0 : pds.DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.CurrentStatus)).length;

      // return
      const returnGroupList = pds.ReturnItems;
      const returnTotal = returnGroupList.length;
      const returnComplete = returnTotal === 0 ? 0 : returnGroupList.filter(pg => {
        let isComplete = true;
        pg.PickReturnSOs.forEach(o => {
          isComplete = isComplete && Utils.checkReturnComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;

  return { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete };
};

