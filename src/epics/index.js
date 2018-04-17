import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

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
        .map(res => {
          const response = res.response;
          console.log(response);
          if (response.status === 'OK') {
            const { userInfo, session } = response.data;
            return loginUserSucess(userInfo, session, rememberMe);
          }
          return loginUserFail(response.message);
        })
    );

export default loginUserEpic;
