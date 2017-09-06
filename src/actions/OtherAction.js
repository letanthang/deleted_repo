import axios from 'axios';
import { 
  OTHER_GET_CONFIGURATION, OTHER_GET_CONFIGURATION_SUCCESS,
  OTHER_CALCULATE_FEE, OTHER_CALCULATE_FEE_SUCCESS,
  OTHER_GET_USER_PERFORMANCE,
  OTHER_GET_USER_PERFORMANCE_SUCCESS
} from './types';
import ShareVariables from '../libs/ShareVariables';
import * as API from '../apis/MPDS';

export const calculateServiceFee = ({ 
  Length, Width, Height, Weight, OrderID, ClientID, ServiceID, FromDistrictID, ToDistrictID 
}) => {
  return async dispatch => {
    dispatch({ type: OTHER_CALCULATE_FEE });
    const params = {
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
      const response = await API.CalculateServiceFee(params);
      console.log('Hang ve: new Fee');
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_CALCULATE_FEE_SUCCESS,
          payload: json.data[0]
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
    try {
      dispatch({ type: OTHER_GET_CONFIGURATION });
      const response = await API.getConfiguration();
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: OTHER_GET_CONFIGURATION_SUCCESS,
          payload: json.data[0]
        });
      } else {
        console.log('getConfiguration failed, response data=');
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
          payload: json.data[0]
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
