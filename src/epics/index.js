import { combineEpics } from 'redux-observable';
import loginUserEpic from './loginUserEpic';
import fetchTripInfoEpic from './fetchTripInfoEpic';
import fetchTripDataEpic from './fetchTripDataEpic';
import addOrderEpic from './addOrderEpic';
import updateWeightSizeEpic from './updateWeightSizeEpic';

export default combineEpics(
  loginUserEpic,
  fetchTripInfoEpic,
  fetchTripDataEpic,
  addOrderEpic
);
