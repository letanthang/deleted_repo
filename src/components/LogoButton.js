import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';

const logoIcon = require('../../resources/mpds_icon_48.png');

const reset = (dispatch) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ 
        routeName: 'Drawer', 
        action: NavigationActions.navigate({ routeName: 'Home', params: { needUpdateData: true } }) 
      })
    ]
  });
  dispatch(resetAction);
};

const LogoButton = ({ dispatch }) => {
  return (
    <TouchableOpacity
      onPress={() => reset(dispatch)}
    >
      <View style={{ borderWidth: 1, borderColor: '#ffffff55', borderRadius: 2, padding: 2, marginLeft: 10 }}>
        <Image
          style={{ width: 22, height: 22 }} 
          source={logoIcon} 
        >
        <View 
          style={{ backgroundColor: '#00593999', flex: 1 }} 
        />
        </Image>
      </View>
    </TouchableOpacity>
  );
};

export default LogoButton;