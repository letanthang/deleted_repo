import _ from 'lodash';
import { Alert, Clipboard } from 'react-native';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP, PDLIST_CLEAR_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_START, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL,
  PD_UPDATE_GROUP, PD_FETCH_TRIP_INFO_SUCCESS, PD_FETCH_TRIP_INFO_FAIL,
  PD_FETCH_DETAIL, PD_FETCH_DETAIL_FAIL, PD_FETCH_DETAIL_SUCCESS,
  PD_ADD_ORDER, PD_ADD_ORDER_FAIL, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP, PD_STOP_LOADING, OTHER_SET_PROPS, 
  PD_SET_ORDER_PROPS,
} from './types';
import { writeLog } from '../libs/Log';

const reportBug = (errorMessage, info) => {
  const message = errorMessage;
  const title = 'Lỗi hệ thống';
  const fullMessage = `${errorMessage} ${JSON.stringify(info)}`;
  Alert.alert(
    title,
    message,
    [
      { text: 'Copy & Đóng', onPress: () => Clipboard.setString(fullMessage) }
    ]
  );
};

export const updateProgress = (progress, loading) => {
  return { type: OTHER_SET_PROPS, payload: { progress, loading } };
};

export const pdListFetch = ({ all, senderHubId, reset }) => {
  return { type: PDLIST_FETCH, payload: { all, senderHubId, reset } }; 
};

export const pdListFetchNoTrip = (all) => {
  return { type: PDLIST_NO_TRIP, payload: { error: 'Không tìm thấy CĐ hoặc CĐ đã kết thúc.', all } };
};

export const pdListClearTrip = () => {
  return { type: PDLIST_CLEAR_TRIP, payload: { error: 'Đã xoá dữ liệu chuyến đi trên điện thoại.' } };
};

export const fetchTripDataSuccess = (response, all, senderHubId, page, totalPage, more) => {
  const pdsItems = response.data;
  return { type: PDLIST_FETCH_SUCCESS, payload: { pdsItems, all, senderHubId, page, totalPage, more } };
};

export const fetchTripDataFail = (error) => {
  return { type: PDLIST_FETCH_FAIL, payload: { error } };
};

export const fetchTripInfoSuccess = (response, userId, all, senderHubId) => {
  return { 
    type: PD_FETCH_TRIP_INFO_SUCCESS, 
    payload: { info: response.data[0], all, senderHubId, userId }
  };
};

export const fetchTripInfoFail = (error) => {
  return { 
    type: PD_FETCH_TRIP_INFO_FAIL, 
    payload: { error }
  };
};

  // [
  //   {  
  //     PDSDetailID,
  //     code,
  //     PDSType,
  //     nextStatus,
  //     senderHubId,
  //     StoringCode,
  //     NewDate,
  //     log,
  //     Note,
  //     NoteCode,
  //   },
  //   ...
  // ]

export const updateOrderStatus = (infos) => {
  
  let OrderInfos = infos.OrderInfos;
  if (!(OrderInfos instanceof Array)) {
    OrderInfos = [OrderInfos];
  }

  return {
    type: UPDATE_ORDER_STATUS_START,
    payload: { OrderInfos },
  };
};

export const updateOrderStatusSuccess = (OrderInfos, FailedOrders, requireReload) => {
  return {
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: { OrderInfos, FailedOrders, requireReload },
  };
};

export const updateOrderStatusFail = (error, OrderInfos, report = true) => {
  //if (report) reportBug(error, OrderInfos);
  return {
    type: UPDATE_ORDER_STATUS_FAIL,
    payload: { error, OrderInfos },
  };
};

export const updateWeightSize = (params) => {
  return {
    type: PD_UPDATE_WEIGHT_SIZE,
    payload: params,
  };
};

export const updateOrderGroup = (updateList) => {
  return {
    type: PD_UPDATE_GROUP,
    payload: updateList
  };
};

export const addOneOrder = (code, type, senderHubId) => {
  return { type: PD_ADD_ORDER, payload: { order: { code, type }, senderHubId } };
};

export const updateOrderInfo = (code, type, info) => {
  return {
    type: PD_UPDATE_ORDER_INFO,
    payload: { code, type, info }
  };
};


export const updateOrderInfos = (OrderInfos) => {
  return {
    type: PD_UPDATE_ORDER_INFOS,
    payload: { OrderInfos }
  };
};

export const toggleGroupActive = (groupIndex) => {
  return {
    type: PD_TOGGLE_GROUP_ACTIVE,
    payload: { groupIndex }
  };
};

export const toggleOrderGroup = (code) => {
  return {
    type: PD_TOGGLE_ORDER_GROUP,
    payload: { code }
  };
};
export const updateOrders = (orders) => {
  return {
    type: PD_UPDATE_ORDERS,
    payload: { orders }
  };
};
export const createGroup = (groupName) => {
  return {
    type: PD_CREATE_GROUP,
    payload: { groupName }
  };
};
export const resetGroup = () => {
  return {
    type: PD_RESET_GROUP
  };
};
export const createPGroup = (groupName) => {
  return {
    type: PD_CREATE_PGROUP,
    payload: { groupName }
  };
};
export const updateShopPGroup = (groups, groupName) => {
  return {
    type: PD_UPDATE_SHOP_PGROUP,
    payload: { groups, groupName }
  };
};
export const resetPGroup = () => {
  return {
    type: PD_RESET_PGROUP
  };
};
export const stopLoading = () => {
  return {
    type: PD_STOP_LOADING
  };
};

export const fetchOrderDetail = (code, type) => {
  return { type: PD_FETCH_DETAIL, payload: { code, type } };
};

export const fetchOrderDetailFail = (error) => {
  return { type: PD_FETCH_DETAIL_FAIL, payload: { error } };
};

export const fetchOrderDetailSuccess = (response, code, type) => {
  return { type: PD_FETCH_DETAIL_SUCCESS, payload: { data: response.data[0], code, type } };
};

export const setOrder = (code, props) => {
  return {
    type: PD_SET_ORDER_PROPS,
    payload: { code, props },
  };
};
