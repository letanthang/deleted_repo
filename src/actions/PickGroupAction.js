import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO,
  PICKGROUP_SET_ALL_STATUS,
  PICKGROUP_CHANGE_DONE,
  PICKGROUP_CHANGE_KEYWORD,
  PICKGROUP_RESET
} from './types';

export const updateOrderInfoOld = (code, info) => {
  return (dispatch, getState) => {
    dispatch({
      type: PICKGROUP_UPDATE_ORDER_INFO,
      payload: { code, info }
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
  return {
    type: PICKGROUP_CHANGE_DONE,
    payload: { done }
  };
};

export const changeKeyword = (keyword) => {
  return {
    type: PICKGROUP_CHANGE_KEYWORD,
    payload: { keyword }
  };
};

export const resetPickGroup = () => {
  return {
    type: PICKGROUP_RESET,
  };
};
