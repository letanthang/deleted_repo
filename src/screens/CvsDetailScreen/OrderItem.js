import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { accounting } from 'accounting';
import OrderStatusText from '../../components/OrderStatusText';
import ActionButtons from './ActionButtons';
import PickButton from './PickButton';
import FormButton from '../../components/FormButton';
import { Styles, Colors } from '../../Styles';
import Utils from '../../libs/Utils';

class OrderItem extends Component {
  shouldComponentUpdate({ order, isDelivering }) {
    const old = this.props.order;
    if (order.isUpdated === old.isUpdated
      && order.isSucceeded === old.isSucceeded
      && order.willSucceeded === old.willSucceeded
      && order.note === old.note 
      && isDelivering === this.props.isDelivering) {
      return false;
    }
    return true;
  }

  
  render() {
    // console.log('OrderItem render!');
    const { order, animated, acceptDeliverPress, onOrderPress, isDelivering, onSelectDateCase, resetAllButton, navigation } = this.props;
    const { 
      orderCode, receiverName, receiverPhone,
      height, width, weight, length, status,
      externalCode, collectAmount, success, note, newDate, pickWarehouseId,
      deliverWarehouseId, done,
    } = order;

    const realDone = done;
    const nearDone = Utils.checkCompleteForUnsync(order);
    const backgroundColor = nearDone ? '#DFDFEF' : Colors.row;
    const pickSuccess = Utils.checkSuccess(order)
    const deliverable = realDone && pickWarehouseId === deliverWarehouseId && pickSuccess;
    const pickFail = realDone && !pickSuccess;
    const deliverStatus = isDelivering ? 'Đã nhận giao' : 'Nhận đi giao';
    const fullNote = Utils.getFullNote(note, newDate);
    return (
      <TouchableOpacity
        onPress={onOrderPress.bind(this, order)}
      >
        <View style={[Styles.orderWrapperStyle, { backgroundColor }]}>
          <View style={Styles.item2Style}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{orderCode}</Text>
              <OrderStatusText
                order={order}
                style={{ marginLeft: 10 }}
              />
            </View>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(collectAmount)} đ</Text>
          </View>
          {success === false && realDone === false && fullNote ?
            <View style={Styles.itemStyle}>
              <Text style={[Styles.weakColorStyle, { color: '#FF7F9C' }]}>{fullNote}</Text>
            </View>
          : null}
          {externalCode ?
            <View style={Styles.itemStyle}>
              <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {externalCode}</Text>
            </View>
          : null}
          <View style={Styles.item2Style}>
            <View>
              <Text style={Styles.weakColorStyle}>Nhận: {receiverName} - {receiverPhone}</Text>
              <Text style={[Styles.weakColorStyle, { marginTop: 5 }]}>{weight} g | {length}-{width}-{height} (cm3)</Text>
            </View>
            {pickFail ?
              <PickButton order={order} />
            : null}
            
          </View>
          <ActionButtons
            animated={animated}
            done={realDone}
            info={order}
            order={order}
            navigation={navigation}
            onSelectDateCase={(buttonIndex) => {
              onSelectDateCase(buttonIndex, order);
            }}
            resetAllButton={resetAllButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default OrderItem;
