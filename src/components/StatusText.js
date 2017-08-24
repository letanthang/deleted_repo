import React, { Component } from 'react';
import { View, Text } from 'react-native';

class StatusText extends Component {
  render() {
    const { colorTheme, text, style, show } = this.props;
    if (show === false) return null;
    
    let color = null;
    let backgroundColor = null;
    switch (colorTheme) {
      case 'red':
        color = '#FF7F9C';
        backgroundColor = '#FFF1F5';
        break;
      case 'green':
        color = '#82E6AA';
        backgroundColor = '#F1FCF6';
        break;
      default:
        color = 'black';
        backgroundColor = '#ccc';
    }
    return (
      <View style={{ backgroundColor, borderWidth: 1, borderColor: color, borderRadius: 2, width: 71, alignItems: 'center', ...style }}>
        <Text style={{ color }} >{text}</Text>
      </View>
    );
  }
}

export default StatusText;
