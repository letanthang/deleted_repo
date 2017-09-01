import React from 'react';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FooterButton = ({ active, text, normalIcon, activeIcon, flip }) => {
  let color = '#777';
  let iconName = normalIcon;
  let style = null;
  if (flip) {
    style = { transform: [{ rotateY: '180deg' }] };
  }
  if (active) {
    color = '#ff5722';
    if (activeIcon) iconName = activeIcon;
  }
  return (
    <Button>
      <Icon name={iconName} size={32} color={color} style={style} />
      <Text style={{ color }}>{text}</Text>
    </Button>
  );
};

export default FooterButton;
