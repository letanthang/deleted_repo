import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import * as Api from '../apis/MPDS';
import { updateOrderStatusSuccess, updateOrderStatusFail, logoutUser } from '../actions';
import { OTHER_GET_ORDER_HISTORY, OTHER_GET_ORDER_HISTORY_SUCCESS, OTHER_GET_ORDER_HISTORY_FAIL, UPDATE_ORDER_STATUS } from '../actions/types';

// worker Saga: will be fired on OTHER_GET_ORDER_HISTORY actions
function* getOrderHistory(action) {
   try {
      const response = yield call(Api.GetOrderHistory, action.payload.code);
      const json = response.data;
      console.log(json);
      if (json.status === 'OK') {
        const orderHistory = json.data.map(({ date, userName, description }) => ({ date, userName, description }));
        yield put({ type: OTHER_GET_ORDER_HISTORY_SUCCESS, payload: { [action.payload.code]: orderHistory } });
      } else {
        yield put({ type: OTHER_GET_ORDER_HISTORY_FAIL, payload: { error: json.message } });  
      }
   } catch (error) {
      yield put({ type: OTHER_GET_ORDER_HISTORY_FAIL, payload: { error: error.message } });
   }
}

// worker Saga: will be fired on UPDATE_ORDER_STATUS actions
function* updateOrderStatus(act) {
  const OrderInfos = act.payload.OrderInfos;
  try {
    const state = yield select();
    const { tripCode } = state.pd;
    //filter 
    //transform OrderInfos
    const filterInfos = OrderInfos.map(info => {
      const { code, nextDate, noteId, note, action } = info;
      return { code, tripCode, nextRedoTime: nextDate, failCode: noteId, failNote: note, action };
    });

    const response = yield call(Api.DoAction, filterInfos);
    const json = response.data;
    if (json.status === 'OK') {
      yield put(updateOrderStatusSuccess(OrderInfos, json.data[0].listFail));
    } else if (json.status === 'NOT_FOUND' && json.message === 'Permission denied, no User is found.') {
      yield put(updateOrderStatusFail('Phiên làm việc hết hạn. Vui lòng đăng nhập.', OrderInfos, false));
      yield put(logoutUser());
    } else if (json.status === 'UNAUTHORIZED') {
      yield put(updateOrderStatusFail('Phiên làm việc hết hạn. Vui lòng đăng nhập.', OrderInfos, false));
      yield put(logoutUser());
    } else {
      yield put(updateOrderStatusFail(json.message, OrderInfos));  
    }
  } catch (error) {
    yield put(updateOrderStatusFail(error.message, OrderInfos));  
  }
}

/*
  Starts getOrderHistory on each dispatched `OTHER_GET_ORDER_HISTORY` action.
  Allows concurrent getOrderHistory.
*/
function* mySaga() {
  yield takeEvery(OTHER_GET_ORDER_HISTORY, getOrderHistory);
  yield takeEvery(UPDATE_ORDER_STATUS, updateOrderStatus);
}
/*
  Alternatively you may use takeLatest.

  Does not allow concurrent getOrderHistory. If "OTHER_GET_ORDER_HISTORY" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
// function* mySaga() {
//   yield takeLatest(OTHER_GET_ORDER_HISTORY, getOrderHistory);
// }

export default mySaga;
