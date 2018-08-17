import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/dom/ajax';

import ShareVariables from '../libs/ShareVariables';
import { infoResponse, loginResponse, addOrdersResponse, orderDetailResponse, ordersResponse, configResponse, orderHistoryResponse, performanceResponse, updateStatusResponse, newOrdersResponse } from './mock';


// ---------turn on mock data----------
const mockOn = false;
const timeout = 9500;
export const live = true;
export const appVersionName = '17/08';

const PDS_URL = 'http://api.lastmile.ghn.vn/trip/v2';
const ACC_URL = 'http://api.lastmile.ghn.vn/acc/v1';
const OSS_URL = 'http://api.ops.ghn.vn/oss/v2';
const LOG_URL = 'http://api.ops.ghn.vn/als/v1';
const INSIDE_URL = 'http://api.insidev2.ghn.vn/sorting/v1';
export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/hms/static';
const ApiKey = 'TEST@APIKEY';
const ApiSecret = 'df6f564cGJRf9fGF6CPWJSqslvhaaaqqYafjfnQC3DfjQdbc47';


// const PDS_URL = 'http://api.uat.lastmile.ghn.vn/trip/v2';
// const ACC_URL = 'http://api.uat.lastmile.ghn.vn/acc/v1';
// const OSS_URL = 'http://api.uat.ops.ghn.vn/oss/v2';
// const LOG_URL = 'http://api.uat.ops.ghn.vn/als/v1';
// const INSIDE_URL = 'http://api.uat.insidev2.ghn.vn/sorting/v1';
// export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/hms/static';
// const ApiKey = 'TEST@APIKEY';
// const ApiSecret = 'df6f564cGJRf9fGF6CPWJSqslvhaaaqqYafjfnQC3DfjQdbc47';

// const PDS_URL = 'http://api.staging.lastmile.ghn.vn/trip/v2';
// const ACC_URL = 'http://api.staging.lastmile.ghn.vn/acc/v1';
// const OSS_URL = 'http://api.staging.ops.ghn.vn/oss/v2';
// const LOG_URL = 'http://api.staging.ops.ghn.vn/als/v1';
// const INSIDE_URL = 'http://api.staging.insidev2.ghn.vn/sorting/v1';
// export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/hms/static';
// const ApiKey = 'TEST@APIKEY';
// const ApiSecret = 'df6f564cGJRf9fGF6C9cLRyzjp8mpYafjfnQC3DfjQdbc47';


// const PDS_URL = 'http://api.dev.lastmile.ghn.vn/trip/v2';
// const ACC_URL = 'http://api.dev.lastmile.ghn.vn/acc/v1';
// const OSS_URL = 'http://api.staging.ops.ghn.vn/oss/v2';
// const LOG_URL = 'http://api.staging.ops.ghn.vn/als/v1';
// const INSIDE_URL = 'http://api.insidev2.ghn.vn/sorting/v1';
// export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/hms/static';
// const ApiKey = 'TEST@APIKEY';
// const ApiSecret = 'df6f564cGJRf9fGF6C9cLRyzjp8mpYafjfnQC3DfjQdbc47';


