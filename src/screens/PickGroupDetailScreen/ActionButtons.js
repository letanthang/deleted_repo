import React, { Component } from 'react';
import { View, UIManager, LayoutAnimation } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../../components/FormButton';
import { Colors } from '../../Styles';
import { updateOrderInfo } from '../../actions';
import { updateOrderToFailWithReason2, getUpdateOrderInfo, getUpdateOrderInfoForDone } from '../../components/Helpers';

class ActionButtons extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  changeInfo(nextStatus) {
    this.props.resetAllButton();
    const { order, animated } = this.props;
    const { code, type, senderPhone } = this.props.order;
    let info = {};
    if (nextStatus === undefined) {
      if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // animation
      info = { success: undefined, nextStatus: undefined };
      this.props.updateOrderInfo(code, type, info);
    } else if (nextStatus) {
      if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); // animation
      info = getUpdateOrderInfoForDone(this.props.order);
      info.success = nextStatus;
      this.props.updateOrderInfo(code, type, info);
    } else {
      //failed to pick
      info.success = nextStatus;
      updateOrderToFailWithReason2(senderPhone, this.props.configuration, code)
      .then(({ error, buttonIndex }) => {
        if (error === null) {
          if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); // animation
          const moreInfo = getUpdateOrderInfo(order, buttonIndex);
          this.props.updateOrderInfo(code, type, moreInfo);
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

const mapStateToProps = ({ config }) => {
  const { configuration } = config;
  return { configuration };
};

export default connect(mapStateToProps, { updateOrderInfo })(ActionButtons);
