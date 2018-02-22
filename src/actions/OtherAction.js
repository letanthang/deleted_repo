import _ from 'lodash';
import moment from 'moment';
// import accounting from 'accounting';

import { 
  OTHER_CALCULATE_FEE, OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE,
  OTHER_GET_USER_PERFORMANCE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE_FAIL,
  OTHER_SET_LOADED
} from './types';
import * as API from '../apis/MPDS';

export const calculateServiceFee = ({ 
  length, width, height, weight, orderCode, clientId, serviceId, FromDistrictID, ToDistrictID 
}) => {
  return async dispatch => {
    dispatch({ type: OTHER_CALCULATE_FEE });
    const params = {
      length,
      width,
      height,
      weight,
      orderCode,
      clientId,
      serviceId,
      FromDistrictID,
      ToDistrictID
    };

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
    type: OTHER_SET_LOADED
  };
};

const getStat = (data) => {
  if (data.length === 0) return null;

  const result = { pick_succeed: 0, pick_total: 0, deliver_succeed: 0, deliver_total: 0, return_succeed: 0, return_total: 0 };
  _.each(data, (item) => {
    result.pick_total = result.pick_total + item.pick_total;
    result.pick_succeed = result.pick_succeed + item.pick_succeed;
    result.deliver_total = result.deliver_total + item.deliver_total;
    result.deliver_succeed = result.deliver_succeed + item.deliver_succeed;
    result.return_total = result.return_total + item.return_total;
    result.return_succeed = result.return_succeed + item.return_succeed;
  });

  result.pickRate = result.pick_total == 0 ? 0 : (result.pick_succeed * 100) / result.pick_total;
  result.deliveryRate = result.deliver_total == 0 ? 0 : (result.deliver_succeed * 100) / result.deliver_total;
  result.returnRate = result.return_total == 0 ? 0 : (result.return_succeed * 100) / result.return_total;

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
      const UserID = getState().auth.userID;
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
        console.log('getUserPerformance failed, response data=');
        console.log(json);
      }
    } catch (error) {
      console.log('getUserPerformance failed with error =');
      console.log(error);
    }
  };
};
