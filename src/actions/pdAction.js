import axios from 'axios';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL, 
  SET_CURRENT_DELIVERY_ORDER
} from './types';

export const pdListFetch = (sessionToken) => {
  console.log('Action: pdListFetch start');
  console.log(sessionToken);
  return (dispatch) => {
    dispatch({ type: PDLIST_FETCH });
    console.log(' prepare to fetch pd list');

    axios.post('https://test.ghn.vn/api/mpds/GetUserActivePds', {
      ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
      ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
      SessionToken: sessionToken,
      VersionCode: 60
    })
      .then(response => {
        const json = response.data;
        if (json.code === 1) {
          pdListFetchSuccess(dispatch, json.data);
        } else {
          pdListFetchFail(dispatch);
        }
      })
      .catch(error => {
        console.log(error);
        pdListFetchFail(dispatch);
      });
  };
};

export const pdListFetchSuccess = (dispatch, data) => {
  console.log('success & prepare to update home screen');
  dispatch({ type: PDLIST_FETCH_SUCCESS, payload: data });
};

export const pdListFetchFail = (dispatch) => {
  dispatch({ type: PDLIST_FETCH_FAIL });
};

export const setCurrentDeliveryOrder = (orderID) => {
  return {
    type: SET_CURRENT_DELIVERY_ORDER,
    payload: orderID
  };
};

export const updateOrderStatus = ({ 
  sessionToken, 
  pdsId, 
  PickDeliverySessionDetailID,
  OrderID,
  PickDeliveryType,
  status,
  ClientHubID 
}) => {
  // NextStatus: "Delivered"
  console.log(`pdAction: updateOrderStatus is called with type: ${PickDeliveryType}`);
  console.log({ sessionToken, pdsId, OrderID, PickDeliveryType, status });

  return ((dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS });

    axios.post('https://test.ghn.vn/api/mpds/UpdatePickDeliverySession', {
      ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
      ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
      SessionToken: sessionToken,
      VersionCode: 63,
      PDSID: pdsId,
      OrderInfos: [  
          {  
            PDSDetailID: PickDeliverySessionDetailID,
            OrderID,
            PDSType: PickDeliveryType,
            NextStatus: status,
            ClientHubID
          }
      ]
    })
      .then(response => {
        const json = response.data;
        console.log(json);
        if (json.code === 1) {
          //pdListFetchSuccess(dispatch, responseJson.data);
          updateOrderStatusSuccess(dispatch, 
            { OrderID, CurrentStatus: status, PickDeliveryType, ClientHubID });
        } else {
          updateOrderStatusFail(dispatch);
        }
      })
      .catch(error => {
        console.log('update status failed');
        console.log(error);
        updateOrderStatusFail(dispatch);
      });
  });
};

const updateOrderStatusSuccess = (dispatch, data) => {
  dispatch({
    type: UPDATE_ORDER_STATUS_SUCCESS,
    payload: data
  });
};

const updateOrderStatusFail = (dispatch) => {
  dispatch({
    type: UPDATE_ORDER_STATUS_FAIL
  });
};
