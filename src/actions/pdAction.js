import _ from 'lodash';
import { Alert, Clipboard } from 'react-native';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS, 
  PD_ADD_ORDER, PD_ADD_ORDER_FAIL, PD_ADD_ORDER_START, PD_UPDATE_ORDER_INFO, PD_UPDATE_ORDER_INFOS,
  PD_TOGGLE_GROUP_ACTIVE, PD_TOGGLE_ORDER_GROUP, PD_CREATE_GROUP, PD_RESET_GROUP, PD_UPDATE_ORDERS,
  PD_CREATE_PGROUP, PD_UPDATE_SHOP_PGROUP, PD_RESET_PGROUP
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


let orders = [];
const fetchAll = (dispatch, pdsCode, page = 0, limit = 100) => {
  return API.GetUserActivePds(pdsCode, page * limit, limit)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK' & json.data !== undefined) {
          orders = orders.concat(json.data);
          if (orders.length < json.total) {
            return fetchAll(dispatch, pdsCode, page + 1, limit);
          } else {
            pdListFetchSuccess(dispatch, orders);
            return true;
          }
        } else if (json.status === 'ERROR' && json.message === 'Không tìm thấy CĐ hoặc CĐ đã bị xóa.') {
          console.log('khong co chuyen di, json response=');
          console.log(json);
          dispatch({ type: PDLIST_NO_TRIP, payload: json.message });
        } else if (json.status === 'ERROR' && json.message === 'Not found pds.') {
          console.log('khong co chuyen di, json response=');
          console.log(json);
          dispatch({ type: PDLIST_NO_TRIP, payload: json.message });
        } else if (json.status === 'NOT_FOUND' && json.message === 'Permission denied, no User is found.') {
          console.log('Saved Session Expired: log user out');
          dispatch(logoutUser());
        } else {
          console.log('pdListFetch failed with response json = ');
          console.log(json);
          pdListFetchFail(dispatch, json.message);
        }
        return false;
      })
      .catch(error => {
        console.log('pdListFetch failed with error = ');
        console.log(error);
        pdListFetchFail(dispatch, error.message);
      });
};

let info = {};
const limitNum = 30;
export const pdListFetch = () => {
  info = {};
  orders = [];
  return (dispatch, getState) => {
    dispatch({ type: PDLIST_FETCH });
    const { userID } = getState().auth;
    return API.GetUserActivePdsInfo(userID)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          info = json.data[0];
          return fetchAll(dispatch, info.pdsCode, 0, limitNum);
        } else if (json.status === 'ERROR' && json.message === 'Không tìm thấy CĐ hoặc CĐ đã bị xóa.') {
          dispatch({ type: PDLIST_NO_TRIP, payload: json.message });
        } else if (json.status === 'NOT_FOUND' && json.message === 'Not found pds.') {
          dispatch({ type: PDLIST_NO_TRIP, payload: json.message });
        } else if (json.status === 'NOT_FOUND' && json.message === 'Permission denied, no User is found.') {
          dispatch(logoutUser());
        } else if (json.status === 'UNAUTHORIZED') {
          dispatch(logoutUser());
        } else {
          pdListFetchFail(dispatch, json.message);
        }
        return false;
      })
      .catch(error => {
        pdListFetchFail(dispatch, error.message);
      });
  };
};

export const pdListNoTrip = () => {
  return { type: PDLIST_NO_TRIP };
};

export const pdListFetchSuccess = (dispatch, data) => {
  console.log('success & prepare to update home screen');
  info.pdsItems = orders;
  const pds = info;
  const payload = { pds };
  dispatch({ type: PDLIST_FETCH_SUCCESS, payload });
    // .then(() => console.log('pdlist fetch success done!'));
  info = {};
  orders = [];
};

export const pdListFetchFail = (dispatch, error) => {
  dispatch({ type: PDLIST_FETCH_FAIL, payload: error });
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

  return ((dispatch, getState) => {
    dispatch({ type: UPDATE_ORDER_STATUS, payload: { OrderInfos } });
    const { pdsId, pdsCode, lastUpdatedTime } = getState().pd;

    //filter 
    //transform OrderInfos
    const filterInfos = OrderInfos.map(info => {
      const { orderCode, nextDate, noteId, note, action } = info;
      return { orderCode, nextDate, noteId, note, action };
    });
    const params = {
      pdsId,
      pdsCode, 
      lastUpdatedTime,
      OrderInfos: filterInfos
    };
    return API.UpdateStatus(params)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          updateOrderStatusSuccess(dispatch, OrderInfos, json.data[0].listFail);
          if (json.data[0].listFail.length > 0) {
            //write log
            const req = API.UpdateStatusGetRequest(params);
            writeLog({ request: req, response: json });
          }
          return json.data[0].listFail;
        } else {
          console.log('UpdateOrderStatus failed with response json =');
          updateOrderStatusFail(dispatch, json.message, OrderInfos);
          //write log
          const req = API.UpdateStatusGetRequest(params);
          writeLog({ request: req, response: json });
          return null;
        }
      })
      .catch(error => {
        console.log('update status failed with error=');
        updateOrderStatusFail(dispatch, error.message, OrderInfos);
        //write log
        const req = API.UpdateStatusGetRequest(params);
        writeLog({ request: req, error });
      });
  });
};

const updateOrderStatusSuccess = (dispatch, OrderInfos, FailedOrders) => {
  dispatch({
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: { OrderInfos, FailedOrders }
  });
};

const updateOrderStatusFail = (dispatch, error, OrderInfos) => {
  reportBug(error, OrderInfos);
  dispatch({
    type: UPDATE_ORDER_STATUS_FAIL,
    payload: { error, OrderInfos }
  });
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
        console.log('Update weight size failed with response json =');
        console.log(json);
      }
    } catch (error) {
      reportBug(error.message, { orderCode, length, weight, height, ServiceFee });
      dispatch({ type: PD_UPDATE_WEIGHT_SIZE_FAIL });
      console.log('Update weight size failed with error =');
      console.log(error);
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
