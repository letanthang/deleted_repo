import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO,
  PICKGROUP_SET_ALL_STATUS,
  PICKGROUP_CHANGE_DONE,
  PICKGROUP_CHANGE_KEYWORD,
  PICKGROUP_RESET
} from './types';

export const updateOrderInfo = (OrderID, info) => {
  return (dispatch, getState) => {
    console.log('PickGroupAction: updateOrderInfo');
    dispatch({
      type: PICKGROUP_UPDATE_ORDER_INFO,
      payload: { OrderID, info }
    });
  };
};

export const updateAllOrderInfo = (OrderInfos) => {
  return {
    type: PICKGROUP_UPDATE_ALL_ORDER_INFO,
    payload: OrderInfos
  };
};

export const setAllStatus = (status) => {
  return {
    type: PICKGROUP_SET_ALL_STATUS,
    payload: status
  };
};

export const changeDone = (done) => {
  console.log('change props done');
  return {
    type: PICKGROUP_CHANGE_DONE,
    payload: { done }
  };
};

export const changeKeyword = (keyword) => {
  console.log('change props keyword');
  return {
    type: PICKGROUP_CHANGE_KEYWORD,
    payload: { keyword }
  };
};

export const resetPickGroup = () => {
  console.log('resetPickGroup');
  return {
    type: PICKGROUP_RESET,
  };
};
