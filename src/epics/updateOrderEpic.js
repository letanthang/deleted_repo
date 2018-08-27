
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { UPDATE_ORDER_STATUS_START, UPDATE_ORDER_STATUS, UPDATE_ORDER_STATUS_SUCCESS, UPDATE_ORDER_STATUS_FAIL, UPDATE_ORDER_STATUS_FIX } from '../actions/types';
import { updateOrderStatusSuccess, updateOrderStatusFail, pdListFetch, logoutUser } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';
// import Utils from '../libs/Utils';
export const limit = 14;
const delayTime = 735;
const updateOrderStartEpic = action$ =>
  action$.ofType(UPDATE_ORDER_STATUS_START)
    .map(action => action.payload)
    .mergeMap(({ OrderInfos }) => of({
      type: 'UPDATE_ORDER_STATUS',
      payload: { OrderInfos },
    }));

const fixProgressStatus = action$ =>
  action$.ofType(UPDATE_ORDER_STATUS_START)
    .map(action => action.payload)
    .delay(1000 * 60 * 3)
    .mergeMap(() => of({ type: UPDATE_ORDER_STATUS_FIX }));

const updateOrderMoreEpic = action$ =>
  action$.ofType(UPDATE_ORDER_STATUS)
    .map(action => action.payload)
    .filter(({ OrderInfos }) => OrderInfos.length > limit)
    .delay(delayTime)
    .mergeMap(({ OrderInfos }) => of({
      type: 'UPDATE_ORDER_STATUS',
      payload: { OrderInfos: OrderInfos.slice(limit, 10000) },
    }));

const updateOrderEpic = (action$, store) =>
  action$.ofType(UPDATE_ORDER_STATUS)
    .map(action => action.payload)
    .mergeMap(({ OrderInfos }) => {
      const { tripCode } = store.getState().pd;
      // filter
      // transform OrderInfos
      const filterInfos = OrderInfos.map((info) => {
        const { orderCode, nextDate, noteId, note, type, willSucceeded } = info;
        const nextRedoTime = Utils.getDateForNote(noteId, nextDate);
        return { orderCode, type, nextRedoTime, failCode: noteId, failNote: note, isSucceeded: willSucceeded };
      });
      return API.updateOrderStatus(tripCode, filterInfos.slice(0, limit))
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return updateOrderStatusSuccess(OrderInfos, response.data || []);
            case 'FORBIDDEN':
            case 'UNAUTHORIZED':
              return logoutUser('Phiên làm việc hết hạn. Hãy đăng nhập lại. ');
            default:
              if (response.message === 'Fail to call endpoint API.') {
                return updateOrderStatusSuccess(OrderInfos, [], true);
                // return { type: 'REQUEST_RELOAD' };
              }
              return updateOrderStatusFail(response.message, OrderInfos);
          }
        })
        .catch(error => of(updateOrderStatusFail(error.message, OrderInfos)))
    });

const reloadEpic = (action$, store) =>
  action$.ofType(UPDATE_ORDER_STATUS_SUCCESS)
    .map(action => action.payload)
    .filter(({ OrderInfos }) => (OrderInfos.length <= limit && store.getState().pd.requireReload))
    .do(() => Utils.showToast('Thao tác đã hoàn tất. Vui lòng chờ lấy dữ liệu từ server...', 'warning'))
    .delay(2300)
    .mergeMap(() => of(pdListFetch({ })));

const alertSuccessEpic = (action$, store) =>
  action$.ofType(UPDATE_ORDER_STATUS_SUCCESS)
    .map(action => action.payload)
    .filter(({ OrderInfos }) => (OrderInfos.length <= limit && store.getState().pd.requireReload === false))
    .do(() => Utils.showToast('Thao tác hoàn tất thành công!', 'success'))
    .ignoreElements();

const alertFailEpic = action$ =>
  action$.ofType(UPDATE_ORDER_STATUS_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Utils.showToast(`Không thể chuyển trạng thái ĐH ${error}`, 'danger'))
    .ignoreElements();

export default combineEpics(
  updateOrderStartEpic,
  fixProgressStatus,
  updateOrderMoreEpic,
  updateOrderEpic,
  reloadEpic,
  alertSuccessEpic,
  alertFailEpic,
);
