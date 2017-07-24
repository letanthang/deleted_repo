import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDPICK_LIST,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL, 
  SET_CURRENT_DELIVERY_ORDER
} from './types';

export const pdListFetch = (sessionToken) => {
  console.log('Action: pdListFetch start');
  console.log(sessionToken);
  return (dispatch) => {
    dispatch({ type: PDLIST_FETCH });
    console.log(' prepare to fetch pd list');
    fetch('https://test.ghn.vn/api/mpds/GetUserActivePds', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
        ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
        SessionToken: sessionToken,
        VersionCode: 60
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetUserActivePds finish with response');
        console.log(responseJson);
        if (responseJson.code === 1) {
          pdListFetchSuccess(dispatch, responseJson.data);
        } else {
          pdListFetchFail(dispatch);
        }
      })
      .catch((error) => {
        console.log(error);
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

export const pdPickList = () => {
  return {
    type: PDPICK_LIST
  };
};

export const setCurrentDeliveryOrder = (orderID) => {
  return {
    type: SET_CURRENT_DELIVERY_ORDER,
    payload: orderID
  };
};

export const updateOrderStatus = ({ sessionToken, pdsId, order, status }) => {
  const OrderID = order.OrderID;
  //const { PickDeliverySessionID } = pds;
  const { PickDeliverySessionDetailID } = order;
  const PickDeliveryType = order.PickDeliveryType !== undefined ? order.PickDeliveryType : 1;
  // NextStatus: "Delivered"
  console.log('pdAction: updateOrderStatus is called with type: ');
  console.log(PickDeliveryType);

  //console.log({ sessionToken, pdsId, order, status });
  

  return ((dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS });

    fetch('https://test.ghn.vn/api/mpds/UpdatePickDeliverySession', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
              // StoringCode: "",
              // ReturnCode: "",
              // Note: "",
              // Log: "",
              NextStatus: status
            }
        ],
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('updatePickDeliverySession finish with response');
        console.log(responseJson);
        if (responseJson.code === 1) {
          //pdListFetchSuccess(dispatch, responseJson.data);
          updateOrderStatusSuccess(dispatch, { OrderID, CurrentStatus: status });
        } else {
          updateOrderStatusFail(dispatch);
        }
      })
      .catch((error) => {
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
