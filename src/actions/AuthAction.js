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
  console.log(`login user with userID: ${userID} & password: ${password}`);
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
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
        if (responseJson.code === 1) {
          loginUserSucess(dispatch, responseJson.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export const loginUserSucess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

export const loginUserFail = (dispatch) => {
  dispatch({
    type: LOGIN_USER_FAIL
  });
};
