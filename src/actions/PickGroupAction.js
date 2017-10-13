import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO,
  PICKGROUP_SET_ALL_STATUS
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
