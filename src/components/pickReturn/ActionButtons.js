import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../FormButton';
import { Colors } from '../../Styles';
import { updateOrderInfo } from '../../actions';
import { updateOrderToFailWithReason, getUpdateOrderInfo, getUpdateOrderInfoForDone } from './Helpers';

class ActionButtons extends Component {
  componentWillMount() {
    // console.log('ActionButtons : cwm');
  }
  changeInfo(nextStatus) {
    const order = this.props.order;
    const { OrderID, ContactPhone } = this.props.order;
    let info = {};
    if (nextStatus === undefined) { 
      info = undefined;
      this.props.updateOrderInfo(OrderID, undefined);
    } else if (nextStatus) {
      info = getUpdateOrderInfoForDone(this.props.order);
      info.success = nextStatus;
      this.props.updateOrderInfo(OrderID, info);
    } else {
      //failed to pick
      info.success = nextStatus;
      updateOrderToFailWithReason(ContactPhone, this.props.configuration, (error, buttonIndex) => {
        console.log(' call back !');
        if (error === null) {
          //console.log('set state to loi');
          const moreInfo = getUpdateOrderInfo(order, buttonIndex);
          this.props.updateOrderInfo(OrderID, moreInfo);
        } else if (error === 'moreCall') {
          console.log('moreCall');
        } else if (error === 'chooseDate') {
          this.props.onSelectDateCase(buttonIndex);
        }
      });
    }
    //console.log(info);
  }
  render() {
    // console.log('ActionButtons : render');
    const { info, done, rightText = 'Lấy' } = this.props;
    if (done) return null;

    const status = (info === undefined) ? undefined : info.success;
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
