import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import FormButton from '../FormButton';
import { Colors } from '../../Styles';

class ActionButtons extends Component {
  state={ status: null }
  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1, margin: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 0.5, padding: 0, margin: 0 }}>
          <CheckBox
            checked={this.state.status === false} 
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginLeft: -10, marginRight: 0, width: 42 }}
            onPress={() => this.setState({ status: this.state.status === false ? null : false })}
          /> 
          <FormButton
            disabled={false}
            theme='danger'
            text='LỖI'
            width={60}
            onPress={() => this.setState({ status: this.state.status === false ? null : false })}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 0.5 }}>
          <CheckBox
            checked={this.state.status === true}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginRight: 0, width: 42 }}
            onPress={() => this.setState({ status: this.state.status === true ? null : true })}
          />
          <FormButton
            disabled={false}
            theme='success'
            text='Lay'
            width={60}
            onPress={() => this.setState({ status: this.state.status === true ? null : true })}
          />
        </View>
      </View>
    );
  }
}

export default ActionButtons;
