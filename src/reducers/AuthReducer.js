import { 
  USERID_CHANGED, 
  PASSWORD_CHANGED,
  REMEMBER_ME_CHANGED,
  LOAD_SAVED_USER_PASS,
  LOAD_SAVED_SESSION,
  LOGIN_USER, 
  LOGIN_USER_SUCCESS, 
  LOGIN_USER_FAIL,
  LOGOUT_USER 
} from '../actions/types';
import ShareVariables from '../libs/ShareVariables';

const INITIAL_STATE = { 
  userID: '', 
  password: '',
  rememberMe: false,
  loading: false,
  error: '',
  user: null,
  sessionToken: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USERID_CHANGED:
      return { ...state, userID: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case REMEMBER_ME_CHANGED:
      return { ...state, rememberMe: !state.rememberMe };
    case LOAD_SAVED_USER_PASS:
      // console.log('AuthReducer: LOAD_SAVED_USER_PASS');
      return { 
        ...state, 
        userID: action.payload.userID,
        password: action.payload.password,
        rememberMe: action.payload.rememberMe,
      };
    case LOAD_SAVED_SESSION:
      return { 
        ...state, 
        user: action.payload.user,
        sessionToken: action.payload.sessionToken
      };
    case LOGIN_USER_SUCCESS: {
      console.log('login success');
      new ShareVariables().LoginHeader['X-Auth'] = action.payload.session;
      const user = action.payload.userInfo;
      user.UserID = user.ssoId;
      user.FullName = user.fullname;
      return { ...state,
        loading: false,
        error: '', 
        sessionToken: action.payload.session,
        user 
      };
    }
    case LOGIN_USER_FAIL:
      return { ...state,
        loading: false, 
        error: action.payload 
      };
    case LOGIN_USER:
      console.log('update activity indicator');
      return { ...state,
        loading: true,
        error: ''
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};
