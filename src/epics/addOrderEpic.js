
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { PD_ADD_ORDER, PD_ADD_ORDER_SUCCESS, PD_ADD_ORDER_FAIL } from '../actions/types';
import { pdListFetch } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const addOrderEpic = (action$, store) =>
  action$.ofType(PD_ADD_ORDER)
    .map(action => action.payload)
    .mergeMap(({ order, senderHubId }) =>
      API.addOrders([order], store.getState().pd.tripCode)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_ADD_ORDER_SUCCESS,
                payload: { order, senderHubId }
              };
            default:
              return { type: PD_ADD_ORDER_FAIL, payload: { error: response.message || 'Đơn không hợp lệ' } };
          }
        })
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } }))
    );

const reloadEpic = action$ =>
  action$.ofType(PD_ADD_ORDER_SUCCESS)
    .map(action => action.payload)
    .do(({ order }) => Utils.showToast(`Thêm đơn hàng ${order.code} thành công`, 'success'))
    .delay(100)
    .mergeMap(({ senderHubId }) => of(pdListFetch({ senderHubId })));

const failEpic = action$ =>
  action$.ofType(PD_ADD_ORDER_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể thêm đơn ${error}`, 'danger'))
    .ignoreElements();

export default combineEpics(
  addOrderEpic,
  reloadEpic,
  failEpic,
);
