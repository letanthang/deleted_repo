import _ from 'lodash';
import { 
  RETURNGROUP_UPDATE_ORDER_INFO,
  RETURNGROUP_UPDATE_ALL_ORDER_INFO,
  RETURNGROUP_SET_ALL_STATUS
 } from '../actions/types';

const nameInitialState = {
  allStatus: undefined,
  showDatePicker: false,
  OrderInfos: {}
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case RETURNGROUP_UPDATE_ORDER_INFO: {
      const { OrderID, info } = action.payload;
      const OrderInfos = _.clone(state.OrderInfos);
      OrderInfos[OrderID] = info;
      return { ...state, OrderInfos };
    }

    case RETURNGROUP_UPDATE_ALL_ORDER_INFO: {
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
      
    
    case RETURNGROUP_SET_ALL_STATUS:
      return { ...state, allStatus: action.payload };
      
    default:
      return state;
  }
};
