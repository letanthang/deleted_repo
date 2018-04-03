import _ from 'lodash';
import { 
  OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE_SUCCESS,
  OTHER_SET_LOADED,
  OTHER_UPDATE_PROGRESS,
  OTHER_SET_PROPS
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  ServiceFee: null,
  stats: null,
  yesterday: null,
  week: null,
  month: null,
  quarter: null,
  lastWeek: null,
  lastMonth: null,
  lastQuarter: null,
  loaded: false,
  progress: 0,
  loading: false,
  imageUri: null,
  imageUri1: null,
  imageUri2: null,
  imageUri3: null
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case OTHER_CALCULATE_FEE_SUCCESS: {
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
    
    case OTHER_UPDATE_PROGRESS:
      return {
        ...state,
        progress: action.payload.progress
      };

    case OTHER_SET_LOADED:
      return {
        ...state,
        loaded: true
      };
    case OTHER_SET_PROPS:
    return {
      ...state,
      ...action.payload
    };
    default:
      return state;
  }
};
