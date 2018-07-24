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
export const live = false;
export const appVersionName = '24/07';

// const PDS_URL = 'http://api.lastmile.ghn.vn/lastmile/v1';
// const ACC_URL = 'http://api.lastmile.ghn.vn/account/v1';
// const OSS_URL = 'http://api.ops.ghn.vn/oss/v2';
// const LOG_URL = 'http://api.ops.ghn.vn/als/v1';
// const INSIDE_URL = 'http://api.insidev2.ghn.vn/sorting/v1';
// export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/sso-login';

const PDS_URL = 'http://api.staging.lastmile.ghn.vn/lastmile/v1';
const ACC_URL = 'http://api.staging.lastmile.ghn.vn/acc/v1';
const OSS_URL = 'http://api.staging.ops.ghn.vn/oss/v2';
const LOG_URL = 'http://api.staging.ops.ghn.vn/als/v1';
const INSIDE_URL = 'http://api.insidev2.ghn.vn/sorting/v1';
export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/sso-login';

// const PDS_URL = 'http://api.dev.lastmile.ghn.vn/lastmile/v1';
// const ACC_URL = 'http://api.dev.lastmile.ghn.vn/acc/v1';
// const OSS_URL = 'http://api.staging.ops.ghn.vn/oss/v2';
// const LOG_URL = 'http://api.staging.ops.ghn.vn/als/v1';
// const INSIDE_URL = 'http://api.insidev2.ghn.vn/sorting/v1';
// export const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://lastmile.ghn.vn/sso-login';

const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePdsInfo = (tripUserId) => {
  const URL = `${PDS_URL}/trip/search`;
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
  const URL = `${PDS_URL}/order/pda-search`;
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

export const DoAction = (OrderInfos) => {
  const URL = `${PDS_URL}/order/action`;
  const params = {
    orders: OrderInfos,
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader, timeout };

  if (mockOn) {
    mock.onPut(URL, params, config).reply(200, updateStatusResponse);
  }

  return axios.put(URL, params, config);
};


export const updateOrderStatus = (OrderInfos) => {
  return fromPromise(DoAction(OrderInfos));
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
      'X-ApiKey': 'TEST@APIKEY',
      'X-ApiSecret': 'df6f564cGJRf9fGF6C9cLRyzjp8mpYafjfnQC3DfjQdbc47'
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

export const GetOrderDetailInfo = (code, type, tripCode) => {
  const URL = `${PDS_URL}/order/multi`;
  const LoginHeader = Share.LoginHeader;

  const params = {
    orders: [{
      code, tripCode, type, objectType: ['ORDER_DETAIL'],
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

export const getOrderDetail = (code, type, tripCode) => {
  return fromPromise(GetOrderDetailInfo(code, type, tripCode));
};

export const GetOrderLabel = (code) => {
  const URL = `${INSIDE_URL}/label/${code}`;
  const config = {
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, configResponse);
  }
  
  return axios.get(URL, config);
};

export const getOrderLabel = (code) => {
  return fromPromise(GetOrderLabel(code));
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
    orders,
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
    params: { offset: 0, limit: 200, q: { code, historyType: 'UPDATE_TRIP_ACTION' } },
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
  const headers = { 'API-KEY': '9697efabe8aaafff6d468ac5c22501fe', 'API-SECRET': 'FJiumKDQgx0u9315G7500d8Rylpi0FGboGKjH5aFuhcI0Ds2' };
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
