
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';

export default function configureStore() {
  const config = {
    key: 'root',
    storage,
    blacklist: ['other']
  };
  const reducer = persistCombineReducers(config, reducers);
  const store = createStore(reducer, {}, applyMiddleware(ReduxThunk));
  const persistor = persistStore(store);
  return { store, persistor };
}
