import axios from 'axios';
import { 
  OTHER_GET_CONFIGURATION, OTHER_CALCULATE_FEE, OTHER_CALCULATE_FEE_SUCCESS
} from './types';
import ShareVariables from '../libs/ShareVariables';

export const calculateServiceFee = ({ 
  Length, Width, Height, Weight, OrderID, ClientID, ServiceID, FromDistrictID, ToDistrictID 
}) => {
  return async dispatch => {
    try {
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
      const response = await axios.post('https://test.ghn.vn/api/mpds/CaculateServiceFee', params);
      console.log('Hang ve: new Fee');
      const json = response.data;
      if (json.code === 1) {
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
