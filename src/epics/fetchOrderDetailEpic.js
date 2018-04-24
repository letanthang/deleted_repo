import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


import { PD_FETCH_DETAIL } from '../actions/types';
import { fetchOrderDetailSuccess, fetchOrderDetailFail } from '../actions';
import * as API from '../apis/MPDS';


const fetchOrderDetailEpic = (action$, store) =>
  action$.ofType(PD_FETCH_DETAIL)
    .map(action => action.payload)
    .mergeMap(({ code, type }) =>
      API.getOrderDetail(code, type, store.getState().pd.tripCode)
        .map(({ data }) => {
          const response = data;
          //console.log(response);
          switch (response.status) {
            case 'OK':
              return fetchOrderDetailSuccess(response, code, type);
            case 'NOT_FOUND': {
              return fetchOrderDetailFail('SERVICE NOT FOUND');
            }
            default:
              return fetchOrderDetailFail(response.message);
          }
        })
        .catch(error => of(fetchOrderDetailFail(error.message)))
    );

export default fetchOrderDetailEpic;
