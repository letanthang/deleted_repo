import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button, Text } from 'native-base';
import { Colors } from '../Styles';

const FormButton = ({ text, disabled, theme, onPress, width }) => {
  let textStyle = styles.textStyle;
  let buttonStyle = styles.buttonStyle;
  

  if (theme === 'success') {
    buttonStyle = styles.buttonSuccessStyle;
    textStyle = styles.textSuccessStyle;
  } else if (theme === 'danger') {
    buttonStyle = styles.buttonDangerStyle;
    textStyle = styles.textDangerStyle;
  }

  
  if (disabled) {
    textStyle = styles.textDisabledStyle;
    buttonStyle = styles.buttonDisabledStyle;
  }
  if (width) {
    buttonStyle = { ...buttonStyle, width };
  }
  
  return (
    <Button  
    style={buttonStyle}
    small
    onPress={disabled ? null : onPress}
    >
      <Text style={textStyle}>{text}</Text>
    </Button>
  );
};

const defaultStyles = {
  buttonStyle: {
    margin: 2,
    backgroundColor: 'white',
    borderColor: Colors.normal,
    borderWidth: 1,
    borderRadius: 10,
    height: 44,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    justifyContent: 'center'
  },
  textStyle: {
    color: Colors.normal
  },
  successColor: '#20D3A1',
  dangerColor: '#FB8589'
};

let styles = {
  textStyle: defaultStyles.textStyle,
  textSuccessStyle: {
    color: defaultStyles.successColor
  },
  textDangerStyle: {
    color: 'white'
  },
  textDisabledStyle: {
    color: Colors.weak
  },
  buttonStyle: defaultStyles.buttonStyle,
  buttonSuccessStyle: {
    ...defaultStyles.buttonStyle,
    borderColor: defaultStyles.successColor
  },
  buttonDangerStyle: {
    ...defaultStyles.buttonStyle,
    backgroundColor: defaultStyles.dangerColor,
    borderColor: defaultStyles.dangerColor
  },
  buttonDisabledStyle: {
    ...defaultStyles.buttonStyle,
    borderColor: Colors.weak,
  }
};

export default FormButton;
