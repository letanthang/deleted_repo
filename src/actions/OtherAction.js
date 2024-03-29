import _ from 'lodash';
import moment from 'moment';
// import accounting from 'accounting';

import { 
  OTHER_CALCULATE_FEE, OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE,
  OTHER_GET_USER_PERFORMANCE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE_FAIL,
  OTHER_SET_LOADED,
  OTHER_SET_PROPS,
  OTHER_GET_ORDER_HISTORY,
} from './types';
import * as API from '../apis/MPDS';

export const calculateServiceFee = (params) => {
  // const params = { length, width, height, weight, orderCode, clientId, serviceId, fromDistrictId, toDistrictId };
  return async (dispatch) => {
    dispatch({ type: OTHER_CALCULATE_FEE });
    
    try {
      const response = await API.CalculateServiceFee(params);
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_CALCULATE_FEE_SUCCESS,
          payload: json.data[0]
        });
      } else {
        console.log('calculateServiceFee failed, response data=');
        console.log(json);
      }
    } catch (error) {
      console.log('calculateServiceFee failed,error =');
      console.log(error);
    }
  };
};

export const setLoaded = () => {
  return {
    type: OTHER_SET_LOADED,
  };
};

export const setProps = (props) => {
  return {
    type: OTHER_SET_PROPS,
    payload: props,
  };
};

const getStat = (data) => {
  if (data.length === 0) return null;

  const result = { pickSucceed: 0, pickTotal: 0, deliverSucceed: 0, deliverTotal: 0, returnSucceed: 0, returnTotal: 0 };
  _.each(data, (item) => {
    result.pickTotal += item.pickTotal;
    result.pickSucceed += item.pickSucceed;
    result.deliverTotal += item.deliverTotal;
    result.deliverSucceed += item.deliverSucceed;
    result.returnTotal += item.returnTotal;
    result.returnSucceed += item.returnSucceed;
  });

  result.pickRate = result.pickTotal == 0 ? 0 : (result.pickSucceed * 100) / result.pickTotal;
  result.deliveryRate = result.deliverTotal == 0 ? 0 : (result.deliverSucceed * 100) / result.deliverTotal;
  result.returnRate = result.returnTotal == 0 ? 0 : (result.returnSucceed * 100) / result.returnTotal;

  result.pickRate = Math.round(result.pickRate);
  result.returnRate = Math.round(result.returnRate);
  result.deliveryRate = Math.round(result.deliveryRate);

  return result;
};

const getQuery = (statType) => {
  let from = null;
  let to = null;
  switch (statType) {
    case 'yesterday': {
      from = moment().subtract(1, 'day').startOf('day');
      to = moment().subtract(1, 'day').endOf('day');
      return { from, to };
    }
    case 'week': {
      from = moment().startOf('week');
      to = moment(); 
      return { from, to };
    }
    case 'month': {
      from = moment().startOf('month');
      to = moment().endOf('month');
      return { from, to };
    }
    case 'quarter': {
      from = moment().startOf('quarter');
      to = moment().endOf('quarter');
      return { from, to };
    }
    case 'lastWeek': {
      from = moment().subtract(1, 'week').startOf('week');
      to = moment().subtract(1, 'week').endOf('week'); 
      return { from, to };
    }
    case 'lastMonth': {
      from = moment().subtract(1, 'month').startOf('month');
      to = moment().subtract(1, 'month').endOf('month');
      return { from, to };
    }
    case 'lastQuarter': {
      from = moment().subtract(1, 'quarter').startOf('quarter');
      to = moment().subtract(1, 'quarter').endOf('quarter');
      return { from, to };
    }
    default:
      return null;
  }
};

export const getUserPerformance = (statType = 'yesterday') => {
  return async (dispatch, getState) => {
    dispatch({ type: OTHER_GET_USER_PERFORMANCE });
    
    try {
      const UserID = getState().auth.userId;
      const { from, to } = getQuery(statType);
      console.log({ from, to });
      const response = await API.GetUserPerformance(UserID, from.valueOf(), to.valueOf());
      const json = response.data;
      // console.log(json);
      if (json.status === 'OK') {
        const stat = getStat(json.data);
        if (stat === null) {
          dispatch({
            type: OTHER_GET_USER_PERFORMANCE_FAIL,
          });
        } else {
          dispatch({
            type: OTHER_GET_USER_PERFORMANCE_SUCCESS,
            payload: { statType, stat }
          });
        }
      } else {
        dispatch({
          type: OTHER_GET_USER_PERFORMANCE_FAIL,
        });
      }
    } catch (error) {
      dispatch({
        type: OTHER_GET_USER_PERFORMANCE_FAIL,
      });
    }
  };
};

export const getOrderHistory = (orderCode) => {
  return {
    type: OTHER_GET_ORDER_HISTORY,
    payload: { orderCode }
  };
};
