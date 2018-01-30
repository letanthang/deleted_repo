import { 
  CONFIG_GET_CONFIGURATION,
  CONFIG_TOGGLE_LAYOUT,
  CONFIG_GET_CONFIGURATION_SUCCESS,
  CONFIG_GET_CONFIGURATION_FAIL
 } from '../actions/types';

const nameInitialState = {
  configuration: null,
  layoutMode: false
};
export default (state = nameInitialState, action) => {
  switch (action.type) {
    
    case CONFIG_GET_CONFIGURATION:
      return { ...state, loading: true };
    case CONFIG_GET_CONFIGURATION_SUCCESS:
      return { ...state, loading: false, configuration: action.payload };
    case CONFIG_GET_CONFIGURATION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CONFIG_TOGGLE_LAYOUT:
      return {
        ...state,
        layoutMode: !state.layoutMode
      };
    default:
      return state;
  }
};
