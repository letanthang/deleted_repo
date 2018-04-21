
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';

import { LOGIN_USER, LOGOUT_USER } from '../actions/types';
import { loginUserSucess, loginUserFail, logoutUser } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

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

const logoutUserAlertEpic = action$ =>
  action$.ofType(LOGOUT_USER)
    .filter(action => action.payload.message !== undefined)
    .do(action => Utils.showToast(action.payload.message, 'warning'))
    .ignoreElements();
    

export default combineEpics(
  loginUserEpic,
  logoutUserAlertEpic
);
