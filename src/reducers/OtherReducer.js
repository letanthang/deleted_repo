import _ from 'lodash';
import { 
  OTHER_GET_CONFIGURATION,
  OTHER_GET_CONFIGURATION_SUCCESS,
  OTHER_GET_CONFIGURATION_FAIL,
  OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE_SUCCESS
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  configuration: null,
  ServiceFee: null,
  stats: null,
  yesterday: null,
  week: null,
  month: null,
  quarter: null,
  lastWeek: null,
  lastMonth: null,
  lastQuarter: null
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    
    case OTHER_GET_CONFIGURATION:
      return { ...state, loading: true };
    
    case OTHER_GET_CONFIGURATION_SUCCESS:
      return { ...state, loading: false, configuration: action.payload };
    
    case OTHER_GET_CONFIGURATION_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    case OTHER_CALCULATE_FEE_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        ServiceFee: action.payload.ServiceFee
      };
    }
    case OTHER_GET_USER_PERFORMANCE_SUCCESS: {
      const stat = action.payload.stat;
      const statType = action.payload.statType;

      const result = {};
      result[statType] = stat;
      return {
        ...state,
        ...result
      };
    }

    default:
      return state;
  }
};
