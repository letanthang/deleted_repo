import React, { Component } from 'react';
import { View, UIManager, LayoutAnimation } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../../components/FormButton';
import { Colors } from '../../Styles';
import { updateOrderInfo } from '../../actions';
import { getUpdateOrderInfo, getUpdateOrderInfoForDone, codes } from '../../components/Helpers';
import { ActionLogCode, ErrorToLogCode } from '../../components/Constant';
import ActionLog from '../../libs/ActionLog';

class ActionButtons extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  changeInfo(nextStatus) {

    this.props.resetAllButton();
    const { order, animated } = this.props;
    const { orderCode, type, senderPhone } = this.props.order;
    let info = {};
    if (nextStatus === undefined) {
      if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // animation
      info = { willSucceeded: undefined };
      this.props.updateOrderInfo(orderCode, type, info);
    } else if (nextStatus) {
      //picked
      ActionLog.log(ActionLogCode.SHOP_PICK_TRUE, this.props.navigation);
      if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); // animation
      info = getUpdateOrderInfoForDone(this.props.order);
      info.willSucceeded = nextStatus;
      this.props.updateOrderInfo(orderCode, type, info);
    } else {
      //failed to pick
      ActionLog.log(ActionLogCode.SHOP_PICK_FALSE, this.props.navigation);
      info.willSucceeded = nextStatus;
      const moreInfo = getUpdateOrderInfo(order);
      this.props.updateOrderInfo(orderCode, type, moreInfo);
    }
  }
  render() {
    const { info, done, rightText = 'Lấy' } = this.props;
    if (done) return null;

    const status = info.willSucceeded;
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

export default connect(mapStateToProps, { updateOrderInfo })(ActionButtons);
