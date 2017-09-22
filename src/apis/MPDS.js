import axios from 'axios';
import ShareVariables from '../libs/ShareVariables';

//const DOMAIN = 'api.inhubv2.ghn.vn';
const DOMAIN = 'api.staging.inhubv2.ghn.vn';
// const DOMAIN = 'api.inhub-ghn.tk';
const BASE_URL = `http://${DOMAIN}`;

const Share = new ShareVariables();
export const GetUserActivePds = (UserID) => {
  const URL = `${BASE_URL}/pdaone/${UserID}`;
  const LoginHeader = Share.LoginHeader;
  console.log(`GetUserActivePds: ${URL}`);
  return axios.get(URL, {
      headers: LoginHeader
    });
};

export const UpdatePickDeliverySession = ({ PDSID, OrderInfos }) => {
  const URL = `${BASE_URL}/pdaone/${PDSID}`;
  const params = {
    PDSID,
    OrderInfos
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  console.log(`UpdatePickDeliverySession url = ${URL}`);
  console.log(params);
  return axios.put(URL, params, config);
};

export const UpdateOrderWeightRDC = ({ 
  Length,
  Width,
  Height,
  Weight,
  ClientID,
  OrderID,
  PDSID }) => {  
  const URL = `${BASE_URL}/fee`;
  const LoginInfo = Share.getLoginInfo();
  console.log(URL);
  const params = {
    ...LoginInfo,
    Length,
    Width,
    Height,
    Weight,
    ClientID,
    OrderID,
    PDSID
  };
  console.log(params);
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.put(URL, params, config);
};

export const Authenticate = ({ UserID, Password }) => {
  const URL = `${BASE_URL}/acc/pdaLogin`;
  return axios.post(URL, {
      userid: UserID,
      password: Password
    });
};

export const GetUserPerformance = (UserID) => {
  const URL = `${BASE_URL}/mpds/GetUserPerformance`;
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.post(URL, {
      UserID
    }, config);
};

export const GetConfiguration = (configKey = null) => {
  const URL = `${BASE_URL}/pdaconfig`;
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.get(URL, { configKey }, config);
};
  
export const CalculateServiceFee = (params) => {
  console.log(params);
  const URL = `${BASE_URL}/fee`;
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.post(URL, params, config);
};
