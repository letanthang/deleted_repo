import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/dom/ajax';

import ShareVariables from '../libs/ShareVariables';

//!!!!!!!!! turn on mock data!!!!!!!!!!
const mockOn = false;
const timeout = 20000;

// const DOMAIN = 'api.inhubv2.ghn.vn';
// const DOMAIN = 'api.staging.inhubv2.ghn.vn';
// const PDS_URL = 'http://api.inhubv2.ghn.vn/pds/v2';
// const ACC_URL = 'http://api.inhubv2.ghn.vn/acc/v2';
const PDS_URL = 'http://api.staging.lastmile.ghn.vn/lastmile/v1';
const ACC_URL = 'http://api.staging.lastmile.ghn.vn/account/v1';
// const ACC_URL = 'http://api.staging.inhubv2.ghn.vn/acc/v2';
const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePdsInfo = (tripUserId) => {
    const URL = `${PDS_URL}/trip/search`;
    const LoginHeader = Share.LoginHeader;
  
    const config = {
      headers: LoginHeader,
      params: { q: { driverId: tripUserId, status: 'ON_TRIP' } },
      timeout
    };
  
    if (mockOn) {
      mock.onGet(URL, config).reply(200, infoResponse);
    }
    return axios.get(URL, config);
  };

export const fetchTripInfo = (tripUserId) => {
  // const URL = `${PDS_URL}/order/text-search`;
  // const LoginHeader = Share.LoginHeader;

  // return Observable.ajax({
  //   method: 'get',
  //   url: `${URL}?tripUserId=${tripUserId}`,
  //   headers: {
  //     ...LoginHeader,
  //     'Content-Type': 'application/json',
  //   }
  // });

  return fromPromise(GetUserActivePdsInfo(tripUserId));
};  

export const GetUserActivePds = (tripCode, offset, limit, lastUpdatedTime, senderHubId) => {
  const URL = `${PDS_URL}/order/pda-search`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: { offset, limit, lastUpdatedTime, q: { tripCode, senderHubId } },
    timeout
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, ordersResponse);
  }
  return axios.get(URL, config);
};

export const fetchTrip = (tripCode, offset, limit, lastUpdatedTime, senderHubId) => {
  // const URL = `${PDS_URL}/pda/pds/orders`;
  // const LoginHeader = Share.LoginHeader;

  // return Observable.ajax({
  //   method: 'GET',
  //   url: URL,
  //   headers: {
  //     ...LoginHeader,
  //     'Content-Type': 'application/json',
  //   },
  //   body: { tripCode, offset, limit, timeServer, senderHubId }
  // });
  return fromPromise(GetUserActivePds(tripCode, offset, limit, lastUpdatedTime, senderHubId));
};

export const DoAction = (OrderInfos) => {
  const URL = `${PDS_URL}/order/action`;
  const params = {
    orders: OrderInfos
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };

  if (mockOn) {
    mock.onPut(URL, params, config).reply(200, updateStatusResponse);
  }

  return axios.put(URL, params, config);
};

export const updateOrderStatus = (OrderInfos) => {
  return fromPromise(DoAction(OrderInfos));
}

export const UpdateOrderWeightRDC = ({ 
  length,
  width,
  height,
  weight,
  clientId,
  code,
  PDSID }) => {  
  const URL = `${PDS_URL}/fee`;
  const LoginInfo = Share.getLoginInfo();
  const params = {
    ...LoginInfo,
    length,
    width,
    height,
    weight,
    clientId,
    code,
    PDSID
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.put(URL, params, config);
};

export const Authenticate = (userid, password) => {
  const URL = `${ACC_URL}/pdaLogin`;
  const params = {
    userid,
    password
  };
  if (mockOn) {
    mock.onPost(URL, params).reply(200, loginResponse);
  }

  return axios.post(URL, params);
};

export const loginUser = (userid, password ) => {
  // const URL = `${ACC_URL}/pdaLogin`;

  // return Observable.ajax({
  //   method: 'post',
  //   url: URL,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: {
  //     userid,
  //     password
  //   }
  // });
  return fromPromise(Authenticate(userid, password))
};

export const GetUserPerformance = (UserID, from = null, to = null) => {
  const URL = `${PDS_URL}/performance/${UserID}`;
  const LoginHeader = Share.LoginHeader;
  const config = {
      headers: LoginHeader,
      timeout,
      params: {
          q: { from, to }
      }
    };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, performanceResponse);
  }
  return axios.get(URL, config);
};

