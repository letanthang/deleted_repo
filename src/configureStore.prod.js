
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default function configureStore() {
  const config = {
    key: 'root',
    storage
  };
  const reducer = persistCombineReducers(config, reducers);
  const store = createStore(reducer, {}, applyMiddleware(ReduxThunk));
  const persistor = persistStore(store);
  return { store, persistor };
}
