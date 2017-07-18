import { 
  USERID_CHANGED, PASSWORD_CHANGED, LOGIN_USER, LOGIN_USER_FAIL, 
  LOGIN_USER_SUCCESS 
} from './types.js';

export const userIDChanged = (text) => {
  return {
    type: USERID_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ userID, password }) => {
  //console.log(`login user with userID: ${userID} & password: ${password}`);
  return (dispatch) => {
    console.log('prepare dispatch');
    dispatch({ type: LOGIN_USER });
    // fetch('https://test.ghn.vn/api/mpds/GetApiKey')
    //   .then((response) => {
    //     console.log(`get api key ok!${response}`);
    //     return fetch('https://test.ghn.vn/api/mpds/Authenticate', {
    //       method: 'POST',
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         UserID: userID,
    //         Password: password,
    //         ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
    //         ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
    //         VersionCode: 60
    //       })
    //     }); 
    //   })
    console.log('begin fetching......');
    fetch('https://test.ghn.vn/api/mpds/Authenticate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserID: userID,
        Password: password,
        ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
        ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
        VersionCode: 60
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('API login response!');
        console.log(responseJson);
        if (responseJson.code === 1) {
          loginUserSucess(dispatch, responseJson.data);
        } else {
          loginUserFail(dispatch, responseJson.data.ErrorMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const loginUserSucess = (dispatch, user) => {
  console.log('ActioN: loginUserSuccess called');
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

export const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  });
};
