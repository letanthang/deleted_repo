import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import FormButton from '../FormButton';
import { Colors } from '../../Styles';

class ActionButtons extends Component {
  componentWillMount() {
    console.log('ActionButtons : cwm');
    console.log(this.props);
  }
  changeInfo(nextStatus) {
    const { OrderID } = this.props.order;
    let info;
    if (nextStatus === 0) { 
      info = undefined;
    } else {
      info = {
        OrderID,
        success: (nextStatus === 2)
      };
    }
    console.log(info);
    this.props.onInfoChanged(info);
  }
  render() {
    console.log('ActionButtons : render');
    const { info, order } = this.props;
    let status = 0;
    if (info[order.OrderID] !== undefined) {
      status = info.success ? 2 : 1; 
    }
    console.log('ActionButtons : render with status');
    console.log(status);

    return (
      <View style={{ flexDirection: 'row', flex: 1, margin: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 0.5, padding: 0, margin: 0 }}>
          <CheckBox
            checked={status === 1} 
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginLeft: -10, marginRight: 0, width: 42 }}
            onPress={this.changeInfo.bind(this, status === 1 ? 0 : 1)}
          /> 
          <FormButton
            disabled={false}
            theme='danger'
            text='LỖI'
            width={60}
            onPress={this.changeInfo.bind(this, status === 1 ? 0 : 1)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 0.5 }}>
          <CheckBox
            checked={status === 2}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginRight: 0, width: 42 }}
            onPress={this.changeInfo.bind(this, status === 2 ? 0 : 2)}
          />
          <FormButton
            disabled={false}
            theme='success'
            text='Lay'
            width={60}
            onPress={this.changeInfo.bind(this, status === 2 ? 0 : 2)}
          />
        </View>
      </View>
    );
  }
}

export default ActionButtons;
