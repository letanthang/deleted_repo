import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import pdReducer from './pdReducer';
import OtherReducer from './OtherReducer';

export default combineReducers({
  auth: AuthReducer,
  pd: pdReducer,
  other: OtherReducer
});

