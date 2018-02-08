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
import Utils from '../libs/Utils';

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
  const title = 'Đơn hàng hợp lệ';
  const message = 'Đơn hàng hợp lệ. Thêm vào chuyến đi?';
  Alert.alert(
    title,
    message,
    [
      { text: 'Huỷ' },
      { text: 'Đồng ý', onPress: () => dispatch(addOrder(OrderCode)) }
    ]
  );
};

const alertNoAddOrder = (OrderCode) => {
  const title = `Đơn hàng "${OrderCode}" không hợp lệ`;
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
    API.AddOrders([OrderCode], getState().pd.pdsId, 1)
      .then(response => {
        const json = response.data;
        if (json.status === 'OK') {
          dispatch({
            type: ORDER_ADD_ORDER,
            payload: { order: getState().orderAdd.order }
          });
          Utils.showToast(`Đơn hàng ${OrderCode} đã được thêm thành công!`, 'success');
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
