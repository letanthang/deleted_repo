import React, { Component } from 'react';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text } from 'react-native';

class StatusText extends Component {
  render() {
    const { colorTheme, text, style, show, alert } = this.props;
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
      case 'black':
        color = 'black';
        backgroundColor = '#ccc';
        break;
      case 'yellow':
        color = '#F3BD71';
        backgroundColor = '#ffffff99';
        break;
      default:
        color = 'black';
        backgroundColor = '#ccc';
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ backgroundColor, borderWidth: 1, borderColor: color, borderRadius: 2, width: 71, alignItems: 'center', ...style }}>
          <Text style={{ color }} >{text}</Text>
        </View>
        {alert ?
        <IC name='sync-alert' size={16} color='#FF5723' />
        : null}
      </View>
      
    );
  }
}

export default StatusText;
