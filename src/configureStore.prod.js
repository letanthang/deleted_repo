
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

export default function configureStore() {
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
  return store;
}
