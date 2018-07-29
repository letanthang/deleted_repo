import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import * as Api from '../apis/MPDS';
import { updateOrderStatusSuccess, updateOrderStatusFail, logoutUser } from '../actions';
import { OTHER_GET_ORDER_HISTORY, OTHER_GET_ORDER_HISTORY_SUCCESS, OTHER_GET_ORDER_HISTORY_FAIL, UPDATE_ORDER_STATUS } from '../actions/types';

// worker Saga: will be fired on OTHER_GET_ORDER_HISTORY actions
function* getOrderHistory(action) {
  try {
    const response = yield call(Api.GetOrderHistory, action.payload.orderCode);
    const json = response.data;
    // console.log(json);
    if (json.status === 'OK') {
      const orderHistory = json.data.map(({ date, historyType, data, createdById, createdByName }) => ({ date, historyType, data, createdById, createdByName }));
      yield put({ type: OTHER_GET_ORDER_HISTORY_SUCCESS, payload: { [action.payload.orderCode]: orderHistory } });
    } else {
      yield put({ type: OTHER_GET_ORDER_HISTORY_FAIL, payload: { error: json.message } });  
    }
  } catch (error) {
    yield put({ type: OTHER_GET_ORDER_HISTORY_FAIL, payload: { error: error.message } });
  }
}

/*
  Starts getOrderHistory on each dispatched `OTHER_GET_ORDER_HISTORY` action.
  Allows concurrent getOrderHistory.
*/
function* mySaga() {
  yield takeEvery(OTHER_GET_ORDER_HISTORY, getOrderHistory);
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
