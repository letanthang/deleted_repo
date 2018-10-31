import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { accounting } from 'accounting';
import OrderStatusText from '../../components/OrderStatusText';
import ActionButtons from './ActionButtons';
import FormButton from '../../components/FormButton';
import { Styles, Colors } from '../../Styles';
import Utils from '../../libs/Utils';

class OrderItem extends Component {
  shouldComponentUpdate({ order, isDelivering, weight, width, length, height }) {
    const old = this.props.order;
    if (order.isUpdated === old.isUpdated
      && order.isSucceeded === old.isSucceeded
      && order.willSucceeded === old.willSucceeded
      && order.note === old.note
      && weight === this.props.weight
      && width === this.props.width
      && length === this.props.length
      && height === this.props.height
      && isDelivering === this.props.isDelivering) {
      return false;
    }
    return true;
  }

  render() {
    // console.log('OrderItem render!');
    console.log("PickGroupDetailScreen => OrderItem => render");
    
    const { order, animated, acceptDeliverPress, onOrderPress, isDelivering, onSelectDateCase, resetAllButton, navigation } = this.props;
    const { 
      orderCode, receiverName, receiverPhone,
      height, width, weight, length, status,
      externalCode, collectAmount, willSucceeded, note, newDate, pickWarehouseId,
      deliverWarehouseId, done
    } = order;

    const nearDone = Utils.checkCompleteForUnsync(order);
    const backgroundColor = nearDone ? '#DFDFEF' : Colors.row;
    const deliverable = done && pickWarehouseId === deliverWarehouseId && Utils.checkSuccess(order);
    const deliverStatus = isDelivering ? 'Đã nhận giao' : 'Nhận đi giao';
    const fullNote = Utils.getFullNote(note, newDate);
    // console.log('OrderItem render!', fullNote, willSucceeded, done);
    return (
      <TouchableOpacity
        onPress={onOrderPress.bind(this, order)}
      >
        <View style={[Styles.orderWrapperStyle, { backgroundColor }]}>
          <View style={Styles.item2Style}>
            <View style={{ flexDirection: 'row' }}>
              <View><Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{orderCode}</Text></View>
              <OrderStatusText
                order={order}
                style={{ marginLeft: 10 }}
              />
            </View>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(collectAmount)} đ</Text>
          </View>
          {willSucceeded === false && done === false ?
            <View style={Styles.itemStyle}>
              <Text style={[Styles.weakColorStyle, { color: '#FF7F9C' }]}>{fullNote}</Text>
            </View>
          : null}
          {externalCode ?
            <View style={Styles.itemStyle}>
              <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {externalCode}</Text>
            </View>
          : null}
          <View style={Styles.itemStyle}>
            <Text style={Styles.weakColorStyle}>Nhận: {receiverName} - {receiverPhone}</Text>

            
          </View>
          <View style={Styles.item2Style}>
            <Text style={Styles.weakColorStyle}>{weight} g | {length}-{width}-{height} (cm3)</Text>
            {/* {deliverable ?
              <FormButton
                disabled={isDelivering}
                theme='theme1'
                text={deliverStatus}
                width={100}
                onPress={acceptDeliverPress.bind(this, order)}
              /> : null} */}
          </View>
          <ActionButtons
            animated={animated}
            done={done}
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
