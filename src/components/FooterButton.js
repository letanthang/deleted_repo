import React from 'react';
import { Image } from 'react-native';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Styles';

const FooterButton = ({ active, text, normalImage, activeImage, normalIcon, activeIcon, flip, onPress }) => {
  const onButtonPress = active ? null : onPress;
  let color = Colors.footerNormal;
  let iconName = normalIcon;
  let style = null;
  let imageSource = normalImage;
  if (flip) {
    style = { transform: [{ rotateY: '180deg' }] };
  }
  if (active) {
    color = Colors.footerActive;
    if (activeIcon) iconName = activeIcon;
    if (activeImage) imageSource = activeImage;
  }
  if (!imageSource) {
    return (
      <Button
        onPress={onButtonPress}
        transparent
      >
        <Icon name={iconName} size={32} color={color} style={style} />
        <Text uppercase={false} style={{ color }}>{text}</Text>
      </Button>
    );
  }
  return (
    <Button
      onPress={onButtonPress}
      transparent
    >
      <Image source={imageSource} style={{ width: 26, height: 26, marginTop: 4, marginBottom: 2 }} />
      <Text uppercase={false} style={{ color, padding: 0, margin: 0 }}>{text}</Text>
    </Button>
  );
};

export default FooterButton;
