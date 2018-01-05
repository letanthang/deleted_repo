import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../FormButton';
import { Colors } from '../../Styles';
import { updateOrderInfo } from '../../actions';
import { updateOrderToFailWithReason2, getUpdateOrderInfo, getUpdateOrderInfoForDone } from './Helpers';

class ActionButtons extends Component {
  componentWillMount() {
  }
  changeInfo(nextStatus) {
    const order = this.props.order;
    const { OrderID, PickDeliveryType, ContactPhone, OrderCode } = this.props.order;
    let info = {};
    if (nextStatus === undefined) { 
      info = { success: undefined };
      this.props.updateOrderInfo(OrderID, PickDeliveryType, info);
    } else if (nextStatus) {
      info = getUpdateOrderInfoForDone(this.props.order);
      info.success = nextStatus;
      this.props.updateOrderInfo(OrderID, PickDeliveryType, info);
    } else {
      //failed to pick
      info.success = nextStatus;
      updateOrderToFailWithReason2(ContactPhone, this.props.configuration, OrderCode)
      .then(({ error, buttonIndex }) => {
        if (error === null) {
          const moreInfo = getUpdateOrderInfo(order, buttonIndex);
          this.props.updateOrderInfo(OrderID, PickDeliveryType, moreInfo);
        } else if (error === 'moreCall') {
          // more call
        } else if (error === 'chooseDate') {
          this.props.onSelectDateCase(buttonIndex);
        }
      });
    }
  }
  render() {
    const { info, done, rightText = 'Lấy' } = this.props;
    if (done) return null;

    const status = info.success;
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
            text={rightText}
            width={60}
            onPress={this.changeInfo.bind(this, status !== true ? true : undefined)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ other }) => {
  const { configuration } = other;
  return { configuration };
};

export default connect(mapStateToProps, { updateOrderInfo })(ActionButtons);
