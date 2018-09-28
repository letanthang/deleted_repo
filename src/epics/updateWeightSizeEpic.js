
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';
import { Alert } from 'react-native';
import { pdListFetch, getOrdersInfoSuccess } from '../actions';
import { PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL, PD_GET_ORDERS_INFO, PD_GET_ORDERS_INFO_FAIL, PD_GET_ORDERS_INFO_SUCCESS } from '../actions/types';
import { } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const getOrdersInfoEpic = action$ =>
  action$.ofType(PD_GET_ORDERS_INFO)
    .map(action => action.payload)
    .mergeMap(({ orderCodes }) => {
      return API.getOrdersInfo(orderCodes)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return getOrdersInfoSuccess(response);
            default:
              return { type: PD_GET_ORDERS_INFO_FAIL, payload: { error: response.message } };
          }
        })
        .catch(error => of({ type: PD_GET_ORDERS_INFO_FAIL, payload: { error: error.message } }))
    });

const updateWeightSizeEpic = action$ =>
  action$.ofType(PD_UPDATE_WEIGHT_SIZE)
    .map(action => action.payload)
    .mergeMap((params) => {
      const { length, width, height, weight, orderCode, tripCode, reason } = params;
      return API.updateOrderWeightRDC(params)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_UPDATE_WEIGHT_SIZE_SUCCESS,
                payload: { serviceCost: response.data[0].newCollectAmount, orderCode, length, width, height, weight, tripCode, reason }
              };
            default:
              return { type: PD_UPDATE_WEIGHT_SIZE_FAIL, payload: { error: response.message } };
          }
        })
        .catch(error => of({ type: PD_UPDATE_WEIGHT_SIZE_FAIL, payload: { error: error.message } }))
    });

// const failEpic = action$ =>
//   action$.ofType(PD_UPDATE_WEIGHT_SIZE_FAIL)
//     .map(action => action.payload)
//     .do(({ error }) => Alert.alert(
//       'Thông báo',
//       'Không thể cập nhật kích thước mới. ' + error,
//       [
        
//         { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
//       ],
//       { cancelable: false }
//     ))
//     .ignoreElements();

const successEpic = action$ =>
  action$.ofType(PD_UPDATE_WEIGHT_SIZE_SUCCESS)
    .map(action => action.payload)
    .do(() => Utils.showToast('Cập nhật kích thước thành công', 'success'))
    .delay(300)
    .mergeMap((() => of(pdListFetch({ off: true }))));

export default combineEpics(
  getOrdersInfoEpic,
  updateWeightSizeEpic,
  // failEpic,
  successEpic,
);
