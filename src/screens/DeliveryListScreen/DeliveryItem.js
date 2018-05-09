import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { 
  Text, Badge
} from 'native-base';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';

class DeliveryItem extends Component {
  shouldComponentUpdate({ order }) {
    const old = this.props.order;
    const { code, status, nextStatus } = order;
    if (code === old.code && status === old.status && nextStatus === old.nextStatus ) {
      return false;
    }
    return true;
  }
  render() {
    // console.log('Render DeliveryItem');
    const { order, index, onDeliveryOrderPressOnce, renderStatusText } = this.props;
    const { receiverAddress, code, displayOrder, serviceName } = order;
    const wrapperStyle = index === 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
    
    return (
      <TouchableOpacity
        onPress={onDeliveryOrderPressOnce.bind(this, code)}
      >
        <View style={wrapperStyle}>
          <View style={Styles.item2Style}>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
              [{displayOrder}] {code}
            </Text>
            {serviceName ?
              <Badge>
                <Text>{serviceName}</Text>
              </Badge>
            : null}
          </View>
          <View style={Styles.itemStyle}>
            <Text style={[Styles.midTextStyle, Styles.weakColorStyle]}>
              {receiverAddress}
            </Text>
          </View>
          <View style={Styles.itemStyle}>
            {renderStatusText(order)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DeliveryItem;
