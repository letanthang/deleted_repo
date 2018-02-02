import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS,
  PD_ADD_ORDER, PD_ADD_ORDER_START, PD_ADD_ORDER_FAIL, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  PDSItems: null,
  Infos: null,
  pdsId: null,
  pdsCode: null,
  lastUpdatedTime: null,
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
      const pds = action.payload.pds;
      transformPDS(pds);
      const { EmployeeFullName, CoordinatorFullName, CoordinatorPhone, PickDeliverySessionID, PDSCode, lastUpdatedTime } = pds;

      let PDSItems = null;
      let groups = state.groups;
      const newItems = pds.PDSItems;
      if (state.pdsId === PickDeliverySessionID) { 
        // old trips
        const oldItems = state.PDSItems ? state.PDSItems[0] : null;
        PDSItems = mergeState(oldItems, newItems);
      } else { 
        // new trips
        PDSItems = newItems;
        groups = nameInitialState.groups;
      }
      
      return {
        ...state,
        PDSItems: [PDSItems],
        Infos: { EmployeeFullName, CoordinatorFullName, CoordinatorPhone, PickDeliverySessionID },
        pdsId: PickDeliverySessionID,
        pdsCode: PDSCode,
        lastUpdatedTime,
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
      const PDSItems = _.cloneDeep(state.PDSItems);

      _.each(OrderInfos, info => {
          const order = Utils.getOrder(PDSItems[0], info.OrderCode, info.PickDeliveryType);
          order.CurrentStatus = 'Progress';
      });
      

      return {
        ...state,
        PDSItems
        //loading: true
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      const { OrderInfos, error } = action.payload;

      const PDSItems = _.cloneDeep(state.PDSItems);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(PDSItems[0], info.OrderCode, info.PickDeliveryType);
          switch (info.PickDeliveryType) {
            case 1:
              order.CurrentStatus = 'PICKING';
              break;
            case 2:
              order.CurrentStatus = 'DELIVERING';
              break;
            case 3:
              order.CurrentStatus = 'RETURNING';
              break;
            default:
              break;
          }
      });

      return {
        ...state,
        PDSItems,
        loading: false,
        error
      };
    }

  // [
  //   {  
  //     PDSDetailID,
  //     OrderCode,
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
        ids = FailedOrders.map(o => o.orderCode);
      }

      const PDSItems = _.cloneDeep(state.PDSItems);
      _.each(OrderInfos, info => {
          const order = Utils.getOrder(PDSItems[0], info.OrderCode, info.PickDeliveryType);
          if (ids.length > 0 && ids.includes(info.OrderCode)) {
            switch (info.PickDeliveryType) {
              case 1:
                order.CurrentStatus = 'PICKING';
                break;
              case 2:
                order.CurrentStatus = 'DELIVERING';
                break;
              case 3:
                order.CurrentStatus = 'RETURNING';
                break;
              default:
                break;
            }
          } else {
            order.CurrentStatus = info.NextStatus;
            order.NextStatus = undefined;
            order.success = undefined;
          }
      });
      

      return {
        ...state,
        loading: false,
        error: '',
        PDSItems,
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
      return {
        ...state,
        PDSItems: {
          ...state.PDSItems,
          0: {
            ...state.PDSItems[0],
            [getKey(order.OrderCode, order.PickDeliveryType)]: order
          }
        },
        addOrderLoading: false,
        error: '',
      };
    }

    case PD_UPDATE_WEIGHT_SIZE:
      return { ...state, loading: true };

    case PD_UPDATE_WEIGHT_SIZE_FAIL:
      return { ...state, loading: false };

    case PD_UPDATE_WEIGHT_SIZE_SUCCESS: {
      const PDSItems = _.cloneDeep(state.PDSItems);
      const { OrderCode, ServiceCost, Length, Width, Height, Weight } = action.payload;
      const order = Utils.getOrder(PDSItems[0], OrderCode, 1);
      if (order.CODAmount != 0) {
        order.CODAmount = ServiceCost;
      }
      
      order.Length = Length;
      order.Weight = Weight;
      order.Height = Height;
      order.Width = Width;
      return { ...state, PDSItems, loading: false };
    }

    case PD_UPDATE_GROUP: {
      const pds = _.cloneDeep(state.pds);
      //const pds = state.pds;
      const orders = pds.DeliveryItems;
      const orderGroup = action.payload;
      orders.forEach((order, index) => {
        const group = orderGroup[order.OrderCode];
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
      return { ...state, pds };
    }

    case PD_UPDATE_ORDER_INFO: {
      const { OrderCode, PickDeliveryType, info } = action.payload;
      const PDSItems = _.cloneDeep(state.PDSItems);
      const item = PDSItems[0][getKey(OrderCode, PickDeliveryType)];
      const statusChangeDate = info.success === undefined ? undefined : Date.now();
      const dateInfo = (item.success !== undefined && info.success !== undefined) ? {} : { statusChangeDate };
      Object.assign(item, dateInfo, info);
      return { ...state, PDSItems };
    }
     
    case PD_UPDATE_ORDER_INFOS: {
      const { OrderInfos } = action.payload;
      const PDSItems = _.cloneDeep(state.PDSItems);
      _.each(OrderInfos, info => {
        const { OrderCode, PickDeliveryType } = info;
        const statusChangeDate = info.success === undefined ? undefined : Date.now();
        Object.assign(PDSItems[0][getKey(OrderCode, PickDeliveryType)], { statusChangeDate }, info);
      });
      
      return { ...state, PDSItems };
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
      const { OrderCode } = action.payload;
      const PDSItems = _.cloneDeep(state.PDSItems);
      const order = PDSItems[0][getKey(OrderCode, 2)];
      order.groupChecked = !order.groupChecked;
      return { ...state, PDSItems };
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
      const PDSItems = _.cloneDeep(state.PDSItems);
      _.filter(PDSItems[0], o => o.group !== undefined).forEach(o => { delete o.group; delete o.groupChecked; });
      return {
        ...state,
        groups: nameInitialState.groups,
        PDSItems
      };
    }

    case PD_UPDATE_ORDERS: {
      const { orders } = action.payload;
      const PDSItems = _.cloneDeep(state.PDSItems);
      PDSItems[0] = { ...PDSItems[0], ...orders };
      return { ...state, PDSItems };
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
      console.log(groups);
      console.log(groupName);
      const shopPGroup = _.clone(state.shopPGroup);
      _.each(groups, (item, key) => {
        if (item === true) {
          shopPGroup[key] = groupName;
        }
      });

      return { ...state, shopPGroup };
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
    delete item.NextStatus;
    temp[getKey(item.OrderCode, item.PickDeliveryType)] = item;
  });
  pds.PDSItems = temp;
};

const addGroup = (pds, orderGroup) => {
  pds.DeliveryItems.forEach((order, index) => {
    pds.DeliveryItems[index].Group = orderGroup[order.OrderCode] || null;
  });

  //add 'key' for order
  pds.PDSItems.forEach((order, index) => {
    pds.PDSItems[index].key = order.OrderCode;
  });
};

const mergeState = (oldState, newState) => {
  if (oldState === null) return newState;
  const temp = {};
  _.each(newState, (item, key) => {
    temp[key] = Object.assign({}, oldState[key], item);
  });
  return temp;
};
