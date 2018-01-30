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
import LocalGroup from '../libs/LocalGroup';

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

export const pdListFetch = () => {
  return (dispatch, getState) => {
    dispatch({ type: PDLIST_FETCH });
    const { userID } = getState().auth;
    return API.GetUserActivePds(userID)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          pdListFetchSuccess(dispatch, json.data[0]);
          return true;
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
};

export const pdListNoTrip = () => {
  return { type: PDLIST_NO_TRIP };
};

export const pdListFetchSuccess = (dispatch, data) => {
  console.log('success & prepare to update home screen');
  const payload = { pds: data, orderGroup: LocalGroup.getOrderGroups() };
  dispatch({ type: PDLIST_FETCH_SUCCESS, payload });
    // .then(() => console.log('pdlist fetch success done!'));
};

export const pdListFetchFail = (dispatch, error) => {
  dispatch({ type: PDLIST_FETCH_FAIL, payload: error });
};

  // [
  //   {  
  //     PDSDetailID,
  //     OrderCode,
  //     PDSType,
  //     NextStatus,
  //     ClientHubID,
  //     StoringCode,
  //     NewDate,
  //     Log,
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
    const { pdsId } = getState().pd;
    return API.UpdatePickDeliverySession({
      PDSID: pdsId,
      OrderInfos
    })
      .then(response => {
        const json = response.data;
        console.log(json);
        if (json.status === 'OK') {
          updateOrderStatusSuccess(dispatch, OrderInfos, json.data.failed_orders);
          return json.data.failed_orders;
        } else {
          console.log('UpdateOrderStatus failed with response json =');
          updateOrderStatusFail(dispatch, json.message, OrderInfos);
        }
      })
      .catch(error => {
        console.log('update status failed with error=');
        updateOrderStatusFail(dispatch, error.message, OrderInfos);
      });
  });
};

const updateOrderStatusSuccess = (dispatch, OrderInfos, FailedOrders) => {
  dispatch({
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: { OrderInfos, FailedOrders }
  });
};

const updateOrderStatusFail = (dispatch, error, info) => {
  reportBug(error, info);
  dispatch({
    type: UPDATE_ORDER_STATUS_FAIL,
    payload: { error }
  });
};

export const updateWeightSize = ({
  Length, 
  Width,
  Height,
  Weight,
  ClientID,
  ClientHubID,
  OrderCode,
  PDSID,
  ServiceFee
}) => {
  return async dispatch => {
    dispatch({
      type: PD_UPDATE_WEIGHT_SIZE
    });
    
    const params = {
      Length,
      Width,
      Height,
      Weight,
      ClientID,
      OrderCode,
      PDSID
    };
    try {
      const response = await API.UpdateOrderWeightRDC(params);      
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: PD_UPDATE_WEIGHT_SIZE_SUCCESS,
          payload: { 
            OrderCode,
            ClientHubID, 
            ServiceCost: ServiceFee,
            Length,
            Width,
            Height,
            Weight
          }
        });
      } else {
        reportBug(json.message, { OrderCode, Length, Weight, Height, ServiceFee });
        dispatch({ type: PD_UPDATE_WEIGHT_SIZE_FAIL });
        console.log('Update weight size failed with response json =');
        console.log(json);
      }
    } catch (error) {
      reportBug(error.message, { OrderCode, Length, Weight, Height, ServiceFee });
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
    const { OrderCode } = order;
    dispatch({ type: PD_ADD_ORDER_START });
    API.AddOrders([OrderCode], getState().pd.pdsId)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          dispatch({
            type: PD_ADD_ORDER,
            payload: { order }
          });
        } else {
          dispatch({ type: PD_ADD_ORDER_FAIL });
          reportBug(json.message, { OrderCode });
        }
      })
      .catch(error => {
        dispatch({ type: PD_ADD_ORDER_FAIL });
        reportBug(error.message, { OrderCode });
      });
  };
};

export const updateOrderInfo = (OrderCode, PickDeliveryType, info) => {
  return (dispatch, getState) => {
    dispatch({
      type: PD_UPDATE_ORDER_INFO,
      payload: { OrderCode, PickDeliveryType, info }
    });
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

export const toggleOrderGroup = (OrderCode) => {
  return {
    type: PD_TOGGLE_ORDER_GROUP,
    payload: { OrderCode }
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
