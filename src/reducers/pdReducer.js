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
      return { ...state, loading: true, error: '' };
    case PDLIST_FETCH_SUCCESS: {
      console.log('update home screen with numbers');
      const pds = action.payload.pds;
      
      //pds.PickReturnItems.push(lastItem);
      addGroup(pds, action.payload.orderGroup);
      console.log('pds add group');
      console.log(pds);
      const { 
        pickTotal,
        pickComplete,
        returnTotal,
        returnComplete,
        deliveryTotal,
        deliveryComplete } = calculateStatNumbers(pds);
      
      
      return { ...state, 
        error: '',
        pds,
        pdsId: pds.PickDeliverySessionID, 
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
      return { ...state, loading: false, error: action.payload };
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
      } else {
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
      const { OrderID, ClientHubID, ServiceCost, Length, Width, Height, Weight } = action.payload;
      const order = Utils.getOrder(pds, OrderID, ClientHubID, 1);
      order.ServiceCost = ServiceCost;
      order.Length = Length;
      order.Weight = Weight;
      order.Height = Height;
      order.Width = Width;
      return { ...state, pds, loading: false };
    }

    case PD_UPDATE_GROUP: {
      const pds = _.cloneDeep(state.pds);
      //const pds = state.pds;
      const orders = pds.DeliveryItems;
      const orderGroup = action.payload;
      console.log('pdReducer: Pd udpate group');
      console.log(orderGroup);
      orders.forEach((order, index) => {
        const group = orderGroup[order.OrderID];
        console.log(order.OrderID);
        console.log(group);
        if (group !== undefined) {
          orders[index].Group = group;
        } 
      });
      console.log(orders);
      console.log(pds);
      return { ...state, pds };
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

const addGroup = (pds, orderGroup) => {
  pds.DeliveryItems.forEach((order, index) => {
    pds.DeliveryItems[index].Group = orderGroup[order.OrderID] || null;
  });
};

const calculateStatNumbers = (pds) => {
  // pick
      const pickGroupList = pds.PickItems;
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
      const returnGroupList = pds.ReturnItems;
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


const lastItem = 
  {
    "DisplayOrder": 14,
    "ClientName": "doan dai ho tet ",
    "ContactName": "doan dai ho tet ",
    "ContactPhone": "01204790909",
    "ClientID": 192801,
    "ClientHubID": 297910,
    "CircleName": "",
    "PickReturnSOs": [
        {
            "OrderID": 253517,
            "OrderCode": "2H5DD6L1",
            "OldOrderCode": null,
            "ExternalCode": null,
            "CurrentStatus": "Picking",
            "RecipientName": "doan dai ho",
            "RecipientPhone": "0902933025",
            "DeliveryAddress": "344",
            "CODAmount": 500,
            "ServiceCost": 59400,
            "Note": "doan ai ho",
            "Log": "\n17/08/2017 16:26:37 - \n17/08/2017 16:26:37 - GHN-PC952A|NGƯỜI GỬI HẸN LẠI NGÀY LẤY - ",
            "SONote": null,
            "PickDeliverySessionDetailID": 110513,
            "EndPickTime": null,
            "UpdatedStatus": null,
            "PaymentTypeID": 1,
            "TotalExtraFee": 0,
            "Weight": 90,
            "ServiceID": 53322,
            "ServiceName": "3 Ngày",
            "TotalCollectedAmount": 500,
            "NextStatus": null,
            "Length": 8,
            "Width": 8,
            "Height": 8,
            "FromDistrictID": 1455,
            "ToDistrictID": 1453,
            "Lat": 0,
            "Lng": 0,
            "DistrictCode": "0214",
            "DistrictName": "Quận Tân Bình",
            "IsTrial": 0
        }
    ],
    "Lat": 0,
    "Lng": 0,
    "DistrictName": "Quận Tân Bình",
    "DistrictCode": "0214",
    "Address": "220 Lý Thường Kiệt, phường 9, Tân Bình, Hồ Chí Minh, Vietnam",
    "ExpectedDeliveryTime": "/Date(1503244800000)/",
    "PickDeliveryType": 3
  };
