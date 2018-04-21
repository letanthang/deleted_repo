import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/dom/ajax';

import ShareVariables from '../libs/ShareVariables';
import moment from 'moment';

//!!!!!!!!! turn on mock data!!!!!!!!!!
const mockOn = false;
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
      params: { fromDate: '2018-04-01T00:00:00.000Z', toDate: '2018-04-030T00:00:00.000Z', q: { driverId: tripUserId } },
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

export const GetUserActivePds = (tripCode, offset, limit, timeServer, clientHubId) => {
  const URL = `${PDS_URL}/pda/pds/orders`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: { tripCode, offset, limit, timeServer, clientHubId },
    timeout
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderResponse);
  }
  return axios.get(URL, config);
};

export const fetchTrip = (tripCode, offset, limit, timeServer, clientHubId) => {
  // const URL = `${PDS_URL}/pda/pds/orders`;
  // const LoginHeader = Share.LoginHeader;

  // return Observable.ajax({
  //   method: 'GET',
  //   url: URL,
  //   headers: {
  //     ...LoginHeader,
  //     'Content-Type': 'application/json',
  //   },
  //   body: { tripCode, offset, limit, timeServer, clientHubId }
  // });
  return fromPromise(GetUserActivePds(tripCode, offset, limit, timeServer));
};
// export const UpdatePickDeliverySession = ({ PDSID, OrderInfos }) => {
//   const URL = `${PDS_URL}/pdaone/${PDSID}`;
//   const params = {
//     PDSID,
//     OrderInfos
//   };
//   const LoginHeader = Share.LoginHeader;
//   const config = { headers: LoginHeader };

//   if (mockOn) {
//     mock.onPut(URL, params, config).reply(200, updateResponse);
//   }

//   return axios.put(URL, params, config);
// };

export const UpdateStatusGetRequest = (p) => {
    const { tripCode, tripCode, lastUpdatedTime, OrderInfos } = p;
    const URL = `${PDS_URL}/doAction/pda`;
    const params = {
      tripCode,
      lastUpdatedTime,
      orders: OrderInfos
    };
    const LoginHeader = Share.LoginHeader;
    const config = { headers: LoginHeader };
    return { URL, config, params };
  };

export const UpdateStatus = (p) => {
  const { tripCode, tripCode, lastUpdatedTime, OrderInfos } = p;
  const URL = `${PDS_URL}/doAction/pda`;
  const params = {
    tripCode,
    lastUpdatedTime,
    orders: OrderInfos
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };

  if (mockOn) {
    mock.onPut(URL, params, config).reply(200, updateStatusResponse);
  }

  return axios.put(URL, params, config);
};

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

// export const Authenticate = ({ UserID, Password }) => {
//   const URL = `${ACC_URL}/pdaLogin`;

//   if (mockOn) {
//     mock.onPost(URL, {
//         userid: UserID,
//         password: Password
//       }).reply(200, loginResponse);
//   }

//   return axios.post(URL, {
//       userid: UserID,
//       password: Password
//     });
// };

export const LoginUser = (userid, password ) => {
  const URL = `${ACC_URL}/pdaLogin`;

  return Observable.ajax({
    method: 'post',
    url: URL,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      userid,
      password
    }
  });
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
    return axios.get(URL, config);
};

export const AddOrders = (codes, tripCode, type) => {
    const URL = `${PDS_URL}/pds`;
    const LoginHeader = Share.LoginHeader;

    const config = {
        headers: LoginHeader,
        timeout,
        };
    const params = {
        codes,
        tripCode,
        type
    };

    return axios.put(URL, params, config);
};