const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePdsInfo = (tripUserId) => {
  const URL = `${PDS_URL}/trip`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: { q: { driverId: tripUserId, status: 'ON_TRIP' } },
    timeout,
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
  const URL = `${PDS_URL}/mpds/order`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    params: {
      offset, limit, lastUpdatedTime, q: { tripCode, senderHubId },
    },
    timeout,
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

export const DoAction = (tripCode, OrderInfos) => {
  const URL = `${PDS_URL}/item`;
  const params = {
    tripCode,
    orders: OrderInfos,
  };
  const { LoginHeader } = Share;
  const config = { headers: LoginHeader, timeout };

  if (mockOn) {
    mock.onPut(URL, params, config).reply(200, updateStatusResponse);
  }

  return axios.put(URL, params, config);
};


export const updateOrderStatus = (tripCode, OrderInfos) => {
  return fromPromise(DoAction(tripCode, OrderInfos));
};

export const UpdateOrderWeightRDC = (params) => {  
  // const { length, width, height, weight, orderCode, tripCode, reason } = params;
  const URL = `${PDS_URL}/order/dimension`;
  const { LoginHeader } = Share;
  // { ...LoginHeader, 'x-hubid': 'PhoYenTN', 'x-warehouseid': 1323 }
  const config = { headers: LoginHeader, timeout };
  return axios.put(URL, params, config);
};

export const updateOrderWeightRDC = (params) => {
  return fromPromise(UpdateOrderWeightRDC(params));
};

export const Authenticate = (userid, password) => {
  const URL = `${ACC_URL}/pdaLogin`;
  const params = {
    userid,
    password,
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

export const LoginT62 = (t62) => {
  const URL = `${ACC_URL}/login-t62?t62=${t62}`;
  const config = {
    headers: {
      'X-ApiKey': ApiKey,
      'X-ApiSecret': ApiSecret,
    },
    timeout,
  };
  if (mockOn) {
    mock.onGet(URL, config).reply(200, loginResponse);
  }

  return axios.get(URL, config);
};

export const loginT62 = (t62) => {
  return fromPromise(LoginT62(t62));  
};

export const GetUserPerformance = (UserID, from = null, to = null) => {
  const URL = `${PDS_URL}/performance/${UserID}`;
  const { LoginHeader } = Share;
  const config = {
    headers: LoginHeader,
    timeout,
    params: {
      q: { from, to },
    },
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, performanceResponse);
  }
  return axios.get(URL, config);
};

export const GetConfiguration = (configKey = null) => {
  const URL = `${PDS_URL}/pdaconfig`;
  const { LoginHeader } = Share;
  const config = {
    headers: LoginHeader,
    params: { configKey },
    timeout,
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, configResponse);
  }
  
  return axios.get(URL, config);
};
  
// export const CalculateServiceFee = (params) => {
//   const URL = `${PDS_URL}/fee`;
//   const LoginHeader = Share.LoginHeader;
//   const config = { headers: LoginHeader, timeout };
//   return axios.post(URL, params, config);
// };

export const GetOrderDetailInfo = (orderCode, type, tripCode) => {
  const URL = `${PDS_URL}/order/multi`;
  const LoginHeader = Share.LoginHeader;

  const params = {
    orders: [{
      orderCode, tripCode, type, objectType: ['ORDER_DETAIL'],
    }],
  };
  const config = {
    headers: LoginHeader,
    timeout,
  };

  if (mockOn) {
    mock.onPost(URL, params, config).reply(200, orderDetailResponse);
  }
  
  return axios.post(URL, params, config);
};

export const getOrderDetail = (orderCode, type, tripCode) => {
  return fromPromise(GetOrderDetailInfo(orderCode, type, tripCode));
};

export const GetOrderSortingCode = (orderCodes) => {
  const codeString = orderCodes.join();
  const URL = `${INSIDE_URL}/label/${codeString}`;
  const config = {
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, configResponse);
  }
  
  return axios.get(URL, config);
};

export const getOrderSortingCode = (orderCodes) => {
  return fromPromise(GetOrderSortingCode(orderCodes));
};

// {
// 	"orderCodes": [ "3DANFHXU" ]
// }
export const AddOrders = (orderCodes, tripCode) => {
  const URL = `${PDS_URL}/item`;
  const { LoginHeader } = Share;

  const config = {
    headers: LoginHeader,
    timeout,
  };
  const params = {
    tripCode,
    type: 'PICK',
    orderCodes,
    verifyOnly: false,
  };
  if (mockOn) {
    mock.onPost(URL, params, config).reply(200, addOrdersResponse);
  }

  return axios.post(URL, params, config);
};

export const addOrders = (orderCodes, tripCode) => {
  return fromPromise(AddOrders(orderCodes, tripCode));
};

export const GetOrderHistory = (orderCode) => {
  const URL = `${PDS_URL}/history/order/${orderCode}`;
  const { LoginHeader } = Share;

  const config = {
    headers: LoginHeader,
    timeout,
    params: { offset: 0, limit: 200, type: 'UPDATE_ITEM' },
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderHistoryResponse);
  }
  return axios.get(URL, config);
};

// const datas = {
// 	"userId": "210031",
// 	"userName": "Lê Tấn Thắng",
// 	"actionCode": "8001",
// 	"screenId": "11224",
// 	"status": "OK",
// 	"system": "LASTMILE",
// 	"executionTime": "0.23",
// 	"warehouseId": "1339",
// 	"errorMessage": ""
// }
export const SendLogs = (datas) => {
  const URL = `${LOG_URL}/log`;
  const params = datas;
  if (mockOn) {
    // mock.onPost(URL, params).reply(200, loginResponse);
  }

  return axios.post(URL, params);
};

export const GetNewOrders = (hubId, senderHubId) => {
  console.log(hubId, senderHubId);
  const URL = `${OSS_URL}/order`;
  const headers = {
    'X-ApiKey': '9697efabe8aaafff6d468ac5c22501fe',
    'X-ApiSecret': 'FJiumKDQgx0u9315G7500d8Rylpi0FGboGKjH5aFuhcI0Ds2',
  };
  const config = {
    headers,
    params: {
      hubId,
      offset: 0,
      limit: 100,
      q: {
        target: 'PICK', groupCode: senderHubId, groupType: 'CLIENT_HUB', phase: 'NEED_TO_ACT', status: 'READY_TO_PICK',
      },
    },
    timeout,
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, newOrdersResponse);
  }
  return axios.get(URL, config);
};

export const getNewOrders = (hubId, senderHubId) => {
  return fromPromise(GetNewOrders(hubId, senderHubId));
};
