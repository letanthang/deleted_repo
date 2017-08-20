import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button, Text } from 'native-base';
import { Colors } from '../Styles';

const FormButton = ({ text, disabled, onPress, width }) => {
  let textStyle = styles.textStyle;
  let buttonStyle = styles.buttonStyle;
  if (disabled) {
    textStyle = styles.textDisabledStyle;
    buttonStyle = styles.buttonDisabledStyle;
  } 

  if (width) {
    buttonStyle = { ...buttonStyle, width };
  }
  
  return (
    <Button 
    block 
    style={buttonStyle}
    small
    onPress={disabled ? null : onPress}
    >
      <Text style={textStyle}>{text}</Text>
    </Button>
  );
};

let styles = {
  textStyle: {
    color: Colors.normal
  },
  textDisabledStyle: {
    color: Colors.weak
  },
  buttonStyle: {
    margin: 2,
    backgroundColor: 'white',
    borderColor: Colors.normal,
    borderWidth: 1,
    borderRadius: 2,
    height: 52,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0
  },
  buttonDisabledStyle: {
    margin: 2,
    backgroundColor: 'white',
    borderColor: Colors.weak,
    borderWidth: 1,
    borderRadius: 2,
    height: 52,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0
  }
};

export default FormButton;
