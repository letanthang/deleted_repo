import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import pdReducer from './pdReducer';
import OtherReducer from './OtherReducer';

const appReducer = combineReducers({
  auth: AuthReducer,
  pd: pdReducer,
  other: OtherReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
}; 

export default rootReducer;
