import _ from 'lodash';
import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO,
  PICKGROUP_SET_ALL_STATUS
 } from '../actions/types';

const nameInitialState = {
  allStatus: undefined,
  showDatePicker: false,
  OrderInfos: {}
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PICKGROUP_UPDATE_ORDER_INFO: {
      const { OrderID, info } = action.payload;
      const OrderInfos = _.clone(state.OrderInfos);
      OrderInfos[OrderID] = info;
      return { ...state, OrderInfos };
    }

    case PICKGROUP_UPDATE_ALL_ORDER_INFO: {
      let OrderInfos = {};
      if (action.payload instanceof Array) {
        _.each(action.payload, info => {
          OrderInfos[info.OrderID] = info;
        });
      } else {
        OrderInfos = action.payload;
      }
      return { ...state, OrderInfos };
    }
      
    
    case PICKGROUP_SET_ALL_STATUS:
      return { ...state, allStatus: action.payload };
      
    default:
      return state;
  }
};
