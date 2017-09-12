import { AsyncStorage } from 'react-native';
import { 
  USERID_CHANGED, PASSWORD_CHANGED, REMEMBER_ME_CHANGED, LOAD_SAVED_USER_PASS, LOGIN_USER,  
  LOGOUT_USER, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS 
} from './types.js';
import * as API from '../apis/MPDS';
import LocalGroup from '../libs/LocalGroup';

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

export const rememberMeChanged = () => {
  return {
    type: REMEMBER_ME_CHANGED
  };
};

async function loadLoginInfo(dispatch) {
  try {
    const loginInfo = await AsyncStorage.getItem('loginInfo');
    if (loginInfo !== null) {
      const payload = JSON.parse(loginInfo);
      dispatch({
        type: LOAD_SAVED_USER_PASS,
        payload
      });
    }
  } catch (error) {
    console.log('loadLoginInfo failed with error=');
    console.log(error);
  }
}

async function saveLoginInfo(data) {
  try {
    await AsyncStorage.setItem('loginInfo', JSON.stringify(data));
    
  } catch (error) {
    console.log('Fail to Persist usename & password!: ');
    console.log(error);
  }
}

export const loadSavedUserPass = () => {  
  return loadLoginInfo;
};

export const loginUser = ({ userID, password, rememberMe }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    API.Authenticate({ UserID: userID, Password: password })
      .then(response => {
        const json = response.data;
        loginUserSucess(dispatch, { UserID: userID, FullName: userID }, { userID, password, rememberMe });

        // if (json.code === 1) {
        //   loginUserSucess(dispatch, json.data, { userID, password, rememberMe });
        // } else {
        //   console.log('loginUser fail with response json =');
        //   console.log(json);
        //   loginUserFail(dispatch, json.data.ErrorMessage);
        // }
      })
      .catch(error => {
        console.log('loginUser fail with error =');
        console.log(error);
        loginUserFail(dispatch, error);
      });
  };
};

const loginUserSucess = (dispatch, user, { userID, password, rememberMe }) => {
  if (rememberMe) {
    saveLoginInfo({ userID, password, rememberMe });
  } else {
    saveLoginInfo({ userID: '', password: '', rememberMe: false });
  }
  
  LocalGroup.getLocalDB()
  .then(() => {
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: user
    });
  });
  
};

const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  });
};

export const logoutUser = () => {
  return({
    type: LOGOUT_USER
  });
}

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
