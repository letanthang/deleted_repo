import axios from 'axios';
import { 
  OTHER_GET_CONFIGURATION, OTHER_CALCULATE_FEE, OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE,
  OTHER_GET_USER_PERFORMANCE_SUCCESS
} from './types';
import ShareVariables from '../libs/ShareVariables';
import * as API from '../apis/MPDS';

export const calculateServiceFee = ({ 
  Length, Width, Height, Weight, OrderID, ClientID, ServiceID, FromDistrictID, ToDistrictID 
}) => {
  return async dispatch => {
    const LoginInfo = new ShareVariables().getLoginInfo();
    console.log('LoginInfo = ');
    console.log(LoginInfo);
    const params = {
      ...LoginInfo,
      Length,
      Width,
      Height,
      Weight,
      OrderID,
      ClientID,
      ServiceID,
      FromDistrictID,
      ToDistrictID
    };
    console.log('Bat dau cal Fee, with params=');
    console.log(params);

    try {
      const response = await axios.post('https://test.ghn.vn/api/mpds/CaculateServiceFee', params);
      console.log('Hang ve: new Fee');
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_CALCULATE_FEE_SUCCESS,
          payload: json.data.ServiceFee
        });
      } else {
        console.log('calculateServiceFee failed, response data=');
        console.log(json);
      }
    } catch (error) {
      console.log('calculateServiceFee failed,error =');
      console.log(error);
    }
  };
};

export const getConfiguration = () => {
  return async dispatch => {
    const LoginInfo = new ShareVariables().getLoginInfo();
    const ConfigKey = ['alpha', 'timeExpire', 'maxWeight', 'minWeight', 'maxSize', 'minSize', 'minSize', 'initLoad', 'initLoadTrial', 'idsTrial', 'interval', 'fastestInterval', 'pushDataInterval', 'priority', 'smallestDisplacement', 'numberOfRecord', 'endTimeTracking', 'startTimeTracking'];
    const params = {
      ...LoginInfo,
      ConfigKey
    };
    console.log('Bat dau cal Fee, with params=');
    console.log(params);

    try {
      const response = await axios.post('https://test.ghn.vn/api/mpds/getConfiguration', params);
      console.log('Hang ve: new Fee');
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_CALCULATE_FEE_SUCCESS,
          payload: json.data.ServiceFee
        });
      } else {
        console.log('calculateServiceFee failed, response data=');
        console.log(json);
      }
    } catch (error) {
      console.log('Fail to getConfiguration with error =');
      console.log(error);
    }
  };
};

export const getUserPerformance = (UserID) => {
  return async dispatch => {
    dispatch({ type: OTHER_GET_USER_PERFORMANCE });

    try {
      const response = await API.GetUserPerformance(UserID);
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_GET_USER_PERFORMANCE_SUCCESS,
          payload: json.data
        });
      } else {
        console.log('getUserPerformance failed, response data=');
        console.log(json);
      }
    } catch (error) {
      console.log('getUserPerformance failed with error =');
      console.log(error);
    }
  };
};
