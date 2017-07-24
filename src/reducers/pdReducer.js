import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDPICK_LIST,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  SET_CURRENT_DELIVERY_ORDER
 } from '../actions/types';

const nameInitialState = {
  pds: {},
  pdsId: null,
  currentDeliveryOrder: null,
  pickTotal: 0,
  pickComplete: 0,
  deliveryTotal: 0,
  deliveryComplete: 0,
  pickList: {},
  deliveryList: {},
  loading: false,
  error: ''
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PDLIST_FETCH:
      console.log('turn on spinner');
      return { ...state, loading: true };
    case PDLIST_FETCH_SUCCESS:
      console.log('update home screen with numbers');
      return { ...state, 
        pds: action.payload,
        pdsId: action.payload.PickDeliverySessionID, 
        loading: false,
        pickTotal: action.payload.PickReturnItems.length,
        deliveryTotal: action.payload.DeliveryItems.length,
        deliveryList: action.payload.DeliveryItems,
        pickList: action.payload.PickReturnItems
      };
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false };
    
    case PDPICK_LIST:
      return { ...state, pickList: state.pds.PickReturnItems };

    case SET_CURRENT_DELIVERY_ORDER: {
      console.log('pdReducer: SET_CURRENT_DELIVERY_ORDER');
      const orders = state.deliveryList.filter(order => order.OrderID === action.payload);
      console.log(orders[0]);
      return { 
        ...state, 
        currentDeliveryOrder: orders[0] 
      };
    }

    case UPDATE_ORDER_STATUS: {
      return {
        ...state,
        loading: true
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      return {
        ...state,
        loading: false,
        error: 'update status fail'
      };
    }

    case UPDATE_ORDER_STATUS_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
        pds: { ...state.pds }
      };
    }

    default:
      return state;
  }
};