export const GetConfiguration = (configKey = null) => {
  const URL = `${PDS_URL}/pdaconfig`;
  const LoginHeader = Share.LoginHeader;
  const config = { 
      headers: LoginHeader,
      params: { configKey }
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, configResponse);
  }
  
  return axios.get(URL, config);
};
  
export const CalculateServiceFee = (params) => {
  const URL = `${PDS_URL}/fee`;
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.post(URL, params, config);
};

export const GetOrderDetailInfo = (code, type, tripCode) => {
  const URL = `${PDS_URL}/order/multi`;
  const LoginHeader = Share.LoginHeader;

  const params = {
    orders: [{ code, tripCode, type, objectType: ['ORDER_DETAIL'] }]
  };
  const config = {
    headers: LoginHeader,
    timeout
  };

  if (mockOn) {
    mock.onPost(URL, params, config).reply(200, orderDetailResponse);
  }
  
  return axios.post(URL, params, config);
};

export const getOrderDetail = (code, type, tripCode) => {
  return fromPromise(GetOrderDetailInfo(code, type, tripCode));
};

// {
// 	"orders": [
// 		{
// 			"code": "3DANFHXU",
// 			"type": "PICK"
// 		}
// 	]
// }
export const AddOrders = (orders, tripCode) => {
    const URL = `${PDS_URL}/trip/${tripCode}/order`;
    const LoginHeader = Share.LoginHeader;

    const config = {
        headers: LoginHeader,
        timeout,
        };
    const params = {
        orders
    };
    if (mockOn) {
      mock.onPost(URL, params, config).reply(200, addOrdersResponse);
    }

    return axios.post(URL, params, config);
};

export const addOrders = (orders, tripCode) => {
  return fromPromise(AddOrders(orders, tripCode));
};

export const GetOrderHistory = (code) => {
  const URL = `${PDS_URL}/order-history/search`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    timeout,
    params: { offset: 0, limit: 100, q: { code } }
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderHistoryResponse);
  }
  return axios.get(URL, config);
};

const infoResponse = {
  "status": "OK",
  "data": [
    {
      "code": "184122056HC7B",
      "status": "NEW",
      "hubId": "1220",
      "createdById": "1006",
      "createdByName": "Nguyễn Trịnh Khánh Tường",
      "lastUpdatedById": "1006",
      "lastUpdatedByName": "Nguyễn Trịnh Khánh Tường",
      "amountCollected": 0,
      "amountCollect": 0,
      "date": "2018-04-20T07:48:00.653Z",
      "id": "5ad99b30e893788f8f000003",
      "createdTime": "2018-04-20T07:48:00.653Z",
      "lastUpdatedTime": "2018-04-20T07:48:00.653Z"
    }
  ]
};

const orderDetailResponse = {
  "status": "OK",
  "data": [
    {
      "tripCode": "1841416KQPRP2",
      "code": "321ABC123A",
      "type": "PICK",
      "orderDetail": {
        "externalCode": "",
        "driverId": "210030",
        "driverName": "Lê Tấn Thắng",
        "driverPhone": "0933932173",
        "moneyCollect": 0,
        "length": 1,
        "width": 1,
        "height": 1,
        "weight": 2,
        "fromDistrictId": "1488",
        "fromDistrictCode": "1A03",
        "fromDistrictName": "Quận 10",
        "toDistrictId": "1488",
        "toDistrictCode": "1A03",
        "toDistrictName": "Quận 10",
        "senderHubId": "2007960",
        "senderId": "1539",
        "senderName": "NganHTKN",
        "senderPhone": "0916863003",
        "senderAddress": "75 Tô Hiến Thành ,quận 10, Hồ Chí Minh",
        "receiverId": "",
        "receiverName": "Hồ Thị Kim Ngân",
        "receiverPhone": "01283377234",
        "receiverAddress": "address giao test",
        "clientExtraNote": "Mã SP: 9057382729348000914, Tên SP: Sách Ngược Đời Xuôi, Số lượng: 2 Quyển; ",
        "clientRequiredNote": ""
      }
    }
  ]
};


