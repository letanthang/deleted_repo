import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ShareVariables from '../libs/ShareVariables';
import moment from 'moment';

//!!!!!!!!! turn on mock data!!!!!!!!!!
const mockOn = true;
const timeout = 20000;

// const DOMAIN = 'api.inhubv2.ghn.vn';
// const DOMAIN = 'api.staging.inhubv2.ghn.vn';
const PDS_URL = 'http://api.inhubv2.ghn.vn/pds/v2';
const ACC_URL = 'http://api.inhubv2.ghn.vn/acc/v2';
// const PDS_URL = 'http://api.staging.inhubv2.ghn.vn/pds/v2';
// const ACC_URL = 'http://api.staging.inhubv2.ghn.vn/acc/v2';
const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePdsInfo = (tripUserId) => {
    const URL = `${PDS_URL}/pda/pds/info`;
    const LoginHeader = Share.LoginHeader;
  
    const config = {
      headers: LoginHeader,
      params: { tripUserId },
      timeout
    };
  
    if (mockOn) {
      mock.onGet(URL, config).reply(200, infoResponse);
    }
    return axios.get(URL, config);
  };

export const GetUserActivePds = (pdsCode, offset, limit, timeServer, clientHubId) => {
  const URL = `${PDS_URL}/pda/pds/orders`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: { pdsCode, offset, limit, timeServer, clientHubId },
    timeout
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderResponse);
  }
  return axios.get(URL, config);
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
    const { pdsId, pdsCode, lastUpdatedTime, OrderInfos } = p;
    const URL = `${PDS_URL}/doAction/pda`;
    const params = {
      pdsId,
      pdsCode,
      lastUpdatedTime,
      orders: OrderInfos
    };
    const LoginHeader = Share.LoginHeader;
    const config = { headers: LoginHeader };
    return { URL, config, params };
  };

