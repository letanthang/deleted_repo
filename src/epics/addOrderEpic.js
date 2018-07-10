
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { PD_ADD_ORDER, PD_ADD_ORDER_SUCCESS, PD_ADD_ORDER_FAIL, PD_GET_NEW_ORDERS, PD_ADD_ORDERS } from '../actions/types';
import { pdListFetch, addMultiOrders } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const limit = 14;
const delayTime = 740;

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
                payload: { order, senderHubId },
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
    .delay(500)
    .mergeMap(() => of(pdListFetch({})));

const failEpic = action$ =>
  action$.ofType(PD_ADD_ORDER_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể thêm đơn ${error}`, 'danger'))
    .ignoreElements();

const getNewOrdersForAddEpic = (action$, store) =>
  action$.ofType(PD_GET_NEW_ORDERS)
    .map(action => action.payload)
    .mergeMap(({ senderHubId }) =>
      API.getNewOrders(store.getState().auth.warehouseIds[0], senderHubId)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return addMultiOrders(response, senderHubId);
            default:
              return { type: PD_ADD_ORDER_FAIL, payload: { error: response.message || 'Đơn không hợp lệ' } };
          }
        })
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } })));

const addMultiOrdersEpic = (action$, store) =>
  action$.ofType(PD_ADD_ORDER)
    .map(action => action.payload)
    .mergeMap(({ orders, senderHubId }) =>
      API.addOrders(orders.slice(0, limit), store.getState().pd.tripCode)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_ADD_ORDER_SUCCESS,
                payload: { orders: orders.slice(0, limit), senderHubId },
              };
            default:
              return { type: PD_ADD_ORDER_FAIL, payload: { error: response.message || 'Đơn không hợp lệ' } };
          }
        })
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } })));

const addOrdersMoreEpic = action$ =>
  action$.ofType(PD_ADD_ORDERS)
    .map(action => action.payload)
    .filter(({ orders }) => orders.length > limit)
    .delay(delayTime)
    .mergeMap(({ orders, senderHubId }) => ({
      type: 'PD_ADD_ORDERS',
      payload: { orders: orders.slice(limit, 10000), senderHubId },
    }));
export default combineEpics(
  addOrderEpic,
  reloadEpic,
  failEpic,
  getNewOrdersForAddEpic,
  addMultiOrdersEpic,
  addOrdersMoreEpic,
);
