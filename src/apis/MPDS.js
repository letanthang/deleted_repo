import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/dom/ajax';

import ShareVariables from '../libs/ShareVariables';
import moment from 'moment';

//!!!!!!!!! turn on mock data!!!!!!!!!!
const mockOn = true;
const timeout = 20000;

// const DOMAIN = 'api.inhubv2.ghn.vn';
// const DOMAIN = 'api.staging.inhubv2.ghn.vn';
// const PDS_URL = 'http://api.inhubv2.ghn.vn/pds/v2';
// const ACC_URL = 'http://api.inhubv2.ghn.vn/acc/v2';
const PDS_URL = 'http://api.staging.lastmile.ghn.vn/lastmile/v1';
const ACC_URL = 'http://api.staging.inhubv2.ghn.vn/acc/v2';
const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePdsInfo = (tripUserId) => {
    const URL = `${PDS_URL}/trip/search`;
    const LoginHeader = Share.LoginHeader;
  
    const config = {
      headers: LoginHeader,
      params: { q: { driverId: tripUserId } },
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

export const GetUserActivePds = (tripCode, offset, limit, timeServer) => {
  const URL = `${PDS_URL}/order/search`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: { offset, limit, fromDate: timeServer, q: { tripCode } },
    timeout
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, ordersResponse);
  }
  return axios.get(URL, config);
};

export const fetchTrip = (tripCode, offset, limit, timeServer) => {
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
  return fromPromise(GetUserActivePds(tripCode, offset, limit, timeServer));
};

export const DoAction = (OrderInfos) => {
  const URL = `${PDS_URL}/doAction/pda`;
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

export const GetOrderByCode = (code) => {
  const URL = `${PDS_URL}/order`;
  const LoginHeader = Share.LoginHeader;
  const config = {
      headers: LoginHeader,
      timeout,
      params: {
          q: { order_code: code }
      }
  };
  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderDetailResponse);
  }
  return axios.get(URL, config);
};

export const getOrderDetail = (code) => {
  return fromPromise(GetOrderByCode(code));
}

// {
// 	"orders": [
// 		{
// 			"code": "3DANFHXU",
// 			"type": "PICK"
// 		}
// 	]
// }
export const AddOrders = (orders, tripCode) => {
    const URL = `${PDS_URL}/trip/${tripCode}/add-order`;
    const LoginHeader = Share.LoginHeader;

    const config = {
        headers: LoginHeader,
        timeout,
        };
    const params = {
        orders
    };
    if (mockOn) {
      mock.onPut(URL, params, config).reply(200, addOrdersResponse);
    }

    return axios.put(URL, params, config);
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
      "externalCode": "MDHKHDUNGTHU",
      "driverId": "206353",
      "driverName": "Nguyễn Trương Quý",
      "moneyCollect": 0,
      "length": 1,
      "width": 1,
      "height": 1,
      "weight": 2,
      "fromDistrictId": "1324",
      "fromDistrictCode": "70",
      "fromDistrictName": "GHN TEST LẤY",
      "toDistrictId": "1324",
      "toDistrictCode": "71",
      "toDistrictName": "GHN TEST NHẬN",
      "senderHubId": "70123",
      "senderId": "7071",
      "senderName": "Võ Đức Đạt",
      "senderPhone": "01674951343",
      "senderAddress": "70 Địa chỉ lấy test",
      "receiverId": "",
      "receiverName": "Dương Ngọc Hằng",
      "receiverPhone": "01283377234",
      "receiverAddress": "01283377234",
      "clientExtraNote": "Mã SP: 9057382729348000914, Tên SP: Sách Ngược Đời Xuôi, Số lượng: 2 Quyển; ",
      "clientRequiredNote": ""
    }
  ]
};


