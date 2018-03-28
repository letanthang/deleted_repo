import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS,
  PD_ADD_ORDER, PD_ADD_ORDER_START, PD_ADD_ORDER_FAIL, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP, PD_STOP_LOADING
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  pdsItems: null,
  Infos: null,
  pdsId: null,
  pdsCode: null,
  lastUpdatedTime: null,
  timeServer: null,
  loading: false,
  addOrderLoading: false,
  groups: {
    'Đã xong': { groupName: 'Đã xong', isActive: false, position: 100 },
    undefined: { groupName: 'Mặc định', isActive: true, position: 0 },
  },
  pgroups: {
    'Đã xong': { groupName: 'Đã xong', isActive: false, position: 100 },
    undefined: { groupName: 'Mặc định', isActive: true, position: 0 },
  },
  shopPGroup: {},
  error: ''
};

export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PDLIST_FETCH:
      // turn on spinner
      return { ...state, loading: true, error: '' };
    case PDLIST_FETCH_SUCCESS: {
      const { pds, all } = action.payload;
      transformPDS(pds);
      const { employeeFullName, coordinatorFullName, coordinatorPhone, pickDeliverySessionID, pdsCode, lastUpdatedTime, timeServer } = pds;

      let pdsItems = null;
      let groups = state.groups;
      const newItems = pds.pdsItems;
      if (state.pdsId === pickDeliverySessionID) { 
        // old trips
        const oldItems = state.pdsItems ? state.pdsItems[0] : null;
        pdsItems = mergeState(oldItems, newItems, all);
      } else { 
        // new trips
        pdsItems = newItems;
        groups = nameInitialState.groups;
      }
      
      return {
        ...state,
        pdsItems: [pdsItems],
        Infos: { employeeFullName, coordinatorFullName, coordinatorPhone, pickDeliverySessionID },
        pdsId: pickDeliverySessionID,
        pdsCode,
        lastUpdatedTime,
        timeServer,
        groups,
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
      const pdsItems = _.cloneDeep(state.pdsItems);

      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pdsItems[0], info.orderCode, info.pickDeliveryType);
          order.currentStatus = 'Progress';
      });
      

      return {
        ...state,
        pdsItems
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      const { OrderInfos, error } = action.payload;

      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pdsItems[0], info.orderCode, info.pickDeliveryType);
          switch (info.pickDeliveryType) {
            case 1:
              order.currentStatus = 'PICKING';
              break;
            case 2:
              order.currentStatus = 'DELIVERING';
              break;
            case 3:
              order.currentStatus = 'RETURNING';
              break;
            default:
              break;
          }
      });

      return {
        ...state,
        pdsItems,
        loading: false,
        error
      };
    }

  // [
  //   {  
  //     PDSDetailID,
  //     orderCode,
  //     PDSType,
  //     nextStatus,
  //     clientHubId,
  //     StoringCode,
  //     NewDate,
  //     log
  //   },
  //   ...
  // ]

    case UPDATE_ORDER_STATUS_SUCCESS: {

      const OrderInfos = action.payload.OrderInfos;
      const FailedOrders = action.payload.FailedOrders;
      let ids = [];
      if (FailedOrders instanceof Array && FailedOrders.length > 0) {
        ids = FailedOrders.map(o => o.orderCode);
      }

      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(pdsItems[0], info.orderCode, info.pickDeliveryType);
          if (ids.length > 0 && ids.includes(info.orderCode)) {
            switch (info.pickDeliveryType) {
              case 1:
                order.currentStatus = 'PICKING';
                break;
              case 2:
                order.currentStatus = 'DELIVERING';
                break;
              case 3:
                order.currentStatus = 'RETURNING';
                break;
              default:
                break;
            }
          } else {
            order.currentStatus = info.nextStatus;
            order.nextStatus = undefined;
            order.success = undefined;
          }
      });
      

      return {
        ...state,
        loading: false,
        error: '',
        pdsItems,
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
      const order = action.payload.order;
      const pdsItems = _.cloneDeep(state.pdsItems);
      pdsItems[0][getKey(order.orderCode, order.pickDeliveryType)] = order;
      return {
        ...state,
        pdsItems,
        addOrderLoading: false,
        error: '',
      };
    }

    case PD_UPDATE_WEIGHT_SIZE:
      return { ...state, loading: true };

    case PD_UPDATE_WEIGHT_SIZE_FAIL:
      return { ...state, loading: false };

    case PD_UPDATE_WEIGHT_SIZE_SUCCESS: {
      const pdsItems = _.cloneDeep(state.pdsItems);
      const { orderCode, serviceCost, length, width, height, weight } = action.payload;
      const order = Utils.getOrder(pdsItems[0], orderCode, 1);
      if (order.senderPay != 0) {
        order.senderPay = serviceCost;
      }
      
      order.length = length;
      order.weight = weight;
      order.height = height;
      order.width = width;
      return { ...state, pdsItems, loading: false };
    }

    case PD_UPDATE_GROUP: {
      const pds = _.cloneDeep(state.pds);
      //const pds = state.pds;
      const orders = pds.DeliveryItems;
      const orderGroup = action.payload;
      orders.forEach((order, index) => {
        const group = orderGroup[order.orderCode];
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
      return { ...state, pds };
    }

    case PD_UPDATE_ORDER_INFO: {
      const { orderCode, pickDeliveryType, info } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      const item = pdsItems[0][getKey(orderCode, pickDeliveryType)];
      const statusChangeDate = info.success === undefined ? undefined : Date.now();
      const dateInfo = (item.success !== undefined && info.success !== undefined) ? {} : { statusChangeDate };
      Object.assign(item, dateInfo, info);
      return { ...state, pdsItems };
    }
     
    case PD_UPDATE_ORDER_INFOS: {
      const { OrderInfos } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, info => {
        const { orderCode, pickDeliveryType } = info;
        const statusChangeDate = info.success === undefined ? undefined : Date.now();
        Object.assign(pdsItems[0][getKey(orderCode, pickDeliveryType)], { statusChangeDate }, info);
      });
      
      return { ...state, pdsItems };
    }

    case PD_TOGGLE_GROUP_ACTIVE: {
      const { groupIndex } = action.payload;
      const group = _.clone(state.groups[groupIndex]);
      group.isActive = !group.isActive;
      return { 
        ...state, 
        groups: {
          ...state.groups,
          [groupIndex]: group
        }
      };
    }

    case PD_TOGGLE_ORDER_GROUP: {
      const { orderCode } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      const order = pdsItems[0][getKey(orderCode, 2)];
      order.groupChecked = !order.groupChecked;
      return { ...state, pdsItems };
    }

    case PD_CREATE_GROUP: {
      const { groupName } = action.payload;
      return {
        ...state,
        groups: {
          ...state.groups,
          [groupName]: { groupName, isActive: false, position: 1 }
        }
      };
    }

    case PD_RESET_GROUP: {
      const pdsItems = _.cloneDeep(state.pdsItems);
      _.filter(pdsItems[0], o => o.group !== undefined).forEach(o => { delete o.group; delete o.groupChecked; });
      return {
        ...state,
        groups: nameInitialState.groups,
        pdsItems
      };
    }

    case PD_UPDATE_ORDERS: {
      const { orders } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      pdsItems[0] = { ...pdsItems[0], ...orders };
      return { ...state, pdsItems };
    }

    case PD_CREATE_PGROUP: {
      const { groupName } = action.payload;
      return {
        ...state,
        pgroups: {
          ...state.pgroups,
          [groupName]: { groupName, position: 1 }
        }
      };
    }

    case PD_RESET_PGROUP: {
      return {
        ...state,
        pgroups: nameInitialState.pgroups,
        shopPGroup: nameInitialState.shopPGroup
      };
    }

    case PD_UPDATE_SHOP_PGROUP: {
      const { groups, groupName } = action.payload;
      const shopPGroup = _.clone(state.shopPGroup);
      _.each(groups, (item, key) => {
        if (item === true) {
          shopPGroup[key] = groupName;
        }
      });

      return { ...state, shopPGroup };
    }

    case PD_STOP_LOADING: {
      return {
        ...state,
        loading: false
      };
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
  pds.pdsItems.forEach(item => {
    delete item.nextStatus;
    temp[getKey(item.orderCode, item.pickDeliveryType)] = item;
  });
  pds.pdsItems = temp;
};

const addGroup = (pds, orderGroup) => {
  pds.DeliveryItems.forEach((order, index) => {
    pds.DeliveryItems[index].Group = orderGroup[order.orderCode] || null;
  });

  //add 'key' for order
  pds.pdsItems.forEach((order, index) => {
    pds.pdsItems[index].key = order.orderCode;
  });
};

const mergeState = (oldState, newState, all) => {
  if (oldState === null) return newState;
  const temp = all ? {} : _.clone(oldState);
  _.each(newState, (item, key) => {
    temp[key] = Object.assign({}, oldState[key], item);
  });
  return temp;
};
