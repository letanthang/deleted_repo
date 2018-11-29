import _ from 'lodash';
import moment from 'moment';
// import accounting from 'accounting';

import { 
  CONFIG_GET_CONFIGURATION, CONFIG_GET_CONFIGURATION_SUCCESS,
  CONFIG_TOGGLE_LAYOUT
} from './types';
import * as API from '../apis/MPDS';

export const getConfiguration = () => {
  return async dispatch => {
    try {
      dispatch({ type: CONFIG_GET_CONFIGURATION });
      const response = await API.GetConfiguration();
      const json = response.data;
      if (json.status === 'OK') {
        dispatch({
          type: CONFIG_GET_CONFIGURATION_SUCCESS,
          payload: json.data[0]
        });
      } else {
        // console.log('getConfiguration failed, response data=');
        // console.log(json);
      }
    } catch (error) {
      // console.log('Fail to getConfiguration with error =');
      // console.log(error);
    }
  };
};

export const toggleLayout = () => {
  return { type: CONFIG_TOGGLE_LAYOUT };
};
