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
    .mergeMap(({ all, senderHubId }) =>
      API.fetchTripInfo(store.getState().auth.userId)
        .map(({ data }) => {
          const response = data;
          // console.log("fetchTriupInfoEpic >> fecthTripInfo >> répons ",response);
          switch (response.status) {
            case 'OK':
              if (response.total === 0) {
                return pdListFetchNoTrip(all);
              }
              return fetchTripInfoSuccess(response, store.getState().auth.userId, all, senderHubId);
            case 'NOT_FOUND': {
              if (response.message == null) {
                return fetchTripInfoFail('SERVICE NOT FOUND');
              }
              return pdListFetchNoTrip(all);
            }
            case 'FORBIDDEN':
            case 'UNAUTHORIZED':
              return logoutUser('Phiên làm việc hết hạn. Hãy đăng nhập lại. ');
            default:
              return fetchTripInfoFail(response.message);
          }
        })
        .catch(error => of(fetchTripInfoFail(error.message)))
    );

export default fetchTripInfoEpic;
