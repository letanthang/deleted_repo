import { PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDPICK_LIST } from '../actions/types';

const nameInitialState = {
  pds: {},
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
        loading: false,
        pickTotal: action.payload.PickReturnItems.length,
        deliveryTotal: action.payload.DeliveryItems.length,
        deliveryList: action.payload.DeliveryItems
      };
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false };
    
    case PDPICK_LIST:
      return { ...state, pickList: state.pds.PickReturnItems };
    
    default:
      return state;
  }
};
