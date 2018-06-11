
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { PD_UPDATE_WEIGHT_SIZE, PD_UPDATE_WEIGHT_SIZE_SUCCESS, PD_UPDATE_WEIGHT_SIZE_FAIL } from '../actions/types';
import { } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const updateWeightSizeEpic = action$ =>
  action$.ofType(PD_UPDATE_WEIGHT_SIZE)
    .map(action => action.payload)
    .mergeMap((params) => {
      const { length, width, height, weight, orderCode } = params;
      return API.updateOrderWeightRDC(params)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_UPDATE_WEIGHT_SIZE_SUCCESS,
                payload: { code: orderCode, length, width, height, weight }
              };
            default:
              return { type: PD_UPDATE_WEIGHT_SIZE_FAIL, payload: { error: response.message } };
          }
        })
        .catch(error => of({ type: PD_UPDATE_WEIGHT_SIZE_FAIL, payload: { error: error.message } }))
    });

const failEpic = action$ =>
  action$.ofType(PD_UPDATE_WEIGHT_SIZE_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể cập nhật kích thước. ${error}`, 'danger'))
    .ignoreElements();

const successEpic = action$ =>
  action$.ofType(PD_UPDATE_WEIGHT_SIZE_SUCCESS)
    .map(action => action.payload)
    .do(() => Utils.showToast('Cập nhật kích thước thành công', 'success'))
    .ignoreElements();

export default combineEpics(
  updateWeightSizeEpic,
  failEpic,
  successEpic,
);
