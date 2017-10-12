import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO
} from './types';

export const updateOrderInfo = ({ OrderID, info }) => {
  return (dispatch, getState) => {
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
