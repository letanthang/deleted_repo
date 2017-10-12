import _ from 'lodash';
import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO
 } from '../actions/types';

const nameInitialState = {
  OrderInfos: {}
};
export default (state = nameInitialState, action) => {
  switch (action.type) {

    case PICKGROUP_UPDATE_ORDER_INFO:
      return { ...state, loading: true };

      default:
      return state;
  }
};