const ordersResponse = {
  "status": "OK",
  "data": [
    {
      "code": "GHN-TEST-27032018-102",
      "tripCode": "18414164VNDP8",
      "type": "PICK",
      "status": "PICKING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "7071",
      "clientName": "Shopee",
      "senderAddress": "70 Địa chỉ lấy test",
      "senderHubId": "12",
      "receiverAddress": "30 Địa chỉ giao test",
      "receiverName": "Le Nghia",
      "receiverPhone": "0908345008",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327102",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a00000c",
      "createdTime": "2018-04-22T01:51:02.859Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.859Z",
      moneyCollect: 20000
    },
    {
      "code": "GHN-TEST-27032018-100",
      "tripCode": "18414164VNDP8",
      "type": "PICK",
      "status": "PICKING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "7071",
      "clientName": "Shopee",
      "senderAddress": "70 Địa chỉ lấy test",
      "senderHubId": "12",
      "receiverAddress": "40 Địa chỉ giao test",
      "receiverName": "Van Toan",
      "receiverPhone": "0933345123",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327100",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a00000a",
      "createdTime": "2018-04-22T01:51:02.852Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.852Z",
      moneyCollect: 30000
    },
    {
      "code": "GHN-TEST-27032018-101",
      "tripCode": "18414164VNDP8",
      "type": "DELIVER",
      "status": "DELIVERING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isScanImport": false,
      "isOutstock": true,
      "clientId": "6000",
      "senderAddress": "80 Địa chỉ lấy test",
      "senderHubId": "12",
      "receiverAddress": "50 Địa chỉ giao test",
      "clientAddressRemoveAccent": "70 Dia chi lay test",
      "clientPhone": "01674951343",
      "isCollected": true,
      "orderId": "270327101",
      "date": "2018-04-22T01:50:58.248Z",
      "id": "5adbea82e89962bc3a000008",
      "createdTime": "2018-04-22T01:51:02.845Z",
      "lastUpdatedTime": "2018-04-22T01:51:02.845Z",
      moneyCollect: 40000
    },
  ],
  total: 5,
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
      "description":"Tạo CĐ 1803168D9FFW","succeed":true,"source":"BROWSER",
      "data":"{\"orderId\":305839,\"code\":\"3C5DFSAK\",\"type\":\"PICK\",\"status\":\"READY_TO_PICK\",\"audited\":false,\"isCompleted\":false,\"moneyCollected\":false,\"moneyCollect\":31900.0,\"moneyCollect\":48000.0,\"moneyCollect\":0.0,\"tripCode\":\"5aab4a8dad494e0f4095a28a\",\"tripCode\":\"1803168D9FFW\",\"createdUserid\":\"210030\",\"createdUsername\":\"Lê Tấn Thắng\",\"sortIndex\":129,\"partnerCode\":\"Giaohangnhanh\",\"tripUserid\":\"210030\",\"tripUsername\":\"Lê Tấn Thắng\",\"warehouseId\":1220,\"note\":\"Không cho xem hàng\",\"noteContent\":\"\",\"clientId\":193041}",
      "date":"2018-03-16T04:39:42.330Z","id":"5aab4a8ee81ce73bda00004f","createdTime":"2018-03-16T04:39:42.331Z","lastUpdatedTime":"2018-03-16T04:39:42.331Z"
    },
    {
      "code":"3C5DFSAK","actionCode":"UPDATE_STATUS","userId":"206353","userName":"Nguyễn Trương Quý",
      "description":"Cập nhật trạng thái đơn hàng PICKING\u003d\u003eSTORING","succeed":true,"source":"BROWSER",
      "data":"{\"orderId\":305839,\"code\":\"3C5DFSAK\",\"type\":\"PICK\",\"status\":\"STORING\",\"audited\":false,\"isCompleted\":true,\"moneyCollected\":false,\"tripCode\":\"5aab4a8dad494e0f4095a28a\",\"tripCode\":\"1803168D9FFW\",\"sortIndex\":129,\"tripUserid\":\"210030\",\"partnerCode\":\"Giaohangnhanh\",\"date\":\"2018-03-16T04:39:42.322Z\",\"id\":\"5aab4a8ee81ce7e88f00004b\",\"createdTime\":\"2018-03-16T04:39:42.322Z\",\"lastUpdatedTime\":\"2018-03-16T04:39:42.322Z\"}",
      "date":"2018-03-23T04:20:11.608Z","id":"5ab4807be8347c2a1c000004","createdTime":"2018-03-23T04:20:11.610Z","lastUpdatedTime":"2018-03-23T04:20:11.610Z"
    }
  ],
  "message":""
};
