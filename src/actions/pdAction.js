import _ from 'lodash';
import { Alert, Clipboard } from 'react-native';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL,
  PD_UPDATE_GROUP, PD_FETCH_TRIP_INFO_SUCCESS, PD_FETCH_TRIP_INFO_FAIL, 
  PD_ADD_ORDER, PD_ADD_ORDER_FAIL, PD_ADD_ORDER_START, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP, PD_STOP_LOADING, OTHER_UPDATE_PROGRESS, OTHER_SET_PROPS
} from './types';
import { logoutUser } from './';
import * as API from '../apis/MPDS';
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

export const updateProgress = (progress) => {
  return { type: OTHER_SET_PROPS, payload: { progress } };
};

// const fetchAll = (dispatch, pdsCode, page, limit, all, timeServer, clientHubId) => {
//   return API.GetUserActivePds(pdsCode, page * limit, limit, timeServer, clientHubId)
//       .then(response => {
//         const json = response.data;
        
//         if (json.status === 'OK' & json.data !== undefined) {

//           /******** success *********/
//           orders = orders.concat(json.data);
//           totalPage = Math.ceil(json.total / limit);
//           updateProgress(dispatch);
//           if (orders.length < json.total && (page * limit) + json.data.length < json.total && json.data.length === limit) {
//             return fetchAll(dispatch, pdsCode, page + 1, limit, all, timeServer, clientHubId);
//           } else {
//             pdListFetchSuccess(dispatch, orders, all);
//             return true;
//           }

//         } else if (json.status === 'ERROR' && json.message === 'Không tìm thấy CĐ hoặc CĐ đã bị xóa.') {
//           pdListFetchNoTrip(dispatch, json.message);
//         } else if (json.status === 'NOT_FOUND' && json.message === 'Not found pds.') {
//           pdListFetchNoTrip(dispatch, json.message);
//         } else if (json.status === 'NOT_FOUND' && json.message === 'Permission denied, no User is found.') { //Saved Session Expired: log user out
//           logout(dispatch);
//         } else if (json.status === 'NOT_FOUND') {
//           pdListFetchFail(dispatch, 'CĐ không có cập nhật.');
//         } else {
//           pdListFetchFail(dispatch, json.message);
//         }
//         return false;
//       })
//       .catch(error => {
//         pdListFetchFail(dispatch, error.message);
//       });
// };
const limitNum = 30;
export const pdListFetch = ({ all = true, page = 0, limit = limitNum, timeServer = null, clientHubId = null }) => {
  
  return { type: PDLIST_FETCH };
  // return (dispatch, getState) => {
  //   dispatch({ type: PDLIST_FETCH });
  //   dispatch({ type: OTHER_SET_PROPS, payload: { loading: true, progress: 0 } });
  //   const { userID } = getState().auth;
  //   const { pdsCode } = getState().pd;
    
  //   return API.GetUserActivePdsInfo(userID)
  //     .then(response => {
  //       const json = response.data;
  //       if (json.status === 'OK') {

  //         /******** success *********/
  //         info = json.data[0];
  //         const updateTime = pdsCode === info.pdsCode ? timeServer : null; //no timeServer for the first time
  //         return fetchAll(dispatch, info.pdsCode, page, limit, all, updateTime, clientHubId);
  // };
};

export const pdListFetchNoTrip = (message) => {
  return { type: PDLIST_NO_TRIP, payload: message };
};


export const fetchTripDataSuccess = (response, all) => {
  const pdsItems = response.data;
  return { type: PDLIST_FETCH_SUCCESS, payload: { pdsItems, all } };
};

export const fetchTripDataFail = (error) => {
  return { type: PDLIST_FETCH_FAIL, payload: error };
};

export const fetchTripInfoSuccess = (response) => {
  return { 
    type: PD_FETCH_TRIP_INFO_SUCCESS, 
    payload: { info: response.data[0] }
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
  //     orderCode,
  //     PDSType,
  //     nextStatus,
  //     clientHubId,
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
    type: UPDATE_ORDER_STATUS, 
    payload: { OrderInfos } 
  };
};

export const updateOrderStatusSuccess = (OrderInfos, FailedOrders) => {
  return {
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: { OrderInfos, FailedOrders }
  };
};

export const updateOrderStatusFail = (error, OrderInfos, report = true) => {
  if (report) reportBug(error, OrderInfos);
  return {
    type: UPDATE_ORDER_STATUS_FAIL,
    payload: { error, OrderInfos }
  };
};

export const updateWeightSize = ({
  length, 
  width,
  height,
  weight,
  clientId,
  clientHubId,
  orderCode,
  PDSID,
  ServiceFee
}) => {
  return async dispatch => {
    dispatch({
      type: PD_UPDATE_WEIGHT_SIZE
    });
    
    const params = {
      length,
      width,
      height,
      weight,
      clientId,
      orderCode,
      PDSID
    };
    try {
      const response = await API.UpdateOrderWeightRDC(params);      
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: PD_UPDATE_WEIGHT_SIZE_SUCCESS,
          payload: { 
            orderCode,
            clientHubId, 
            serviceCost: ServiceFee,
            length,
            width,
            height,
            weight
          }
        });
      } else {
        reportBug(json.message, { orderCode, length, weight, height, ServiceFee });
        dispatch({ type: PD_UPDATE_WEIGHT_SIZE_FAIL });
      }
    } catch (error) {
      reportBug(error.message, { orderCode, length, weight, height, ServiceFee });
      dispatch({ type: PD_UPDATE_WEIGHT_SIZE_FAIL });
    }
  };
};

export const updateOrderGroup = (updateList) => {
  return {
    type: PD_UPDATE_GROUP,
    payload: updateList
  };
};

export const addOneOrder = (order) => {
  return (dispatch, getState) => {
    const { orderCode } = order;
    dispatch({ type: PD_ADD_ORDER_START });
    API.AddOrders([orderCode], getState().pd.pdsId)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          dispatch({
            type: PD_ADD_ORDER,
            payload: { order }
          });
        } else {
          dispatch({ type: PD_ADD_ORDER_FAIL });
          reportBug(json.message, { orderCode });
        }
      })
      .catch(error => {
        dispatch({ type: PD_ADD_ORDER_FAIL });
        reportBug(error.message, { orderCode });
      });
  };
};

export const updateOrderInfo = (orderCode, pickDeliveryType, info) => {
  return {
    type: PD_UPDATE_ORDER_INFO,
    payload: { orderCode, pickDeliveryType, info }
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

export const toggleOrderGroup = (orderCode) => {
  return {
    type: PD_TOGGLE_ORDER_GROUP,
    payload: { orderCode }
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
