import _ from 'lodash';

const navigate = (context, action, params) => {
  console.log('navigate once');
  context.props.navigation.navigate(action, params);
};

export const navigateOnce = _.debounce(navigate, 300, { leading: true, trailing: false });
