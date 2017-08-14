import { AsyncStorage } from 'react-native';

class LocalGroup {
  static async addGroup() {
    try {
      const loginInfo = await AsyncStorage.getItem('loginInfo');
      if (loginInfo !== null) {
        const payload = JSON.parse(loginInfo);
        dispatch({
          type: LOAD_SAVED_USER_PASS,
          payload
        });
      }
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
  static async getGroups() {
    try {
      const loginInfo = await AsyncStorage.getItem('loginInfo');
      if (loginInfo !== null) {
        const payload = JSON.parse(loginInfo);
        dispatch({
          type: LOAD_SAVED_USER_PASS,
          payload
        });
      }
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
  static async setOrderGroup() {
    try {
      const loginInfo = await AsyncStorage.getItem('loginInfo');
      if (loginInfo !== null) {
        const payload = JSON.parse(loginInfo);
        dispatch({
          type: LOAD_SAVED_USER_PASS,
          payload
        });
      }
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
  static async getOrderGroup() {
    try {
      const loginInfo = await AsyncStorage.getItem('loginInfo');
      if (loginInfo !== null) {
        const payload = JSON.parse(loginInfo);
        dispatch({
          type: LOAD_SAVED_USER_PASS,
          payload
        });
      }
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
}

export default LocalGroup;
