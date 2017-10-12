import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import FormButton from '../FormButton';
import { Colors } from '../../Styles';
import { getUpdateOrderInfoForDone } from './Helpers';

class ActionButtons extends Component {
  componentWillMount() {
    console.log('ActionButtons : cwm');
    console.log(this.props);
  }
  changeInfo(nextStatus) {
    const { OrderID } = this.props.order;
    let info = {};
    if (nextStatus === undefined) { 
      info = undefined;
    } else if (nextStatus) {
      info = getUpdateOrderInfoForDone(this.props.order);
      info.success = nextStatus;
    } else {
      info.success = nextStatus;
    }
    //console.log(info);
    this.props.onInfoChanged(info);
  }
  render() {
    console.log('ActionButtons : render');
    const { info, order } = this.props;
    const status = (info === undefined) ? undefined : info.success;
    //console.log('ActionButtons : render with status');
    //console.log(status);

    return (
      <View style={{ flexDirection: 'row', flex: 1, margin: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 0.5, padding: 0, margin: 0 }}>
          <CheckBox
            checked={status === false} 
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginLeft: -10, marginRight: 0, width: 42 }}
            onPress={this.changeInfo.bind(this, status !== false ? false : undefined)}
          /> 
          <FormButton
            disabled={false}
            theme='danger'
            text='LỖI'
            width={60}
            onPress={this.changeInfo.bind(this, status !== false ? false : undefined)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 0.5 }}>
          <CheckBox
            checked={status === true}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: Colors.item, borderWidth: 0, marginRight: 0, width: 42 }}
            onPress={this.changeInfo.bind(this, status !== true ? true : undefined)}
          />
          <FormButton
            disabled={false}
            theme='success'
            text='Lay'
            width={60}
            onPress={this.changeInfo.bind(this, status !== true ? true : undefined)}
          />
        </View>
      </View>
    );
  }
}

export default ActionButtons;
