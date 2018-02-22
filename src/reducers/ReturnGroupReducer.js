import _ from 'lodash';
import { 
  RETURNGROUP_UPDATE_ORDER_INFO,
  RETURNGROUP_UPDATE_ALL_ORDER_INFO,
  RETURNGROUP_SET_ALL_STATUS,
  RETURNGROUP_RESET,
  RETURNGROUP_CHANGE_DONE,
  RETURNGROUP_CHANGE_KEYWORD
 } from '../actions/types';

const nameInitialState = {
  allStatusReturn: undefined,
  showDatePicker: false,
  OrderInfos: {},
  done: false,
  keyword: ''
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case RETURNGROUP_UPDATE_ORDER_INFO: {
      const { orderCode, info } = action.payload;
      const OrderInfos = _.clone(state.OrderInfos);
      OrderInfos[orderCode] = info;
      return { ...state, OrderInfos, allStatusReturn: undefined };
    }

    case RETURNGROUP_UPDATE_ALL_ORDER_INFO: {
      let OrderInfos = {};
      if (action.payload instanceof Array) {
        _.each(action.payload, info => {
          OrderInfos[info.orderCode] = info;
        });
      } else {
        OrderInfos = action.payload;
      }
      return { ...state, OrderInfos };
    }
      
    case RETURNGROUP_CHANGE_DONE: 
      return { ...state, done: action.payload.done };

    case RETURNGROUP_CHANGE_KEYWORD: 
      return { ...state, keyword: action.payload.keyword };

    case RETURNGROUP_SET_ALL_STATUS:
      return { ...state, allStatusReturn: action.payload };
    
    case RETURNGROUP_RESET:
      return nameInitialState;
      
    default:
      return state;
  }
};
