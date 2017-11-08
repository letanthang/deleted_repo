import _ from 'lodash';
import { Alert, Clipboard } from 'react-native';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS
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
    API.GetUserActivePds(userID)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          pdListFetchSuccess(dispatch, json.data[0]);
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
  //     OrderID,
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

  console.log(OrderInfos);
  // return { type: "NO_THING" };
  return ((dispatch, getState) => {
    dispatch({ type: UPDATE_ORDER_STATUS });
    const { pdsId } = getState().pd;
    API.UpdatePickDeliverySession({
      PDSID: pdsId,
      OrderInfos
    })
      .then(response => {
        const json = response.data;
        console.log(json);
        if (json.status === 'OK') {
          updateOrderStatusSuccess(dispatch, OrderInfos);
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

const updateOrderStatusSuccess = (dispatch, data) => {
  dispatch({
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: data
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
  OrderID,
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
      OrderID,
      PDSID
    };
    try {
      const response = await API.UpdateOrderWeightRDC(params);      
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: PD_UPDATE_WEIGHT_SIZE_SUCCESS,
          payload: { 
            OrderID,
            ClientHubID, 
            ServiceCost: ServiceFee,
            Length,
            Width,
            Height,
            Weight
          }
        });
      } else {
        reportBug(json.message, { OrderID, Length, Weight, Height, ServiceFee });
        dispatch({ type: PD_UPDATE_WEIGHT_SIZE_FAIL });
        console.log('Update weight size failed with response json =');
        console.log(json);
      }
    } catch (error) {
      reportBug(error.message, { OrderID, Length, Weight, Height, ServiceFee });
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
