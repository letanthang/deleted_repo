
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { PD_ADD_ORDER, PD_ADD_ORDER_SUCCESS, PD_ADD_ORDER_FAIL, PD_GET_NEW_ORDERS, PD_GET_NEW_ORDERS_SUCCESS, PD_GET_NEW_ORDERS_FAIL, PD_GET_NEW_ORDERS_EMPTY, PD_ADD_ORDERS } from '../actions/types';
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
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } })));

const reloadEpic = action$ =>
  action$.ofType(PD_ADD_ORDER_SUCCESS)
    .map(action => action.payload)
    .filter(({ order, orders }) => order || orders.length <= limit)
    .do(({ order }) => {
      if (order) {
        Utils.showToast(`Thêm đơn hàng ${order.code} thành công`, 'success');
      } else {
        Utils.showToast(`Thêm đơn hàng mới thành công`, 'success');
      }
    })
    .delay(500)
    .mergeMap(() => of(pdListFetch({})));

const failEpic = action$ =>
  action$.ofType(PD_ADD_ORDER_FAIL, PD_GET_NEW_ORDERS_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể thêm đơn ${error}`, 'danger'))
    .ignoreElements();

const warnEpic = action$ =>
  action$.ofType(PD_GET_NEW_ORDERS_EMPTY)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể thêm đơn ${error}`, 'warning'))
    .ignoreElements();    

const getNewOrdersForAddEpic = (action$, store) =>
  action$.ofType(PD_GET_NEW_ORDERS)
    .map(action => action.payload)
    .mergeMap(({ senderHubId }) =>
      API.getNewOrders(store.getState().auth.warehouseIds[0], senderHubId)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK': {
              if (response.data.length > 0) {
                // return addMultiOrders(response, senderHubId);
                return { type: PD_GET_NEW_ORDERS_SUCCESS, payload: { response, senderHubId } };
              }
              return { type: PD_GET_NEW_ORDERS_EMPTY, payload: { error: 'Shop chưa lên đơn mới' } };
            }
            case 'NOT_FOUND':
              return { type: PD_GET_NEW_ORDERS_EMPTY, payload: { error: 'Shop chưa lên đơn mới' } };
            default:
              return { type: PD_GET_NEW_ORDERS_FAIL, payload: { error: response.message || 'Không thể lấy đơn mới' } };
          }
        })
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } })));

const hasNewOrdersEpic = action$ =>
  action$.ofType(PD_GET_NEW_ORDERS_SUCCESS)
    .map(action => action.payload)
    .do(({ response }) => Utils.showToast(`Shop có ${response.data.length} đơn mới sẽ được thêm vào chuyến đi`, 'success'))
    .delay(580)
    .mergeMap(({ response, senderHubId }) => of(addMultiOrders(response, senderHubId)));

const addMultiOrdersEpic = (action$, store) =>
  action$.ofType(PD_ADD_ORDERS)
    .map(action => action.payload)
    .mergeMap(({ orders, senderHubId }) =>
      API.addOrders(orders.slice(0, limit), store.getState().pd.tripCode)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_ADD_ORDER_SUCCESS,
                payload: { orders, senderHubId },
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
    .mergeMap(({ orders, senderHubId }) => of({
      type: 'PD_ADD_ORDERS',
      payload: { orders: orders.slice(limit, 10000), senderHubId },
    }));
export default combineEpics(
  addOrderEpic,
  reloadEpic,
  failEpic,
  warnEpic,
  getNewOrdersForAddEpic,
  hasNewOrdersEpic,
  addMultiOrdersEpic,
  addOrdersMoreEpic,
);