const ordersResponse = {
  "status": "OK",
  "data": [
    {
      "code": "GHN-TEST-102",
      "tripCode": "18414164VNDP8",
      "type": "PICK",
      "status": "PICKING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "7071",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327102",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a00000c",
      "createdTime": "2018-04-22T01:51:02.859Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.859Z",
      extraInfo: {
        moneyCollect: 20000,
        width: 20,
        length: 30,
        height: 40,
        weight: 100,
        receiverName: 'Le Nghia',
        receiverPhone: '0908345008',
        receiverAddress: '30 Địa chỉ giao test',
        senderHubId: '12',
        senderName: 'Shop Thien Thai',
        senderPhone: '0969696969',
        senderAddress: '70 Địa chỉ lấy test',
        clientName: 'Shopee',
        pickWarehouseId: 23, 
        deliverWarehouseId: 23,
        serviceName: '1h'
      }
    },
    {
      "code": "GHN-TEST-100",
      "tripCode": "18414164VNDP8",
      "type": "PICK",
      "status": "PICKING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "7071",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327100",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a00000a",
      "createdTime": "2018-04-22T01:51:02.852Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.852Z",
      extraInfo: {
        moneyCollect: 30000,
        width: 25,
        length: 35,
        height: 45,
        weight: 200,
        receiverName: 'Le Nghia',
        receiverPhone: '0933345123',
        receiverAddress: '40 Địa chỉ giao test',
        senderHubId: '12',
        senderName: 'Shop Thien Thai',
        senderPhone: '0969696969',
        senderAddress: '70 Địa chỉ lấy test',
        clientName: 'Shopee',
        pickWarehouseId: 23, 
        deliverWarehouseId: 23,
        serviceName: '1h'
      }
    },
    {
      "code": "GHN-TEST-101",
      "tripCode": "18414164VNDP8",
      "type": "DELIVER",
      "status": "DELIVERING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "6000",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327101",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a000008",
      "createdTime": "2018-04-22T01:51:02.845Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.845Z",
      extraInfo: {
        moneyCollect: 40000,
        receiverName: 'Le Nghia',
        receiverPhone: '0933345123',
        receiverAddress: '40 Địa chỉ giao test',
        senderHubId: '12',
        senderName: 'Shop Thien Thai',
        senderPhone: '0969696969',
        senderAddress: '70 Địa chỉ lấy test',
        serviceName: '1h'
      }
    },
  ],
  total: 3,
  "message": ""
}

const addOrdersResponse = {
  "status": "OK",
  "data": [
  ]
};


const configResponse = {
    "status": "OK",
    "data": [
        {
            "timeExpire": 86400000,
            "alpha": 0.2,
            "maxWeight": 500000,
            "minWeight": 1,
            "maxSize": 200,
            "minSize": 1,
            "initLoad": 0,
            "initLoadTrial": 1,
            "idsTrial": 0,
            "interval": 10000,
            "fastestInterval": 5000,
            "pushDataInterval": 300000,
            "priority": 1,
            "smallestDisplacement": 30,
            "numberOfRecord": 20,
            "endTimeTracking": 1045,
            "startTimeTracking": 500,
            "code": 0,
            // "minDurationCallLogNoAnswer": "20000",
            // "minDurationCallLogUnconnected": "5000",
            // "repeatCallNoAnswer": "3",
            // "repeatCallUnconnected": "3"
        }
    ],
    "message": ""
}

const loginResponse = {
    "status": "OK",
    "message": "Successfull",
    "data": {
        "session": "40cf13dc238677d0c3632a5c30276c61",
        "expired": 1506671613820,
        "userInfo": {
            "fullname": "Lê Tấn Thắng",
            "email": "thanglt@ghn.vn",
            "phone": "0933932173",
            "ssoId": "210030",
            "roles": [
                {
                    "name": "PDA",
                    "description": "Quyền cho PDA",
                    "permissionList": [
                        "PDAConfig_EDIT",
                        "PDAConfig_VIEW",
                        "PDA_EDIT",
                        "PDA_VIEW"
                    ],
                    "orderNumber": 3,
                    "id": "59c21fa4bae4ba6f3d33458e",
                    "createdTime": "Sep 20, 2017 2:58:28 PM",
                    "lastUpdatedTime": "Sep 20, 2017 4:47:05 PM"
                }
            ],
            "hubIds": [
                "SGN"
            ],
            "portIds": [
                "5882d8830c28171270a6ebd6",
                "5882e1060c28171270a6ebe6",
                "5882e1550c28171270a6ebe8",
                "5882e28f0c28171270a6ebea",
                "58954a3f0c2817118cd21621",
                "58954a5b0c2817118cd21622",
                "58954a740c2817118cd21623",
                "58954a8d0c2817118cd21624",
                "58954ab50c2817118cd21625",
                "58954ac70c2817118cd21626",
                "58954ae30c2817118cd21627",
                "58954afd0c2817118cd21628",
                "58954b130c2817118cd21629",
                "58954b390c2817118cd2162a",
                "5950c47a0c28171d000cfcee"
            ],
            "secret": "ztSYIyaP59S0tA18Sd4xfPr00vds3Tq1Rplwoqi5ia3pjD3X0tO",
            "status": "ACTIVE",
            "isSupperUser": false,
            "userType": 1
        }
    }
}

