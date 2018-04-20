import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';
import { PD_FETCH_TRIP_INFO_SUCCESS, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, OTHER_SET_PROPS, PDLIST_NO_TRIP } from '../actions/types';
import { fetchTripDataSuccess, fetchTripDataFail, updateProgress } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

// export const fetchDataEpic = action$ => 
//   action$.ofType(PDLIST_FETCH)
//     .map(action => action.payload)
//     .mergeMap(() => )

const limitNum = 30;

const fetchTripsEpic = (action$, store) =>
  action$.ofType(PD_FETCH_TRIP_INFO_SUCCESS)
    .map(action => action.payload)
    .mergeMap((payload) =>
      API.fetchTrip(store.getState().pd.pdsCode, 0, limitNum)
        .map(({ data }) => {
          const response = data;
          // console.log(response);
          
          switch (response.status) {
            case 'OK': {
              const total = response.total;
              const more = (total > limitNum);
              const totalPage = Math.ceil(total / limitNum);
              return fetchTripDataSuccess(response, payload.all, 1, totalPage, more);
            }
              
            case 'NOT_FOUND':
              return fetchTripDataFail('SERVICE NOT FOUND');
            default:
              return fetchTripDataFail(response.message);
          }
        })
        .catch(error => of(fetchTripDataFail(error.message)))
    );

    
const fetchTripsMoreEpic = (action$, store) =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .map(action => action.payload)
    .filter(payload => payload.more === true)
    .mergeMap((payload) => {
      const page = payload.page + 1;
      return API.fetchTrip(store.getState().pd.pdsCode, (page - 1) * limitNum, limitNum)
        .map(({ data }) => {
          const response = data;
          const total = response.total;
          const totalPage = Math.ceil(total / limitNum);
          const more = (page < totalPage);
          
          switch (response.status) {
            case 'OK':
              return fetchTripDataSuccess(response, payload.all, page, totalPage, more);
            case 'NOT_FOUND':
              return fetchTripDataFail('SERVICE NOT FOUND');
            default:
              return fetchTripDataFail(response.message);
          }
        })
        .catch(error => of(fetchTripDataFail(error.message)));
    });

const fetchProgressEpic = (action$) =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .map(action => action.payload)
    .mergeMap(({ page, totalPage }) =>
      of(updateProgress(page / totalPage, true)));


const fetchProgressResetEpic = (action$) =>
  action$.ofType(OTHER_SET_PROPS)
    .map(action => action.payload)
    .filter(payload => payload.progress === 1)
    .delay(900)
    .mergeMap(() =>
      of(updateProgress(0, false)));

const fetchAlertEpic = (action$) =>
  action$.ofType(PDLIST_FETCH_SUCCESS)
    .filter(action => action.payload.more === false)
    .do(() => Utils.showToast('Cập nhật chuyến đi thành công.', 'success'))
    .ignoreElements();

const fetchAlertFailEpic = (action$) =>
  action$
    .filter(action => action.type === PDLIST_FETCH_FAIL || action.type === PDLIST_NO_TRIP)
    .do((action) => Utils.showToast(action.payload.error, 'warning'))
    .ignoreElements();

export default combineEpics(
  fetchTripsEpic,
  fetchTripsMoreEpic,
  fetchProgressEpic,
  fetchProgressResetEpic,
  fetchAlertEpic,
  fetchAlertFailEpic
);
