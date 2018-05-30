import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP, PDLIST_CLEAR_TRIP,
  UPDATE_ORDER_STATUS_START, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_FETCH_TRIP_INFO_SUCCESS,
  PD_FETCH_DETAIL, PD_FETCH_DETAIL_FAIL, PD_FETCH_DETAIL_SUCCESS,
  PD_ADD_ORDER, PD_ADD_ORDER_START, PD_ADD_ORDER_FAIL, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP, PD_STOP_LOADING, PD_ADD_ORDER_SUCCESS
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  pdsItems: null,
  Infos: null,
  tripCode: null,
  isTripDone: false,
  userId: null,
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
  requireReload: false,
  error: ''
};

export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PDLIST_FETCH: {
      const data = action.payload.reset !== true ? {} : nameInitialState;
      // turn on spinner
      return { ...state, ...data, loading: true, requireReload: false, error: '' };
    }
      
    case PD_FETCH_TRIP_INFO_SUCCESS: {
      // console.log(action.payload);
      const { info, userId } = action.payload;
      const { driverName, createdByName, createdByPhone, code } = info;
      
      const data = state.tripCode === code ? {} : {
        pdsItems: null,
        groups: nameInitialState.groups,
      };

      return {
        ...state,
        Infos: { driverName, createdByName, createdByPhone },
        tripCode: code,
        isTripDone: false,
        userId,
        ...data,
      };
    }
    case PDLIST_FETCH_SUCCESS: {
      const { more } = action.payload;

      let data = {};
      if (more === false) {
        const { serverTime } = action.payload.pdsItems[0].extraInfo;
        data = { lastUpdatedTime: serverTime };
      }

      let pdsItems = transformPDS(action.payload.pdsItems);
      pdsItems = mergeState(state.pdsItems, pdsItems);

      return {
        ...state,
        pdsItems,
        loading: false,
        error: '',
        ...data,
      };
    }
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload.error };
    case PDLIST_NO_TRIP:
      return { ...state, isTripDone: true, error: action.payload.error };
    case PDLIST_CLEAR_TRIP:
      return { ...nameInitialState, error: action.payload.error };
    case UPDATE_ORDER_STATUS_START: {
      const { OrderInfos } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);

      _.each(OrderInfos, (info) => {
        const order = Utils.getOrder(pdsItems, info.code, info.type);
        order.status = 'Progress';
      });
      

      return {
        ...state,
        pdsItems,
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      const { OrderInfos, error } = action.payload;

      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, (info) => {
        const order = Utils.getOrder(pdsItems, info.code, info.type);
        switch (info.type) {
          case 'PICK':
            order.status = 'PICKING';
            break;
          case 'DELIVER':
            order.status = 'DELIVERING';
            break;
          case 'RETURN':
            order.status = 'RETURNING';
            break;
          default:
            break;
        }
      });

      return {
        ...state,
        pdsItems,
        loading: false,
        error,
      };
    }

  // [
  //   {  
  //     PDSDetailID,
  //     code,
  //     PDSType,
  //     nextStatus,
  //     senderHubId,
  //     StoringCode,
  //     NewDate,
  //     log
  //   },
  //   ...
  // ]

    case UPDATE_ORDER_STATUS_SUCCESS: {
      const { OrderInfos, FailedOrders, requireReload } = action.payload;
      let ids = [];
      if (FailedOrders instanceof Array && FailedOrders.length > 0) {
        ids = FailedOrders.map(o => o.code);
      }

      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, (info) => {
        const order = Utils.getOrder(pdsItems, info.code, info.type);
        if (ids.length > 0 && ids.includes(info.code)) {
          switch (info.type) {
            case 'PICK':
              order.status = 'PICKING';
              break;
            case 'DELIVER':
              order.status = 'DELIVERING';
              break;
            case 'RETURN':
              order.status = 'RETURNING';
              break;
            default:
              break;
          }
        } else {
          order.status = info.nextStatus;
          order.nextStatus = undefined;
          order.success = undefined;
        }
      });
      
      let data = {};
      if (requireReload) {
        data = { requireReload };
      }

      return {
        ...state,
        loading: false,
        error: '',
        pdsItems,
        ...data,
      };
    }

    case PD_ADD_ORDER:
      return {
        ...state,
        addOrderLoading: true,
      };
    case PD_ADD_ORDER_FAIL:
      return {
        ...state,
        addOrderLoading: false,
        error: action.payload.error,
      };
    case PD_ADD_ORDER_SUCCESS: {
      // const order = action.payload.order;
      // const pdsItems = _.cloneDeep(state.pdsItems);
      // pdsItems[getKey(order.code, order.type)] = order;
      return {
        ...state,
        // pdsItems,
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
      const { code, serviceCost, length, width, height, weight } = action.payload;
      const order = Utils.getOrder(pdsItems, code, 'PICK');
      if (order.moneyCollect != 0) {
        order.moneyCollect = serviceCost;
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
        const group = orderGroup[order.code];
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
      return { ...state, pds };
    }

    case PD_UPDATE_ORDER_INFO: {
      const { code, type, info } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      const item = pdsItems[getKey(code, type)];
      const statusChangeDate = info.success === undefined ? undefined : Date.now();
      const dateInfo = (item.success !== undefined && info.success !== undefined) ? {} : { statusChangeDate };
      Object.assign(item, dateInfo, info);
      return { ...state, pdsItems };
    }
     
    case PD_UPDATE_ORDER_INFOS: {
      const { OrderInfos } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      _.each(OrderInfos, (info) => {
        const { code, type } = info;
        const statusChangeDate = info.success === undefined ? undefined : Date.now();
        Object.assign(pdsItems[getKey(code, type)], { statusChangeDate }, info);
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
      const { code } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      const order = pdsItems[getKey(code, 'DELIVER')];
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
      _.filter(pdsItems, o => o.group !== undefined).forEach(o => { delete o.group; delete o.groupChecked; });
      return {
        ...state,
        groups: nameInitialState.groups,
        pdsItems
      };
    }

    case PD_UPDATE_ORDERS: {
      const { orders } = action.payload;
      const pdsItems = _.cloneDeep(state.pdsItems);
      pdsItems = { ...pdsItems, ...orders };
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
    case PD_FETCH_DETAIL:
      return {
        ...state,
        detailLoading: true
      };
    case PD_FETCH_DETAIL_SUCCESS: {
      const { data, code, type } = action.payload;

      if (data.code !== code || data.type !== type) {
        return state;
      }

      const orderDetail = data.orderDetail;
      delete orderDetail.senderHubId;
      delete orderDetail.clientId;
      const key = getKey(code, type);
      return {
        ...state,
        detailLoading: false,
        pdsItems: {
          ...state.pdsItems,
          [key]: {
            ...state.pdsItems[key],
            ...orderDetail,
            hasDetail: true
          }
        },
        error: ''
      };
    }
    case PD_FETCH_DETAIL_FAIL:
      return {
        ...state,
        detailLoading: false,
        error: action.payload.error
      };
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

const transformPDS = (pdsItems) => {
  const temp = {};
  pdsItems.forEach((item) => {
    const key = getKey(item.code, item.type);
    temp[key] = { ...item, ...item.extraInfo };
    temp[key].address = temp[key].type === 'DELIVER' ? temp[key].receiverAddress : temp[key].senderAddress;
    if (temp[key].isCancel === true) {
      switch (temp[key].status) {
        case 'PICKING':
          temp[key].status = 'COMPLETED';
          break;
        default:
          break;
      }
    }
    
    delete temp[key].nextStatus;
    delete temp[key].extraInfo;
  });
  return temp;
};

const addGroup = (pds, orderGroup) => {
  pds.DeliveryItems.forEach((order, index) => {
    pds.DeliveryItems[index].Group = orderGroup[order.code] || null;
  });

  //add 'key' for order
  pds.pdsItems.forEach((order, index) => {
    pds.pdsItems[index].key = order.code;
  });
};

const mergeState = (oldState, newState) => {
  if (oldState === null) return newState;
  const temp = _.clone(oldState);
  _.each(newState, (item, key) => {
    temp[key] = Object.assign({}, oldState[key], item);
  });
  return temp;
};
