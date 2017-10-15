import { 
  RETURNGROUP_UPDATE_ORDER_INFO,
  RETURNGROUP_UPDATE_ALL_ORDER_INFO,
  RETURNGROUP_SET_ALL_STATUS,
  RETURNGROUP_RESET
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

export const resetReturnGroup = () => {
  return {
    type: RETURNGROUP_RESET,
  };
};
