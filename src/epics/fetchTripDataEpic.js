import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


import { PD_FETCH_TRIP_INFO_SUCCESS } from '../actions/types';
import { fetchTripDataSuccess, fetchTripDataFail } from '../actions';
import * as API from '../apis/MPDS';

// export const fetchDataEpic = action$ => 
//   action$.ofType(PDLIST_FETCH)
//     .map(action => action.payload)
//     .mergeMap(() => )

const fetchTripsEpic = (action$, store) =>
  action$.ofType(PD_FETCH_TRIP_INFO_SUCCESS)
    .map(action => action.payload)
    .mergeMap((payload) =>
      API.fetchTrip(store.getState().pd.pdsCode, 0, 30)
        .map(({ data }) => {
          const response = data;
          // console.log(response);
          switch (response.status) {
            case 'OK':
              return fetchTripDataSuccess(response, payload.all);
            case 'NOT_FOUND':
              return fetchTripDataFail('SERVICE NOT FOUND');
            default:
              return fetchTripDataFail(response.message);
          }
        })
        .catch(error => of(fetchTripDataFail(error.message)))
    );

export default fetchTripsEpic;
