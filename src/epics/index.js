import { combineEpics } from 'redux-observable';
import loginUserEpic from './loginUserEpic';
import fetchTripInfoEpic from './fetchTripInfoEpic';
import fetchTripDataEpic from './fetchTripDataEpic';

export default combineEpics(
  loginUserEpic,
  fetchTripInfoEpic,
  fetchTripDataEpic
);
