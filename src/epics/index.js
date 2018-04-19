import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


import { PDLIST_FETCH, LOGIN_USER } from '../actions/types';
import { loginUserSucess, loginUserFail } from '../actions';
import * as API from '../apis/MPDS';

// export const fetchDataEpic = action$ => 
//   action$.ofType(PDLIST_FETCH)
//     .map(action => action.payload)
//     .mergeMap(() => )

const loginUserEpic = action$ =>
  action$.ofType(LOGIN_USER)
    .map(action => action.payload)
    .mergeMap(({ userid, password, rememberMe }) =>
      API.LoginUser(userid, password)
        .map(({ response }) => {
          console.log(response);
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

export default loginUserEpic;