export const UpdateStatus = (p) => {
  const { pdsId, pdsCode, lastUpdatedTime, OrderInfos } = p;
  const URL = `${PDS_URL}/doAction/pda`;
  const params = {
    pdsId,
    pdsCode,
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
  orderCode,
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
    orderCode,
    PDSID
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.put(URL, params, config);
};

export const Authenticate = ({ UserID, Password }) => {
  const URL = `${ACC_URL}/pdaLogin`;

  if (mockOn) {
    mock.onPost(URL, {
        userid: UserID,
        password: Password
      }).reply(200, loginResponse);
  }

  return axios.post(URL, {
      userid: UserID,
      password: Password
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

export const GetOrderByCode = (orderCode) => {
    const URL = `${PDS_URL}/order`;
    const LoginHeader = Share.LoginHeader;
    const config = {
        headers: LoginHeader,
        timeout,
        params: {
            q: { order_code: orderCode }
        }
    };
    return axios.get(URL, config);
};

export const AddOrders = (orderCodes, pdsId, pickDeliveryType = 2) => {
    const URL = `${PDS_URL}/pds`;
    const LoginHeader = Share.LoginHeader;

    const type = pickDeliveryType == 2 ? 'DELIVER' : 'PICK';
    const config = {
        headers: LoginHeader,
        timeout,
        };
    const params = {
        orderCodes,
        pdsId,
        type
    };

    return axios.put(URL, params, config);
};

export const GetOrderHistory = (orderCode) => {
  const URL = `${PDS_URL}/history/order/${orderCode}`;
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
        "employeeFullName": "Võ Đức Đạt",
        "coordinatorFullName": "Trần Chí Cường",
        "coordinatorPhone": "0939006988",
        "pickDeliverySessionID": "59c252cfbae4ba02c08327ba",
        "pdsCode": "170920DVPGUN",
        "StartTime": "Sep 20, 2017 6:37:21 PM",
        "lastUpdatedTime": "Sep 20, 2017 6:37:21 PM",
        "SType": 0,
    }
  ]
};


const orderResponse = {
  "status": "OK",
  "data": [
    {
      "orderCode": "23ABCN9",
      "currentStatus": "PICKING",
      "recipientName": "Ng Van A",
      "recipientPhone": "01668117449",
      "senderPay": 61500,
      "receiverPay": 1500,
      "returnPay": 71500,
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
      "FromDistrictID": 1453,
      "ToDistrictID": 2086,
      "Lat": 0,
      "Lng": 0,
      "districtCode": "0211",
      "districtName": "Quận 11",
      "IsTrial": 0,
      "pickDeliveryType": 1,
      "clientId": 1,
      "clientName": 'Sendo.vn',
      "contactName": "Shop Dong Ho",
      "contactPhone": "01668117449",
      "clientHubId": 653473,
      "address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam",
      "deliveryAddress": "70 Lu Gia, Phuong mot nam, Ho Chi Minh City, Vietnam"
    },
    {
      "orderCode": "CDENNH9",
      "currentStatus": "PICKING",
      "recipientName": "Bui Van Muc",
      "recipientPhone": "01668117449",
      "senderPay": 71500,
      "receiverPay": 91000,
      "returnPay": 71500,
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
      "FromDistrictID": 1453,
      "ToDistrictID": 2086,
      "Lat": 0,
      "Lng": 0,
      "districtCode": "0211",
      "districtName": "Quận 11",
      "IsTrial": 0,
      "pickDeliveryType": 1,
      "clientId": 1,
      "clientName": 'Sendo.vn',
      "contactName": "Cau be vang",
      "contactPhone": "01668117449",
      "clientHubId": 653473,
      "address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "orderCode": "CDENMMM",
      "currentStatus": "STORING",
      "recipientName": "Le Tan Thang",
      "recipientPhone": "01668117449",
      "senderPay": 71500,
      "receiverPay": 100000,
      "returnPay": 71500,
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
      "FromDistrictID": 1453,
      "ToDistrictID": 2086,
      "Lat": 0,
      "Lng": 0,
      "districtCode": "0211",
      "districtName": "Quận 11",
      "IsTrial": 0,
      "pickDeliveryType": 2,
      "clientId": 1,
      "clientName": 'Sendo.vn',
      "contactName": "Vi Tinh Ngoi Sao",
      "contactPhone": "01662777777",
      "clientHubId": 652273,
      "address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "orderCode": "123NNH9",
      "currentStatus": "PICKING",
      "recipientName": "Nguoi nhan",
      "recipientPhone": "01668117449",
      "senderPay": 71500,
      "receiverPay": 100500,
      "returnPay": 71500,
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
      "FromDistrictID": 1453,
      "ToDistrictID": 2086,
      "Lat": 0,
      "Lng": 0,
      "districtCode": "0211",
      "districtName": "Quận 11",
      "IsTrial": 0,
      "pickDeliveryType": 1,
      "clientId": 2,
      "clientName": 'Shoppee',
      "contactName": "Shop B",
      "contactPhone": "01668117449",
      "clientHubId": 653474,
      "address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
    },
    {
      "orderCode": "JJAAJAA",
      "currentStatus": "RETURNING",
      "recipientName": "Cường gửi",
      "recipientPhone": "01668117449",
      "senderPay": 71500,
      "receiverPay": 200000,
      "returnPay": 82500,
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
      "FromDistrictID": 1453,
      "ToDistrictID": 2086,
      "Lat": 0,
      "Lng": 0,
      "districtCode": "0211",
      "districtName": "Quận 11",
      "IsTrial": 0,
      "pickDeliveryType": 3,
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
        { "orderCode":"3A5D76UA", "status":"DELIVERED" }
      ],
      "listFail":[
        { "orderCode":"J888JD9", "status":"DELIVERED" }
      ]
    }
  ],
  "message": "Successfull"
}

const orderHistoryResponse = {
  "status":"OK",
  "data":[
    {
      "orderCode":"3C5DFSAK","actionCode":"ADD_TO_PDS","userId":"210030","userName":"Lê Tấn Thắng",
      "description":"Tạo CĐ 1803168D9FFW","succeed":true,"source":"BROWSER",
      "data":"{\"orderId\":305839,\"orderCode\":\"3C5DFSAK\",\"type\":\"PICK\",\"status\":\"READY_TO_PICK\",\"audited\":false,\"isCompleted\":false,\"moneyCollected\":false,\"senderPay\":31900.0,\"receiverPay\":48000.0,\"returnPay\":0.0,\"pdsId\":\"5aab4a8dad494e0f4095a28a\",\"pdsCode\":\"1803168D9FFW\",\"createdUserid\":\"210030\",\"createdUsername\":\"Lê Tấn Thắng\",\"sortIndex\":129,\"partnerCode\":\"Giaohangnhanh\",\"tripUserid\":\"210030\",\"tripUsername\":\"Lê Tấn Thắng\",\"warehouseId\":1220,\"note\":\"Không cho xem hàng\",\"noteContent\":\"\",\"clientId\":193041}",
      "date":"2018-03-16T04:39:42.330Z","id":"5aab4a8ee81ce73bda00004f","createdTime":"2018-03-16T04:39:42.331Z","lastUpdatedTime":"2018-03-16T04:39:42.331Z"
    },
    {
      "orderCode":"3C5DFSAK","actionCode":"UPDATE_STATUS","userId":"206353","userName":"Nguyễn Trương Quý",
      "description":"Cập nhật trạng thái đơn hàng PICKING\u003d\u003eSTORING","succeed":true,"source":"BROWSER",
      "data":"{\"orderId\":305839,\"orderCode\":\"3C5DFSAK\",\"type\":\"PICK\",\"status\":\"STORING\",\"audited\":false,\"isCompleted\":true,\"moneyCollected\":false,\"pdsId\":\"5aab4a8dad494e0f4095a28a\",\"pdsCode\":\"1803168D9FFW\",\"sortIndex\":129,\"tripUserid\":\"210030\",\"partnerCode\":\"Giaohangnhanh\",\"date\":\"2018-03-16T04:39:42.322Z\",\"id\":\"5aab4a8ee81ce7e88f00004b\",\"createdTime\":\"2018-03-16T04:39:42.322Z\",\"lastUpdatedTime\":\"2018-03-16T04:39:42.322Z\"}",
      "date":"2018-03-23T04:20:11.608Z","id":"5ab4807be8347c2a1c000004","createdTime":"2018-03-23T04:20:11.610Z","lastUpdatedTime":"2018-03-23T04:20:11.610Z"
    }
  ],
  "message":""
};
