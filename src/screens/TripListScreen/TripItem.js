import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import accounting from 'accounting';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../libs/Utils';
import { navigateOnce } from '../../libs/Common';
import { 
  Icon, Button, Text
} from 'native-base';

import { Styles, DeliverGroupStyles } from '../../Styles';

class TripItem extends Component {
  componentWillMount() {
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.index === nextProps.index
      && this.props.activeSection === nextProps.activeSection
      && this.props.address === this.props.address
      && this.props.contactName === nextProps.contactName
      && this.props.contactPhone === this.props.contactPhone
      && this.props.estimateTotalServiceCost === this.props.estimateTotalServiceCost
      && this.props.ordersNum === nextProps.ordersNum
      && this.props.completedNum === nextProps.completedNum
      && this.props.type === nextProps.type
      && this.props.clientHubId === nextProps.clientHubId) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
  }

  onTripPressOnce = _.debounce(this.onTripPress, 300, { leading: true, trailing: false });
  onTripPress({ type, clientHubId }) {
    this.props.navigation.navigate('PickGroupDetail', { type, clientHubId });
  }

  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  goToReturnGroup(returnGroup) {
    if (returnGroup) {
      navigateOnce(this, 'ReturnGroupDetail', { pickGroup: returnGroup });
    }
  }
  renderHasReturnWarning({ type, clientHubId }) {
    if (type !== 'PICK') return null;
    const returnGroup = Utils.getReturnGroup(this.props.ReturnItems, clientHubId);
    if (!returnGroup) return null;
    return (
      <Button
        warning
        small
        transparent
        style={{ paddingLeft: 0 }}
        onPress={() => this.goToReturnGroup(returnGroup)}
      >
        <Text style={{ color: '#F3BD71', fontSize: 13, fontWeight: '600' }}>ĐƠN TRẢ</Text>
        <IC name='arrow-right' size={20} />
      </Button>
    );
  }
  render() {
    const { index, activeSection, address, contactName, contactPhone, estimateTotalServiceCost, ordersNum, completedNum, type, clientHubId } = this.props;
    if (!activeSection) {
      return null;
    } 
    const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
    
    return (
      <TouchableOpacity
        onPress={this.onTripPressOnce.bind(this, { type, clientHubId })}
        style={DeliverGroupStyles.content}
      >
        <View style={wrapperStyle}>
          <View style={[Styles.itemStyle, { justifyContent: 'space-between' }]}>
            <Text 
              style={[Styles.bigTextStyle, Styles.weakColorStyle]}
              numberOfLines={1}
            >
              {contactName}
            </Text>
            {this.renderCheckedIcon(ordersNum, completedNum)}
          </View>
          <View style={styles.rowStyle}>
            <Text
              style={[Styles.weakColorStyle]}
            >
              {address}
            </Text>
          </View>
          
          <View style={[Styles.item2Style, { paddingTop: 5 }]}>
            <Text style={[Styles.weakColorStyle]}>
              Đơn hàng: {completedNum}/{ordersNum}
            </Text>
            <Text style={[Styles.normalColorStyle]}>
            {accounting.formatNumber(estimateTotalServiceCost)} đ
            </Text>
          </View>
          <View style={[Styles.item2Style]}>
            <View>
              {this.renderHasReturnWarning({ type, clientHubId })}
            </View>
            <Button
              small
              transparent
              onPress={() => Utils.phoneCall(contactPhone, true)}
              style={{ paddingRight: 0 }}
            >
              <Icon name='call' />
              <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600' }}>SHOP</Text>
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  rowStyle: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2
  }
};

export default TripItem;
