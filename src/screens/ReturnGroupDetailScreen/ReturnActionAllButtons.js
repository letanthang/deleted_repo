import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import FormButton from '../../components/FormButton';
import { Colors, Styles } from '../../Styles';
import { updateOrderInfos, setAllStatusReturn } from '../../actions';
import { updateOrderToFailWithReason2, getUpdateOrderInfo, getUpdateOrderInfoForDone } from '../../components/ReturnHelpers';

class ReturnActionAllButtons extends Component {
  state = { status: undefined }
  componentWillMount() {
  }
  changeInfo(nextStatus) {
    const orders = this.props.orders;
    const { contactPhone } = orders[0];
    
    if (nextStatus === undefined) { 
      const OrderInfos = _.map(orders, order => { 
        const { code, type } = order; 
        return { code, type, success: undefined, nextStatus: undefined }; 
      }); 
      this.props.updateOrderInfos(OrderInfos);
      this.setState({ status: undefined });
    } else if (nextStatus) {
      const OrderInfos = _.map(orders, order => getUpdateOrderInfoForDone(order)); 
      this.props.updateOrderInfos(OrderInfos);
      this.setState({ status: nextStatus });
    } else {
      updateOrderToFailWithReason2(contactPhone, this.props.configuration)
      .then(({ error, buttonIndex }) => {
        if (error === null) {
          const OrderInfos = _.map(orders, order => getUpdateOrderInfo(order, buttonIndex));
          this.props.updateOrderInfos(OrderInfos);
          this.setState({ status: nextStatus });
        } else if (error === 'moreCall') {
          // more call
        } else if (error === 'chooseDate') {
          this.props.onSelectDateCase(buttonIndex);
          this.setState({ status: nextStatus });
        }
      });
    }
  }
  render() {
    const { done, style, rightText = 'Trả' } = this.props;
    if (done) return null;

    const status = this.state.status;

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

const mapStateToProps = ({ config, returnGroup }) => {
  const { allStatusReturn } = returnGroup;
  const { configuration } = config;
  return { configuration, allStatusReturn };
};

export default connect(mapStateToProps, { updateOrderInfos })(ReturnActionAllButtons);
