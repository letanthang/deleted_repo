import { Alert, Clipboard } from 'react-native';
import { 
  ORDER_CHANGE_ORDER_CODE,
  ORDER_GET_ORDER_START,
  ORDER_GET_ORDER,
  ORDER_GET_ORDER_FAIL,
  ORDER_ADD_ORDER_START,
  ORDER_ADD_ORDER,
  ORDER_ADD_ORDER_FAIL
} from './types';
import { pdListFetch } from './pdAction';
import * as API from '../apis/MPDS';

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

const confirmAddOrder = (dispatch, OrderCode) => {
  const title = 'Don hang hop le';
  const message = 'Don hop le. Them vao chuyen di?';
  Alert.alert(
    title,
    message,
    [
      { text: 'Huy' },
      { text: 'Đống ý', onPress: () => dispatch(addOrder(OrderCode)) }
    ]
  );
};

const alertNoAddOrder = (OrderCode) => {
  const title = `Don hang "${OrderCode}" khong hop le`;
  const message = '';
  Alert.alert(
    title,
    message,
    [
      { text: 'Đóng' }
    ]
  );
};

export const getOrder = (OrderCode) => {
  return (dispatch, getState) => {
    dispatch({
      type: ORDER_GET_ORDER_START,
      payload: { OrderCode }
    });
    API.GetOrderByCode(OrderCode)
      .then(response => {
        const json = response.data;
        console.log(json);
        if (json.status === 'OK') {
          dispatch({
            type: ORDER_GET_ORDER,
            payload: { order: json.data[0] }
          });
          confirmAddOrder(dispatch, OrderCode);
        } else if (json.status === 'ERROR') {
          dispatch({ type: ORDER_GET_ORDER_FAIL });
          alertNoAddOrder(OrderCode);
        } else {
          dispatch({ type: ORDER_GET_ORDER_FAIL });
          reportBug(json.message, { OrderCode });
        }
      })
      .catch(error => {
        dispatch({ type: ORDER_GET_ORDER_FAIL });
        reportBug(error.message, { OrderCode });
      });
  };
};


export const addOrder = (OrderCode) => {
  return (dispatch, getState) => {
    dispatch({
      type: ORDER_ADD_ORDER_START,
      payload: { OrderCode }
    });
    API.AddOrders([OrderCode], getState().pd.pdsId)
      .then(response => {
        const json = response.data;
        console.log(json);
        if (json.status === 'OK') {
          dispatch({
            type: ORDER_ADD_ORDER,
            payload: { order: getState().orderAdd.order }
          });
          //refresh data from server
          dispatch(pdListFetch());
        } else {
          dispatch({ type: ORDER_ADD_ORDER_FAIL });
          reportBug(json.message, { OrderCode });
        }
      })
      .catch(error => {
        dispatch({ type: ORDER_ADD_ORDER_FAIL });
        reportBug(error.message, { OrderCode });
      });
  };
};

export const changeOrderCode = (OrderCode) => {
  return {
    type: ORDER_CHANGE_ORDER_CODE,
    payload: { OrderCode }
  };
};
