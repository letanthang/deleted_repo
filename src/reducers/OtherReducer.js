import _ from 'lodash';
import { 
  OTHER_GET_CONFIGURATION,
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
  monthCurrent: null,
  monthPrevious: null
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    
    case OTHER_GET_CONFIGURATION:
      return { ...state, loading: false };
    
    case OTHER_CALCULATE_FEE_SUCCESS: {
      return {
        ...state,
        ServiceFee: action.payload
      };
    }
    case OTHER_GET_USER_PERFORMANCE_SUCCESS: {
      const stats = action.payload.Data;
      return {
        ...state,
        stats,
        yesterday: null,
        week: null,
        monthCurrent: { pick: 41.7, delivery: 68.4, return: 50 },
        monthPrevious: null 
      };
    }

    default:
      return state;
  }
};