const performanceResponse = {
    "status": "OK",
    "data": [
        {
            "driverId": "210030",
            "performanceDate": "Oct 12, 2017 12:00:00 AM",
            "pickSucceed": 0,
            "pickTotal": 1,
            "deliverSucceed": 0,
            "deliverTotal": 0,
            "returnSucceed": 0,
            "returnTotal": 0,
            "from": 0,
            "to": 0,
            "id": "59e5808fbae4ba33ce3c4e7c",
            "createdTime": "Oct 17, 2017 11:01:19 AM",
            "lastUpdatedTime": "Oct 17, 2017 11:01:19 AM"
        },
        {
            "driverId": "210030",
            "performanceDate": "Oct 16, 2017 12:00:00 AM",
            "pickSucceed": 6,
            "pickTotal": 10,
            "deliverSucceed": 1,
            "deliverTotal": 1,
            "returnSucceed": 0,
            "returnTotal": 0,
            "from": 0,
            "to": 0,
            "id": "59e5808fbae4ba33ce3c4e7d",
            "createdTime": "Oct 17, 2017 11:01:19 AM",
            "lastUpdatedTime": "Oct 17, 2017 11:01:19 AM"
        },
        {
            "driverId": "210030",
            "performanceDate": "Oct 17, 2017 12:00:00 AM",
            "pickSucceed": 0,
            "pickTotal": 2,
            "deliverSucceed": 0,
            "deliverTotal": 0,
            "returnSucceed": 0,
            "returnTotal": 0,
            "from": 0,
            "to": 0,
            "id": "59e6c288bae4ba32d1ef263b",
            "createdTime": "Oct 18, 2017 9:55:04 AM",
            "lastUpdatedTime": "Oct 18, 2017 9:55:04 AM"
        }
    ],
    "total": 3,
    "message": "Query performance successfully."
}

// const updateResponse = {
//   "status": "OK",
//   "data": {
//     failed_orders: []
//   },
//   "message": "Successfull"
// }

const updateStatusResponse = {
  "status": "OK",
  "data": [
    { 
      "listSuccess": [],
      "listFail": [
          {
              "code": "3DKX99HK",
              "type": "DELIVER",
              "message": "Order is not valid"
          }
      ]
    }
  ],
  "message": "Successfull"
}

const orderHistoryResponse = {
  "status":"OK",
  "data":[
    {
      "code":"3C5DFSAK","actionCode":"ADD_TO_PDS","userId":"210030","userName":"Lê Tấn Thắng",
      historyType: 'CREATE_TRIP', 
      createdById: 1006, 
      createdByName: 'Nguyen Khanh Tuong',
      "date":"2018-03-16T04:39:42.330Z","id":"5aab4a8ee81ce73bda00004f","createdTime":"2018-03-16T04:39:42.331Z","lastUpdatedTime":"2018-03-16T04:39:42.331Z"
    },
    {
      "code":"3C5DFSAK","actionCode":"UPDATE_STATUS","userId":"206353","userName":"Nguyễn Trương Quý",
      historyType: 'ADD_TO_TRIP', 
      createdById: 210030, 
      createdByName: 'Le Tan Thang',
      "date":"2018-03-23T04:20:11.608Z","id":"5ab4807be8347c2a1c000004","createdTime":"2018-03-23T04:20:11.610Z","lastUpdatedTime":"2018-03-23T04:20:11.610Z"
    }
  ],
  "message":""
};
