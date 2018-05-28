
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { LOGIN_USER, LOGOUT_USER, LOGIN_USER_SUCCESS } from '../actions/types';
import { loginUserSucess, loginUserFail, logoutUser, pdListFetch } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const loginUserEpic = action$ =>
  action$.ofType(LOGIN_USER)
    .map(action => action.payload)
    .mergeMap(({ t62 }) =>
      API.loginT62(t62)
        .map(({ data }) => {
          const response = data;
          //console.log(response);
          switch (response.status) {
            case 'OK':
              return loginUserSucess(response);
            case 'NOT_FOUND':
              return loginUserFail('SERVICE NOT FOUND');
            default:
              return loginUserFail(response.message);
          }
        })
        .catch(error => of(loginUserFail(error.message)))
    );

const logoutUserAlertEpic = action$ =>
  action$.ofType(LOGOUT_USER)
    .filter(action => action.payload.message !== undefined)
    .do(action => Utils.showToast(action.payload.message, 'warning'))
    .ignoreElements();

const autoReloadEpic = (action$, store) =>
  action$.ofType(LOGIN_USER_SUCCESS)
    .mergeMap(() => {
      const reset = store.getState().auth.userId !== store.getState().pd.userId;
      return of(pdListFetch({ all: reset, reset }));
    });
  
export default combineEpics(
  loginUserEpic,
  logoutUserAlertEpic,
  autoReloadEpic,
);
