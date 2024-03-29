import _ from 'lodash';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';
import { PD_FETCH_TRIP_INFO_SUCCESS, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, OTHER_SET_PROPS, PDLIST_NO_TRIP, PD_FETCH_TRIP_INFO_FAIL, PD_FETCH_LABEL_SUCCESS } from '../actions/types';
import { fetchTripDataSuccess, fetchTripDataFail, updateProgress, fetchSortingCodeSuccess, fetchSortingCodeFail } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

// export const fetchDataEpic = action$ => 
//   action$.ofType(PDLIST_FETCH)
//     .map(action => action.payload)
//     .mergeMap(() => )

const limitNum = 30;

const fetchTripsEpic = (action$, store) =>
  action$.ofType(PD_FETCH_TRIP_INFO_SUCCESS, PDLIST_NO_TRIP)
    .filter(({ type }) => type === PD_FETCH_TRIP_INFO_SUCCESS || store.getState().pd.tripCode)
    .map(action => action.payload)
    .mergeMap(({ all, senderHubId }) => {
      const lastUpdatedTime = all === true ? null : store.getState().pd.lastUpdatedTime;
      return API.fetchTrip(store.getState().pd.tripCode, 0, limitNum, lastUpdatedTime, senderHubId)
        .map(({ data }) => {
          const response = data;
          // console.log(response);
          
          switch (response.status) {
            case 'OK': {
              const total = response.total;
              const more = (total > limitNum);
              const totalPage = Math.ceil(total / limitNum);
              return fetchTripDataSuccess(response, all, senderHubId, 1, totalPage, more);
            }
              
            case 'NOT_FOUND':
              return fetchTripDataFail('Không có đơn hàng mới');
            default:
              return fetchTripDataFail(response.message);
          }
        })
        .catch(error => of(fetchTripDataFail(error.message)))
    });

    
const fetchTripsMoreEpic = (action$, store) =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .map(action => action.payload)
    .filter(payload => payload.more === true)
    .mergeMap(({ all, page, senderHubId }) => {
      const lastUpdatedTime = all === true ? null : store.getState().pd.lastUpdatedTime;
      return API.fetchTrip(store.getState().pd.tripCode, page * limitNum, limitNum, lastUpdatedTime, senderHubId)
        .map(({ data }) => {
          const response = data;
          const total = response.total;
          const totalPage = Math.ceil(total / limitNum);
          const more = (page + 1 < totalPage);
          
          switch (response.status) {
            case 'OK':
              return fetchTripDataSuccess(response, all, senderHubId, page + 1, totalPage, more);
            case 'NOT_FOUND':
              return fetchTripDataFail('SERVICE NOT FOUND');
            default:
              return fetchTripDataFail(response.message);
          }
        })
        .catch(error => of(fetchTripDataFail(error.message)));
    });

    const fetchOrderDistrictEncode =(action$, store)=>
      action$.ofType(PDLIST_FETCH_SUCCESS,PDLIST_NO_TRIP)
      .fitler(action => (action.type == PDLIST_FETCH_SUCCESS && action.payload.more === false) || (action.type == PDLIST_NO_TRIP))
      .mergeMap( action=> {
        if (!store.getState().pd.pdsItems) {
          return of(fetchSortingCodeFail('Không có đơn'));
        }
        let orderPicked =  _filter(store.getState.pd.pdsItems, o=> o.type === 'PICK' && o.status === 'Picked' && o.isSuccess && o.receiverDistrictCode && o.receiverDistrictCode.length >0 );
        if(orderPicked.length == 0){
          return of(fetchOrderDistrictEncodeFail('Không có đơn'));
        }
        // let orderGetDistricts =
        return API.get
      })
    

const fetchOrderSortingCode = (action$, store) =>
  action$.ofType(PDLIST_FETCH_SUCCESS, PDLIST_NO_TRIP, PD_FETCH_LABEL_SUCCESS)
    // .filter(() => false)
    .filter(action => (action.type === PDLIST_FETCH_SUCCESS && action.payload.more === false) || (action.type === PD_FETCH_LABEL_SUCCESS) || (action.type === PDLIST_NO_TRIP))
    .mergeMap((action) => {
      // console.log(action.type, action.payload.more);
      const callNum = action.payload.callNum || 0;
      if (callNum > 50) {
        console.log("fetchOrderSortingCode => vuot qua so lan goi cho phep")
        return of(fetchSortingCodeFail('Vươt quá số lần gọi cho phép'));
      }
      if (!store.getState().pd.pdsItems) {
        console.log("fetchOrderSortingCode => khong co don")
        return of(fetchSortingCodeFail('Không có đơn'));
      }

      let sortingOrders = _.filter(store.getState().pd.pdsItems, o => o.type === 'PICK' && !o.label);
      sortingOrders = sortingOrders.slice(0, 100);
      if (sortingOrders.length === 0) {
        console.log("fetchOrderSortingCode => da co ma sorting")
        return of(fetchSortingCodeFail('Đã có mã sorting'));
      }

      const orderCodes = sortingOrders.map(o => o.orderCode);

      return API.getOrderSortingCode(orderCodes)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return fetchSortingCodeSuccess(response, orderCodes, callNum + 1);
            case 'NOT_FOUND':
              return fetchSortingCodeFail('SERVICE NOT FOUND');
            default:
              return fetchSortingCodeFail(response.message);
          }
        })
        .catch(error => of(fetchSortingCodeFail(error.message)));
    });

const fetchProgressEpic = action$ =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .map(action => action.payload)
    .mergeMap(({ page, totalPage }) =>
      of(updateProgress(page / totalPage, true)));


const fetchProgressResetEpic = action$ =>
  action$.ofType(OTHER_SET_PROPS)
    .map(action => action.payload)
    .filter(payload => payload.progress === 1)
    .delay(900)
    .mergeMap(() =>
      of(updateProgress(0, false)));

const fetchAlertEpic = action$ =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .filter(action => action.payload.more === false)
    .do(() => Utils.showToast('Cập nhật chuyến đi thành công.', 'success'))
    .ignoreElements();

const fetchAlertFailEpic = action$ =>
  action$
    .filter(action => action.type === PDLIST_FETCH_FAIL || action.type === PD_FETCH_TRIP_INFO_FAIL || action.type === PDLIST_NO_TRIP)
    .do(action => Utils.showToast(action.payload.error, 'warning'))
    .ignoreElements();

export default combineEpics(
  fetchTripsEpic,
  fetchTripsMoreEpic,
  fetchOrderSortingCode,
  fetchProgressEpic,
  fetchProgressResetEpic,
  fetchAlertEpic,
  fetchAlertFailEpic,
);
