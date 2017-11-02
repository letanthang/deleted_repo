import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import pdReducer from './pdReducer';
import OtherReducer from './OtherReducer';
import PickGroupReducer from './PickGroupReducer';
import ReturnGroupReducer from './ReturnGroupReducer';
import OrderAddReducer from './OrderAddReducer';

const appReducer = combineReducers({
  auth: AuthReducer,
  pd: pdReducer,
  other: OtherReducer,
  pickGroup: PickGroupReducer,
  returnGroup: ReturnGroupReducer,
  orderAdd: OrderAddReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
}; 

export default rootReducer;
