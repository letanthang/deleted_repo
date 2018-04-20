import { 
  ORDER_CHANGE_ORDER_CODE,
  ORDER_GET_ORDER_START,
  ORDER_GET_ORDER,
  ORDER_GET_ORDER_FAIL,
  ORDER_ADD_ORDER_START,
  ORDER_ADD_ORDER,
  ORDER_ADD_ORDER_FAIL
} from '../actions/types';

const nameInitialState = {
  code: '',
  loading: false,
  order: null
};

export default (state = nameInitialState, action) => {
  switch (action.type) {
    
    case ORDER_CHANGE_ORDER_CODE:
      return { ...state, code: action.payload.code };
    
    case ORDER_GET_ORDER_START:
      return { ...state, loading: true };
    
    case ORDER_GET_ORDER_FAIL:
      return { ...state, loading: false };

    case ORDER_GET_ORDER:
      return { ...state, loading: false, order: action.payload.order };
    default:
      return state;
  }
};
