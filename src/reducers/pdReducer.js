import _ from 'lodash';
import { 
  PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDLIST_NO_TRIP,
  UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL,
  PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_UPDATE_WEIGHT_SIZE_SUCCESS,
  PD_UPDATE_GROUP, PD_UPDATE_GROUP_FAIL, PD_UPDATE_GROUP_SUCCESS
 } from '../actions/types';
import Utils from '../libs/Utils';

const nameInitialState = {
  pds: null,
  pdsId: null,
  currentDeliveryOrder: null,
  pickTotal: 0,
  pickComplete: 0,
  deliveryTotal: 0,
  deliveryComplete: 0,
  returnTotal: 0,
  returnComplete: 0,
  loading: false,
  error: ''
};

export default (state = nameInitialState, action) => {
  switch (action.type) {
    case PDLIST_FETCH:
      console.log('turn on spinner');
      return { ...state, loading: true };
    case PDLIST_FETCH_SUCCESS: {
      console.log('update home screen with numbers');
      
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(action.payload);

      return { ...state, 
        pds: action.payload,
        pdsId: action.payload.PickDeliverySessionID, 
        loading: false,
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete
      };
    }
    case PDLIST_FETCH_FAIL:
      return { ...state, loading: false };
    case PDLIST_NO_TRIP:
      return nameInitialState;
    
    case UPDATE_ORDER_STATUS: {
      console.log('pdReducer: UPDATE_ORDER_STATUS !!!!!!turn on spinner!!!!!');
      return {
        ...state,
        loading: true
      };
    }

    case UPDATE_ORDER_STATUS_FAIL: {
      console.log('pdReducer: UPDATE_ORDER_STATUS_FAIL');
      return {
        ...state,
        loading: false,
        error: 'update status fail'
      };
    }

    case UPDATE_ORDER_STATUS_SUCCESS: {
      console.log('================================================');
      console.log('pdReducer: UPDATE_ORDER_STATUS_SUCCESS is called');
      console.log('state before:');
      console.log(state.pds);

      const { OrderID, PickDeliveryType, CurrentStatus, ClientHubID } = action.payload;
      let order = {};
      const pds = _.cloneDeep(state.pds);
      if (PickDeliveryType === 2) {
        order = Utils.getOrder(pds, OrderID, null, 2);
        //order.CurrentStatus = 'WaitingToFinish';
        order.CurrentStatus = CurrentStatus;
      }
      if (PickDeliveryType === 1 || PickDeliveryType === 3) {
        order = Utils.getOrder(pds, OrderID, ClientHubID, PickDeliveryType);
        order.CurrentStatus = CurrentStatus;
        order.NextStatus = CurrentStatus;
        console.log(`Found order - id = ${order.OrderID}`);
      }

      console.log('state after:');
      console.log(pds);
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(pds);     

      console.log('================================================');
      return {
        ...state,
        loading: false,
        error: '',
        pds,
        deliveryTotal,
        deliveryComplete,
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete
      };
    }

    case PD_UPDATE_WEIGHT_SIZE:
      return { ...state, loading: true };

    case PD_UPDATE_WEIGHT_SIZE_FAIL:
      return { ...state, loading: false };

    case PD_UPDATE_WEIGHT_SIZE_SUCCESS: {
      const pds = state.pds;
      const { OrderID, ServiceCost, Length, Width, Height, Weight } = action.payload;
      const order = Utils.getOrder(pds, OrderID);
      order.ServiceCost = ServiceCost;
      order.Length = Length;
      order.Weight = Weight;
      order.Height = Height;
      order.Width = Width;
      return { ...state, pds, loading: false };
    }
      
    default:
      return state;
  }
};

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 

const calculateStatNumbers = (pds) => {
  // pick
      const pickGroupList = pds.PickReturnItems.filter(p => p.PickDeliveryType === 1);
      const pickTotal = pickGroupList.length;
      const pickComplete = pickTotal === 0 ? 0 : pickGroupList.filter(pg => {
        let isComplete = true;
        pg.PickReturnSOs.forEach(o => {
          isComplete = isComplete && Utils.checkPickComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;
      console.log(`fetch succes with pickComplete = ${pickComplete}`);

      // delivery
      const deliveryTotal = pds.DeliveryItems.length;
      const deliveryComplete = deliveryTotal === 0 ? 0 : pds.DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.CurrentStatus)).length;

      // return
      const returnGroupList = pds.PickReturnItems.filter(p => p.PickDeliveryType === 3);
      const returnTotal = returnGroupList.length;
      const returnComplete = returnTotal === 0 ? 0 : returnGroupList.filter(pg => {
        let isComplete = true;
        pg.PickReturnSOs.forEach(o => {
          isComplete = isComplete && Utils.checkReturnComplete(o.CurrentStatus);
        });
        return isComplete;
      }).length;

  return { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete };
};
