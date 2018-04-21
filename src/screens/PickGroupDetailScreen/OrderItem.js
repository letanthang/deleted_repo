import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { accounting } from 'accounting';
import OrderStatusText from '../../components/OrderStatusText';
import ActionButtons from './ActionButtons';
import FormButton from '../../components/FormButton';
import { Styles, Colors } from '../../Styles';
import Utils from '../../libs/Utils';

class OrderItem extends Component {
  shouldComponentUpdate({ order }) {
    const old = this.props.order;
    if (order.status === old.status
      && order.nextStatus === old.nextStatus
      && order.note === old.note) {
      return false;
    }
    return true;
  }

  render() {
    // console.log('OrderItem render!');
    const { order, animated, acceptDeliverPress, onOrderPress, checkDelivering, onSelectDateCase } = this.props;
    const { 
      code, receiverName, receiverPhone,
      height, width, weight, length, status,
      ExternalCode, moneyCollect, success, note, newDate, pickWarehouseId, 
      deliverWarehouseId, done
    } = order;

    const realDone = done;
    const nearDone = Utils.checkPickCompleteForUnsync(order);
    const backgroundColor = nearDone ? '#DFDFEF' : Colors.row;
    const deliverable = realDone && pickWarehouseId === deliverWarehouseId && Utils.checkPickSuccess(status);
    const isDelivering = checkDelivering(order);
    const deliverStatus = isDelivering ? 'Đã nhận giao' : 'Nhận đi giao';
    const fullNote = Utils.getFullNote(note, newDate);
    return (
      <TouchableOpacity
        onPress={onOrderPress.bind(this, order)}
      >
        <View style={[Styles.orderWrapperStyle, { backgroundColor }]}>
          <View style={Styles.item2Style}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{code}</Text>
              <OrderStatusText 
                order={order}
                style={{ marginLeft: 10 }}
              />
            </View>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(moneyCollect)} đ</Text>
          </View>
          {success === false && realDone === false ?
          <View style={Styles.itemStyle}>
            <Text style={[Styles.weakColorStyle, { color: '#FF7F9C' }]}>{fullNote}</Text>
          </View>
          : null}
          {ExternalCode ?
          <View style={Styles.itemStyle}>
            <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {ExternalCode}</Text>
          </View>
          : null}
          <View style={Styles.itemStyle}>
            <Text style={Styles.weakColorStyle}>Nhận: {receiverName} - {receiverPhone}</Text>

            
          </View>
          <View style={Styles.item2Style}>
            <Text style={Styles.weakColorStyle}>{weight} g | {length}-{width}-{height} (cm3)</Text>
            {deliverable ?
            <FormButton
              disabled={isDelivering}
              theme='theme1'
              text={deliverStatus}
              width={100}
              onPress={acceptDeliverPress.bind(this, order)}
            /> : null}
          </View>
          <ActionButtons
            animated={animated}
            done={realDone}
            info={order}
            order={order}
            onSelectDateCase={buttonIndex => {
              onSelectDateCase(buttonIndex, order);
            }} 
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default OrderItem;
