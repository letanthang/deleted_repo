import {
  USERID_CHANGED,
  PASSWORD_CHANGED,
  REMEMBER_ME_CHANGED,
  LOAD_SAVED_USER_PASS,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER,
} from '../actions/types';
import ShareVariables from '../libs/ShareVariables';

const INITIAL_STATE = {
  userId: '',
  password: '',
  rememberMe: false,
  loading: false,
  error: '',
  user: null,
  sessionToken: null,
  warehouseIds: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USERID_CHANGED:
      return { ...state, userId: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case REMEMBER_ME_CHANGED:
      return { ...state, rememberMe: !state.rememberMe };
    case LOAD_SAVED_USER_PASS:
      return {
        ...state,
        userId: action.payload.userId,
        password: action.payload.password,
        rememberMe: action.payload.rememberMe,
      };
    case LOGIN_USER_SUCCESS: {
      // console.log(action.payload);
      const { session, userInfo, rememberMe } = action.payload;
      new ShareVariables().LoginHeader['X-Auth'] = session;
      const { warehouseIds } = userInfo;
      new ShareVariables().LoginHeader['X-WarehouseId'] = warehouseIds[0];
      const user = userInfo;
      user.UserID = user.ssoId;
      user.FullName = user.fullname;
      return {
        ...state,
        userId: user.ssoId,
        password: rememberMe ? state.password : '',
        loading: false,
        error: '',
        sessionToken: action.payload.session,
        user,
        warehouseIds,
      };
    }
    case LOGIN_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
