import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/dom/ajax';

import ShareVariables from '../libs/ShareVariables';
import { infoResponse, loginResponse, addOrdersResponse, orderDetailResponse, ordersResponse, configResponse, orderHistoryResponse, performanceResponse, updateStatusResponse } from './mock';

// ---------turn on mock data----------
const mockOn = false;
const timeout = 20000;

// const DOMAIN = 'api.inhubv2.ghn.vn';
// const DOMAIN = 'api.staging.inhubv2.ghn.vn';
const PDS_URL = 'http://api.lastmile.ghn.vn/lastmile/v1';
const ACC_URL = 'http://api.lastmile.ghn.vn/account/v1';

// const PDS_URL = 'http://api.staging.lastmile.ghn.vn/lastmile/v1';
// const ACC_URL = 'http://api.staging.lastmile.ghn.vn/account/v1';

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
    PDSID,
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.put(URL, params, config);
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

export const GetUserPerformance = (UserID, from = null, to = null) => {
  const URL = `${PDS_URL}/performance/${UserID}`;
  const LoginHeader = Share.LoginHeader;
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
  const LoginHeader = Share.LoginHeader;
  const config = { 
    headers: LoginHeader,
    params: { configKey },
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
    params: { offset: 0, limit: 100, q: { code, historyType: 'UPDATE_TRIP_ACTION' } },
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, orderHistoryResponse);
  }
  return axios.get(URL, config);
};
