
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { combineEpics } from 'redux-observable';
import { Alert } from 'react-native';
import { pdListFetch } from '../actions';
import { PD_START_CVS_SESSION, PD_START_CVS_SESSION_SUCCESS, PD_START_CVS_SESSION_FAIL } from '../actions/types';
import { } from '../actions';
import * as API from '../apis/MPDS';
import Utils from '../libs/Utils';

const startSessionEpic = action$ =>
  action$.ofType(PD_START_CVS_SESSION)
    .map(action => action.payload)
    .mergeMap(({ orderCodes }) => {
      return API.getOrdersInfo(orderCodes)
        .map(({ data }) => {
          const response = data;
          switch (response.status) {
            case 'OK':
              return { type: PD_START_CVS_SESSION_SUCCESS };
            default:
              return { type: PD_START_CVS_SESSION_FAIL, payload: { error: response.message } };
          }
        })
        .catch(error => of({ type: PD_START_CVS_SESSION_FAIL, payload: { error: error.message } }));
    });

const failEpic = action$ =>
  action$.ofType(PD_START_CVS_SESSION_FAIL)
    .map(action => action.payload)
    .do(({ error }) => Alert.alert(
      'Thông báo',
      'Không thể cập nhật kích thước mới. ' + error,
      [
        
        { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    ))
    .ignoreElements();

const successEpic = action$ =>
  action$.ofType(PD_START_CVS_SESSION_SUCCESS)
    .map(action => action.payload)
    .do(() => Utils.showToast('Cập nhật kích thước thành công', 'success'))
    .delay(300)
    .mergeMap((() => of(pdListFetch({ off: true }))));

export default combineEpics(
  startSessionEpic,
  failEpic,
  successEpic,
);
