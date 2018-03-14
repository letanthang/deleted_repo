import { AsyncStorage } from 'react-native';
import moment from 'moment';

export const writeLog = async (messageObj, logType = 'default') => {
  const key = `${logType}-log-suffix`;
  let logs = await AsyncStorage.getItem(key);
  logs = logs || '';
  const time = moment().format();
  logs = `${logs} \n\n ${time} ${JSON.stringify(messageObj)}`;
  AsyncStorage.setItem(key, logs);
};

export const readLog = async (logType = 'default') => {
  const key = `${logType}-log-suffix`;
  return AsyncStorage.getItem(key);
};
