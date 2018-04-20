import React, { Component } from 'react';
import { View, LayoutAnimation, UIManager } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../../components/FormButton';
import { Colors } from '../../Styles';
import { updateOrderInfo } from '../../actions';
import { updateOrderToFailWithReason2, getUpdateOrderInfo, getUpdateOrderInfoForDone } from '../../components/ReturnHelpers';

class ReturnActionButtons extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  changeInfo(nextStatus) {
    const order = this.props.order;
    const { code, pickDeliveryType, contactPhone } = this.props.order;
    let info = {};
    if (nextStatus === undefined) { 
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // animation
      info = { success: undefined, nextStatus: undefined };
      this.props.updateOrderInfo(code, pickDeliveryType, info);
    } else if (nextStatus) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); // animation
      info = getUpdateOrderInfoForDone(this.props.order);
      info.success = nextStatus;
      this.props.updateOrderInfo(code, pickDeliveryType, info);
    } else {
      //failed to pick
      info.success = nextStatus;
      updateOrderToFailWithReason2(contactPhone, this.props.configuration, code)
      .then(({ error, buttonIndex }) => {
        if (error === null) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); // animation
          const moreInfo = getUpdateOrderInfo(order, buttonIndex);
          this.props.updateOrderInfo(code, pickDeliveryType, moreInfo);
        } else if (error === 'moreCall') {
          // more call
        } else if (error === 'chooseDate') {
          this.props.onSelectDateCase(buttonIndex);
        }
      });
    }
  }
  render() {
    const { info, done, rightText = 'Trả' } = this.props;
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

const mapStateToProps = ({ config }) => {
  const { configuration } = config;
  return { configuration };
};

export default connect(mapStateToProps, { updateOrderInfo })(ReturnActionButtons);
