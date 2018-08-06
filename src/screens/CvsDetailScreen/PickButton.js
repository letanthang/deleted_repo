import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import FormButton from '../../components/FormButton';
import { updateOrderStatus, updateOrderInfo } from '../../actions';
import { getUpdateOrderInfoForDone } from '../../components/Helpers';

class PickButton extends Component {
  shouldComponentUpdate({ order }) {
    const old = this.props.order;
    if (order.isUpdated === old.isUpdated
      && order.willSucceeded === old.willSucceeded
      && order.note === old.note) {
      return false;
    }
    return true;
  }

  confirmUpdateOrder(order) {
    
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên: Đã lấy ?';
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrderToDone(order) }
      ],
      { cancelable: false }
    );
  }

  updateOrderToDone(order) {
    const OrderInfos = getUpdateOrderInfoForDone(order);
    const { orderCode, type } = order;
    this.props.updateOrderInfo(orderCode, type, OrderInfos);
    this.props.updateOrderStatus({ OrderInfos });
  }

  render() {
    const { order } = this.props;
    return (
      <FormButton
        theme='success'
        disabled={false}
        text='Lấy'
        width={80}
        onPress={this.confirmUpdateOrder.bind(this, order)}
      />
    );
  }
}

const mapStateToProps = () => {
  return {};
};
  
export default connect(mapStateToProps, { updateOrderStatus, updateOrderInfo })(PickButton);
