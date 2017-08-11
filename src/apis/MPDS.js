import axios from 'axios';
import ShareVariables from '../libs/ShareVariables';

const DOMAIN = 'https://test.ghn.vn/api';
const Share = new ShareVariables();
export const GetUserActivePds = () => {
  const URL = `${DOMAIN}/mpds/GetUserActivePds`;
  const LoginInfo = Share.getLoginInfo();
  console.log('GetUserActivePds: ABC');
  return axios.post(URL, {
      ...LoginInfo
    });
};

export const UpdatePickDeliverySession = ({ PDSID, OrderInfos }) => {
  const URL = `${DOMAIN}/mpds/UpdatePickDeliverySession`;
  const LoginInfo = Share.getLoginInfo();
  return axios.post(URL, {
      ...LoginInfo,
      PDSID,
      OrderInfos
    });
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
  const URL = `${DOMAIN}/mpds/Authenticate`;
  const BaseInfo = Share.BaseInfo;
  return axios.post(URL, {
      ...BaseInfo,
      UserID,
      Password
    });
};

