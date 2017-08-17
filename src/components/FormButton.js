import React from 'react';
import { Button, Text } from 'native-base';
import { Styles } from '../Styles';

const FormButton = ({ text, disabled, onPress }) => {
  return (
    <Button 
    block 
    style={[{ backgroundColor: 'white', }, Styles.normalColor]}
    small
    onPress={onPress}
    >
      <Text style={Styles.normalColor}>{text}</Text>
    </Button>
  );
};

export default FormButton;
