import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../FormButton';
import { Colors, Styles } from '../../Styles';
import { updateAllOrderInfo, setAllStatus } from '../../actions';
import { updateOrderToFailWithReason2, getUpdateOrderInfo, getUpdateOrderInfoForDone } from './Helpers';

class ActionAllButtons extends Component {
  componentWillMount() {
  }
  changeInfo(nextStatus) {
    const orders = this.props.orders;
    const { ContactPhone } = orders[0];
    
    if (nextStatus === undefined) { 
      this.props.setAllStatus(undefined);
      this.props.updateAllOrderInfo({});
    } else if (nextStatus) {
      this.props.setAllStatus(true);
      const OrderInfos = _.map(orders, order => getUpdateOrderInfoForDone(order)); 
      this.props.updateAllOrderInfo(OrderInfos);
    } else {
      updateOrderToFailWithReason2(ContactPhone, this.props.configuration)
      .then(({ error, buttonIndex }) => {
        if (error === null) {
          const OrderInfos = _.map(orders, order => getUpdateOrderInfo(order, buttonIndex));
          this.props.updateAllOrderInfo(OrderInfos);
          this.props.setAllStatus(false);
        } else if (error === 'moreCall') {
          // more call
        } else if (error === 'chooseDate') {
          this.props.onSelectDateCase(buttonIndex);
        }
      });
    }
  }
  render() {
    const { allStatus, done, style, rightText = 'Lấy' } = this.props;
    if (done) return null;

    const status = allStatus;

    return (
      <View style={style}>
        <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>Cập nhật tất cả thành: </Text>
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
      </View>
    );
  }
}

const mapStateToProps = ({ other, pickGroup }) => {
  const { allStatus } = pickGroup;
  const { configuration } = other;
  return { configuration, allStatus };
};

export default connect(mapStateToProps, { updateAllOrderInfo, setAllStatus })(ActionAllButtons);
