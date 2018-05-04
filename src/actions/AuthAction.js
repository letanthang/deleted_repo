import {
  USERID_CHANGED, PASSWORD_CHANGED, REMEMBER_ME_CHANGED, LOGIN_USER,
  LOGOUT_USER, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS,
} from './types';

export const userIDChanged = (text) => {
  return {
    type: USERID_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const rememberMeChanged = () => {
  return {
    type: REMEMBER_ME_CHANGED,
  };
};

export const loginUser = (userid, password, rememberMe) => {
  return { type: LOGIN_USER, payload: { userid, password, rememberMe } };
};

export const loginUserSucess = (response, rememberMe) => {
  const { userInfo, session } = response.data;
  return {
    type: LOGIN_USER_SUCCESS,
    payload: { userInfo, session, rememberMe },
  };
};

export const loginUserFail = (error) => {
  return {
    type: LOGIN_USER_FAIL,
    payload: { error },
  };
};

export const logoutUser = (message) => {
  return {
    type: LOGOUT_USER,
    payload: { message },
  };
};
