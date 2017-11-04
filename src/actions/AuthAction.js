import { AsyncStorage } from 'react-native';
import { 
  USERID_CHANGED, PASSWORD_CHANGED, REMEMBER_ME_CHANGED, LOAD_SAVED_USER_PASS, LOAD_SAVED_SESSION, LOGIN_USER,  
  LOGOUT_USER, LOGOUT, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS, GO_SUPPORT 
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






async function loadSession(dispatch) {
  try {
    const loginInfo = await AsyncStorage.getItem('session');
    if (loginInfo !== null) {
      const payload = JSON.parse(loginInfo);
      dispatch({
        type: LOAD_SAVED_SESSION,
        payload
      });
    }
  } catch (error) {
    console.log('loadSession failed with error=');
    console.log(error);
  }
}

async function saveSession(data) {
  try {
    console.log('saveSession start!')
    await AsyncStorage.setItem('session', JSON.stringify(data));
    
  } catch (error) {
    console.log('Fail to session ');
    console.log(error);
  }
}

async function destroySession() {
  try {
    await AsyncStorage.removeItem('session');
  } catch (error) {
    console.log('Fail to destroy session ');
    console.log(error);
  }
}

export const loadSavedSession = () => {  
  return loadSession;
};










export const loginUser = ({ userID, password, rememberMe }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    API.Authenticate({ UserID: userID, Password: password })
      .then(response => {
        const json = response.data;

        if (json.status === 'OK') {
          loginUserSucess(dispatch, json.data, { userID, password, rememberMe });
        } else {
          console.log('loginUser fail with response json =');
          console.log(json);
          loginUserFail(dispatch, json.message);
        }
      })
      .catch(error => {
        console.log('loginUser fail with error =');
        console.log(error);
        loginUserFail(dispatch, error.message);
      });
  };
};

const loginUserSucess = (dispatch, { userInfo, session }, { userID, password, rememberMe }) => {
  if (rememberMe) {
    saveLoginInfo({ userID, password, rememberMe });
    const user = userInfo;
    user.UserID = user.ssoId;
    user.FullName = user.fullname;
    saveSession({ user, session });
  } else {
    saveLoginInfo({ userID: '', password: '', rememberMe: false });
  }
  
  LocalGroup.getLocalDB()
  .then(() => {
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { userInfo, session }
    });
  })
  .catch(error => {
    console.log('getLocalDB error=');
    console.log(error);
  });
  
};

const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  });
};

export const logoutUser = () => {
  destroySession();
  return({
    type: LOGOUT
  });
}

export const goSupport = (UserID) => {
  return {
    type: GO_SUPPORT,
    payload: { UserID }
  };
};

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
