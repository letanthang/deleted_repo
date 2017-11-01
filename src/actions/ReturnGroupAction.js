import { 
  RETURNGROUP_UPDATE_ORDER_INFO,
  RETURNGROUP_UPDATE_ALL_ORDER_INFO,
  RETURNGROUP_SET_ALL_STATUS,
  RETURNGROUP_RESET,
  RETURNGROUP_CHANGE_DONE,
  RETURNGROUP_CHANGE_KEYWORD
} from './types';

export const updateOrderInfoReturn = (OrderID, info) => {
  return (dispatch, getState) => {
    console.log('PickGroupAction: updateOrderInfo');
    dispatch({
      type: RETURNGROUP_UPDATE_ORDER_INFO,
      payload: { OrderID, info }
    });
  };
};

export const updateAllOrderInfoReturn = (OrderInfos) => {
  return {
    type: RETURNGROUP_UPDATE_ALL_ORDER_INFO,
    payload: OrderInfos
  };
};

export const setAllStatusReturn = (status) => {
  return {
    type: RETURNGROUP_SET_ALL_STATUS,
    payload: status
  };
};

export const changeDone1 = (done) => {
  console.log('change props done');
  return {
    type: RETURNGROUP_CHANGE_DONE,
    payload: { done }
  };
};

export const changeKeyword1 = (keyword) => {
  console.log('change props keyword');
  return {
    type: RETURNGROUP_CHANGE_KEYWORD,
    payload: { keyword }
  };
};

export const resetReturnGroup = () => {
  return {
    type: RETURNGROUP_RESET,
  };
};