export const GetOrderHistory = (code) => {
  const URL = `${PDS_URL}/history/order/${code}`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    timeout
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


const orderResponse = {
  "status": "OK",
  "data": [
    {
      "code": "3D91AAQK",
      "tripCode": "18412200TBFPF",
      "type": "PICK",
      "status": "PICKING",
      "isUpdatedStatus": false,
      "isCancel": false,
      "isOutstock": false,
      "clientAddress": "2 Ngô Đức Kế, Bến Nghé, Quận 1, Hồ Chí Minh",
      "clientAddressRemoveAccent": "2 Ngo Duc Ke, Ben Nghe, Quan 1, Ho Chi Minh",
      "clientPhone": "01644143456",
      "isCollected": false,
      "date": "2018-04-16T11:08:30.826Z",
      "id": "5ad4842ee888bdb1f2000012",
      "createdTime": "2018-04-17T03:29:09.278Z",
      "lastUpdatedTime": "2018-04-17T03:29:09.278Z"
    },
    {
      "code": "CDENNH9",
      "status": "PICKING",
      "receiverName": "Bui Van Muc",
      "receiverPhone": "01668117449",
      "moneyCollect": 71500,
      "serviceCost": 0,
      "Note": "",
      "log": "",
      "pickDeliverySessionDetailId": "59c252cfe5c882d9f512581c",
      "PaymentTypeID": 0,
      "TotalExtraFee": 0,
      "weight": 500,
      "serviceId": 53320,
      "serviceName": "1 Ngày",
      "TotalCollectedAmount": 0,
      "nextStatus": "",
      "length": 10,
      "width": 10,
      "height": 10,
      "fromDistrictId": 1453,
      "toDistrictId": 2086,
      "Lat": 0,
      "Lng": 0,
      "fromDistrictCode": "0211",
      "fromDistrictName": "Quận 11",
      "IsTrial": 0,
      "type": 'PICK',
      "clientId": 1,
      "clientName": 'Sendo.vn',
      "contactName": "Cau be vang",
      "contactPhone": "01668117449",
      "clientHubId": 653473,
      "address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "code": "CDENMMM",
      "status": "STORING",
      "receiverName": "Le Tan Thang",
      "receiverPhone": "01668117449",
      "moneyCollect": 71500,
      "serviceCost": 0,
      "Note": "",
      "log": "",
      "pickDeliverySessionDetailId": "59c252cfe5c882d9f512581c",
      "PaymentTypeID": 0,
      "TotalExtraFee": 0,
      "weight": 500,
      "serviceId": 53320,
      "serviceName": "1 Ngày",
      "TotalCollectedAmount": 0,
      "nextStatus": "",
      "length": 10,
      "width": 10,
      "height": 10,
      "fromDistrictId": 1453,
      "toDistrictId": 2086,
      "Lat": 0,
      "Lng": 0,
      "fromDistrictCode": "0211",
      "fromDistrictName": "Quận 11",
      "IsTrial": 0,
      "type": 'DELIVER',
      "clientId": 1,
      "clientName": 'Sendo.vn',
      "contactName": "Vi Tinh Ngoi Sao",
      "contactPhone": "01662777777",
      "clientHubId": 652273,
      "address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "code": "123NNH9",
      "status": "PICKING",
      "receiverName": "Nguoi nhan",
      "receiverPhone": "01668117449",
      "moneyCollect": 71500,
      "serviceCost": 0,
      "Note": "",
      "log": "",
      "pickDeliverySessionDetailId": "59c252cfe5c882d9f512581c",
      "PaymentTypeID": 0,
      "TotalExtraFee": 0,
      "weight": 500,
      "serviceId": 53320,
      "serviceName": "1 Ngày",
      "TotalCollectedAmount": 0,
      "nextStatus": "",
      "length": 10,
      "width": 10,
      "height": 10,
      "fromDistrictId": 1453,
      "toDistrictId": 2086,
      "Lat": 0,
      "Lng": 0,
      "fromDistrictCode": "0211",
      "fromDistrictName": "Quận 11",
      "IsTrial": 0,
      "type": 'PICK',
      "clientId": 2,
      "clientName": 'Shoppee',
      "contactName": "Shop B",
      "contactPhone": "01668117449",
      "clientHubId": 653474,
      "address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "code": "JJAAJAA",
      "status": "RETURNING",
      "receiverName": "Cường gửi",
      "receiverPhone": "01668117449",
      "moneyCollect": 71500,
      "serviceCost": 0,
      "Note": "",
      "log": "",
      "pickDeliverySessionDetailId": "59c252cfe5c882d9f512581c",
      "PaymentTypeID": 0,
      "TotalExtraFee": 0,
      "weight": 500,
      "serviceId": 53320,
      "serviceName": "1 Ngày",
      "TotalCollectedAmount": 0,
      "nextStatus": "",
      "length": 10,
      "width": 10,
      "height": 10,
      "fromDistrictId": 1453,
      "toDistrictId": 2086,
      "Lat": 0,
      "Lng": 0,
      "fromDistrictCode": "0211",
      "fromDistrictName": "Quận 11",
      "IsTrial": 0,
      "type": 'RETURN',
      "clientId": 2,
      "clientName": 'Shoppee',
      "contactName": "Cường gửi",
      "contactPhone": "01668555555",
      "clientHubId": 653474,
      "address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    }
  ],
  total: 5,
  "message": ""
}


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
      "listOk":[
        { "code":"3A5D76UA", "status":"DELIVERED" }
      ],
      "listFail":[
        { "code":"J888JD9", "status":"DELIVERED" }
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
