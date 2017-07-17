import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import pdReducer from './pdReducer';

export default combineReducers({
  auth: AuthReducer,
  pd: pdReducer
});
