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
  } else if (theme === 'theme1') {
    buttonStyle = styles.buttonTheme1Style;
    textStyle = styles.textTheme1Style;
  }

  
  if (disabled) {
    textStyle = styles.textDisabledStyle;
    buttonStyle = styles.buttonDisabledStyle;
  }
  if (width) {
    buttonStyle = { ...buttonStyle, width };
  }
  
  return (
    <TouchableOpacity  
    style={buttonStyle}
    small
    onPress={disabled ? null : onPress}
    >
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const defaultStyles = {
  buttonStyle: {
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
    borderColor: Colors.normal,
    borderWidth: 1,
    borderRadius: 5,
    height: 38,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: Colors.normal
  },
  successColor: '#006441',
  dangerColor: '#AF3738'
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
  },
  buttonTheme1Style: {
    ...defaultStyles.buttonStyle,
    backgroundColor: defaultStyles.successColor,
    borderRadius: 2
  },
  textTheme1Style: {
    color: 'white'
  }
};

export default FormButton;
