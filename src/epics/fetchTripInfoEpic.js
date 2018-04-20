import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


import { PDLIST_FETCH } from '../actions/types';
import { fetchTripInfoSuccess, fetchTripInfoFail, logoutUser, pdListFetchNoTrip } from '../actions';
import * as API from '../apis/MPDS';


const fetchTripInfoEpic = (action$, store) =>
  action$.ofType(PDLIST_FETCH)
    .map(action => action.payload)
    .mergeMap(() =>
      API.fetchTripInfo(store.getState().auth.userID)
        .map(({ response }) => {
          console.log(response);
          switch (response.status) {
            case 'OK':
              return fetchTripInfoSuccess(response);
            case 'NOT_FOUND': {
              if (response.message === 'Not found pds.') {
                return pdListFetchNoTrip();
              }
              return fetchTripInfoFail('SERVICE NOT FOUND');
            }
            case 'UNAUTHORIZED':
              return logoutUser('Phiên làm việc hết hạn. Hãy đăng nhập lại. ');
            default:
              return fetchTripInfoFail(response.message);
          }
        })
        .catch(error => of(fetchTripInfoFail(error.message)))
    );

export default fetchTripInfoEpic;
