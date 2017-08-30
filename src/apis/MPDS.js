import axios from 'axios';
import ShareVariables from '../libs/ShareVariables';

//const DOMAIN = 'http://dev.inhub.vn:4108/pdaone';
const DOMAIN = 'http://10.10.0.16:4108/pdaone';

const Share = new ShareVariables();
export const GetUserActivePds = (UserID) => {
  const UserID1 = 1017;
  const URL = `${DOMAIN}/${UserID1}`;
  const LoginInfo = Share.getLoginInfo();
  console.log(`GetUserActivePds: ${URL}`);
  return axios.get(URL, {
      ...LoginInfo
    });
};

export const UpdatePickDeliverySession = ({ PDSID, OrderInfos }) => {
  const URL = `${DOMAIN}/${PDSID}`;
  const LoginInfo = Share.getLoginInfo();
  const params = {
    ...LoginInfo,
    PDSID,
    OrderInfos
  };
  console.log(`UpdatePickDeliverySession url = ${URL}`);
  console.log(params);
  return axios.put(URL, params);
};

export const UpdateOrderWeightRDC = ({ 
  Length,
  Width,
  Height,
  Weight,
  ClientID,
  OrderID,
  PDSID }) => {  
  const URL = `${DOMAIN}/mpds/UpdateOrderWeightRDC`;
  const LoginInfo = Share.getLoginInfo();
  return axios.post(URL, {
      ...LoginInfo,
      Length,
      Width,
      Height,
      Weight,
      ClientID,
      OrderID,
      PDSID
    });
};

export const Authenticate = ({ UserID, Password }) => {
  const DOMAIN1 = 'https://test.ghn.vn/api';
  const URL = `${DOMAIN1}/mpds/Authenticate`;
  const BaseInfo = Share.BaseInfo;
  return axios.post(URL, {
      ...BaseInfo,
      UserID,
      Password
    });
};

export const GetUserPerformance = (UserID) => {
  const URL = `${DOMAIN}/mpds/GetUserPerformance`;
  const LoginInfo = Share.getLoginInfo();
  return axios.post(URL, {
      ...LoginInfo,
      UserID
    });
};
  
