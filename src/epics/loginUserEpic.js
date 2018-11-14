
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { LOGIN_USER, LOGIN_USERT62, LOGOUT_USER, LOGIN_USER_SUCCESS, AUTO_LOGIN_SUCCESS } from '../actions/types';
import { loginUserSucess, loginUserFail, logoutUser, pdListFetch } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';
import { Observable } from 'rxjs';

const loginUserEpic = action$ =>
  action$.ofType(LOGIN_USER)
    .map(action => action.payload)
    .mergeMap(({ userid, password, rememberMe }) =>
      API.loginUser(userid, password)
        .map(({ data }) => {
          const response = data;
          //console.log(response);
          switch (response.status) {
            case 'OK':
              return loginUserSucess(response, rememberMe);
            case 'NOT_FOUND':
              return loginUserFail('SERVICE NOT FOUND');
            default:
              return loginUserFail(response.message);
          }
        })
        .catch(error => of(loginUserFail(error.message)))
    );

const loginUserT62Epic = action$ =>
  action$.ofType(LOGIN_USERT62)
    .map(action => action.payload)
    .mergeMap(({ t62 }) =>
      API.loginT62(t62)
        .map(({ data }) => {
          const response = data;
          // console.log(response);
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

const autoReloadIntervalEpic = action$ =>
  action$.ofType('FE_CRON')
    .mergeMap(() => {
      return of(pdListFetch({}));
    });

const cronEpic = action$ =>
  action$.ofType(LOGIN_USER_SUCCESS, AUTO_LOGIN_SUCCESS)
    .switchMap(() =>
      Observable.interval(1000 * 60 * 15)
        .takeUntil(action$.ofType(LOGOUT_USER))
        .mapTo({ type: 'FE_CRON' }));

export default combineEpics(
  loginUserEpic,
  loginUserT62Epic,
  logoutUserAlertEpic,
  autoReloadEpic,
  autoReloadIntervalEpic,
  cronEpic,
);
