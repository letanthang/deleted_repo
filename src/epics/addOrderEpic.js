
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { PD_ADD_ORDER, PD_ADD_ORDER_SUCCESS, PD_ADD_ORDER_FAIL } from '../actions/types';
import { } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

export const addOrderEpic = (action$, store) =>
  action$.ofType(PD_ADD_ORDER)
    .map(action => action.payload)
    .mergeMap(({ order }) =>
      API.addOrders([order], store.getState().pd.tripCode)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return {
                type: PD_ADD_ORDER_SUCCESS,
                payload: { order }
              };
            default:
              return { type: PD_ADD_ORDER_FAIL, payload: { error: response.message } };
          }
        }) 
        .catch(error => of({ type: PD_ADD_ORDER_FAIL, payload: { error: error.message } }))
    );
    

// export default combineEpics(
//   loginUserEpic,
//   logoutUserAlertEpic
// );
