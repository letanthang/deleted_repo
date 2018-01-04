import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS, 
  PD_ADD_ORDER, PD_ADD_ORDER_START, PD_ADD_ORDER_FAIL
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  PDSItems: null,
  pdsId: null,
  currentDeliveryOrder: null,
  pickTotal: 0,
  pickComplete: 0,
  deliveryTotal: 0,
  deliveryComplete: 0,
  returnTotal: 0,
  returnComplete: 0,
  loading: false,
  addOrderLoading: false,
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
      const { PDSItems, EmployeeFullName, CoordinatorFullName, CoordinatorPhone, PickDeliverySessionID } = pds;
      
      return { 
        ...state,
        PDSItems,
        Infos: { EmployeeFullName, CoordinatorFullName, CoordinatorPhone, PickDeliverySessionID },
        pdsId: PickDeliverySessionID,
        loading: false,
        error: '',
      };
    }
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PDLIST_NO_TRIP:
      return { ...nameInitialState, error: 'Không tìm thấy CĐ hoặc CĐ đã kết thúc.' };
    
    case UPDATE_ORDER_STATUS: {
      const OrderInfos = action.payload.OrderInfos;

      const pds = _.cloneDeep(state.pds);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pds, info.OrderID, info.PickDeliveryType);
          order.CurrentStatus = 'Progress';
      });
      
      const statNumbers = transformPDS(pds);

      return {
        ...state,
        ...statNumbers,
        pds,
        //loading: true
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

      const OrderInfos = action.payload.OrderInfos;
      const FailedOrders = action.payload.FailedOrders;
      let ids = [];
      if (FailedOrders instanceof Array && FailedOrders.length > 0) {
        ids = FailedOrders.map(o => o.order_id);
      }

      const pds = _.cloneDeep(state.pds);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pds, info.OrderID, info.PickDeliveryType);
          if (ids.length > 0 && ids.includes(info.OrderID)) {
            switch (info.PickDeliveryType) {
              case 1:
                order.CurrentStatus = 'Picking';
                break;
              case 2:
                order.CurrentStatus = 'Delivering';
                break;
              case 3:
                order.CurrentStatus = 'Returning';
                break;
              default:
                break;
            }
          } else {
            order.CurrentStatus = info.NextStatus;
          }
      });
      
      const statNumbers = transformPDS(pds);

      return {
        ...state,
        ...statNumbers,
        loading: false,
        error: '',
        pds,
      };
    }

    case PD_ADD_ORDER_START:
      return {
        ...state,
        addOrderLoading: true
      };
    case PD_ADD_ORDER_FAIL:
      return {
        ...state,
        addOrderLoading: false
      };
    case PD_ADD_ORDER: {
      console.log('addOrder reducer');
      const order = action.payload.order;
      console.log(order);
      const pds = _.cloneDeep(state.pds);
      pds.PDSItems.push(order);
      
      const statNumbers = transformPDS(pds);

      return {
        ...state,
        ...statNumbers,
        addOrderLoading: false,
        error: '',
        pds,
      };
    }

    case PD_UPDATE_WEIGHT_SIZE:
      return { ...state, loading: true };

    case PD_UPDATE_WEIGHT_SIZE_FAIL:
      return { ...state, loading: false };

    case PD_UPDATE_WEIGHT_SIZE_SUCCESS: {
      const pds = state.pds;
      const { OrderID, ServiceCost, Length, Width, Height, Weight } = action.payload;
      const order = Utils.getOrder(pds, OrderID, 1);
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

const getKey = (orderID, type) => `${orderID}-${type}`;

const transformPDS = (pds) => {
  // create PickItems, DeliveryItems, ReturnItems
  const temp = {};
  pds.PDSItems.forEach(item => {
    temp[getKey(item.OrderID, item.PickDeliveryType)] = item;
  });
  pds.PDSItems = [temp];
};

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

