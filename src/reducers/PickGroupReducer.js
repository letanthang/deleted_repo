import _ from 'lodash';
import { 
  PICKGROUP_UPDATE_ORDER_INFO,
  PICKGROUP_UPDATE_ALL_ORDER_INFO,
  PICKGROUP_SET_ALL_STATUS,
  PICKGROUP_CHANGE_DONE,
  PICKGROUP_CHANGE_KEYWORD,
  PICKGROUP_RESET
 } from '../actions/types';

const nameInitialState = {
  allStatus: undefined,
  done: false,
  keyword: '',
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PICKGROUP_UPDATE_ORDER_INFO: {
      const { code, info } = action.payload;
      const OrderInfos = _.clone(state.OrderInfos);
      OrderInfos[code] = info;
      return { ...state, OrderInfos, allStatus: undefined };
    }

    case PICKGROUP_UPDATE_ALL_ORDER_INFO: {
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
    
    case PICKGROUP_CHANGE_DONE:
      return { ...state, done: action.payload.done };

    case PICKGROUP_CHANGE_KEYWORD:
      return { ...state, keyword: action.payload.keyword };

    case PICKGROUP_SET_ALL_STATUS:
      return { ...state, allStatus: action.payload };

    case PICKGROUP_RESET:
      return nameInitialState;
    default:
      return state;
  }
};
