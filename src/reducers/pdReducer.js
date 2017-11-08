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
      // turn on spinner
      return { ...state, loading: true, error: '' };
    case PDLIST_FETCH_SUCCESS: {
      const pds = action.payload.pds;
      transformPDS(pds);
      addGroup(pds, action.payload.orderGroup);
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
      return { ...nameInitialState, error: 'Không tìm thấy CĐ hoặc CĐ đã kết thúc.' };
    
    case UPDATE_ORDER_STATUS: {
      return {
        ...state,
        loading: true
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      return {
        ...state,
        loading: false,
        error: 'update status fail'
      };
    }

  // [
  //   {  
  //     PDSDetailID,
  //     OrderID,
  //     PDSType,
  //     NextStatus,
  //     ClientHubID,
  //     StoringCode,
  //     NewDate,
  //     Log
  //   },
  //   ...
  // ]

    case UPDATE_ORDER_STATUS_SUCCESS: {

      const OrderInfos = action.payload;

      const pds = _.cloneDeep(state.pds);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pds, info.OrderID);
          order.CurrentStatus = info.NextStatus;
      });
      
      transformPDS(pds);
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(pds);     

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
      orders.forEach((order, index) => {
        const group = orderGroup[order.OrderID];
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
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
  _.forEach(groups, (orders, key) => {
    const order = orders[0];
    const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

    const group = { key: ClientHubID, Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
    group.PickReturnSOs = orders;
    pds.PickItems.push(group);
  });

  items = pds.PDSItems.filter(o => o.PickDeliveryType === 3);
  groups = _.groupBy(items, 'ClientHubID');
  pds.ReturnItems = [];
  _.forEach(groups, (orders, key) => {
    const order = orders[0];
    const { Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType } = order;

    const group = { key: ClientHubID, Address, ClientHubID, ClientID, ClientName, ContactName, ContactPhone, DisplayOrder, Lat, Lng, PickDeliveryType };
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

