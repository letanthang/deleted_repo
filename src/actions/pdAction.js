import { PDLIST_FETCH, PDLIST_FETCH_SUCCESS, PDLIST_FETCH_FAIL, PDPICK_LIST } from './types';

export const pdListFetch = (sessionToken) => {
  console.log('Action: pdListFetch start');
  console.log(sessionToken);
  return (dispatch) => {
    dispatch({ type: PDLIST_FETCH });
    console.log(' prepare to fetch pd list');
    fetch('https://test.ghn.vn/api/mpds/GetUserActivePds', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==',
        ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=',
        SessionToken: sessionToken,
        VersionCode: 60
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetUserActivePds finish with response');
        console.log(responseJson);
        if (responseJson.code === 1) {
          pdListFetchSuccess(dispatch, responseJson.data);
        } else {
          pdListFetchFail(dispatch);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const pdListFetchSuccess = (dispatch, data) => {
  console.log('success & prepare to update home screen');
  dispatch({ type: PDLIST_FETCH_SUCCESS, payload: data });
};

export const pdListFetchFail = (dispatch) => {
  dispatch({ type: PDLIST_FETCH_FAIL });
};

export const pdPickList = () => {
  return {
    type: PDPICK_LIST
  };
};
