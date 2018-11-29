import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import accounting from 'accounting';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import ICO from 'react-native-vector-icons/Ionicons';
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
      && this.props.senderAddress === this.props.senderAddress
      && this.props.senderName === nextProps.senderName
      && this.props.senderPhone === this.props.senderPhone
      && this.props.estimateTotalServiceCost === this.props.estimateTotalServiceCost
      && this.props.ordersNum === nextProps.ordersNum
      && this.props.completedNum === nextProps.completedNum
      && this.props.type === nextProps.type
      && this.props.senderHubId === nextProps.senderHubId) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
  }

  onTripPressOnce = _.debounce(this.onTripPress, 300, { leading: true, trailing: false });
  onTripPress({ type, senderHubId, ordersNum, pointId }) {
    // console.log(type, senderHubId);
    if (type === 'PICK') {
      this.props.navigation.navigate('PickGroupDetail', { type, senderHubId });
    } else if (type === 'TRANSIT_IN') {
      if (ordersNum === 0) {
        this.props.navigation.navigate('CvsPrepare', { type, senderHubId, pointId });
      } else {
        this.props.navigation.navigate('CvsDetail', { type, senderHubId, pointId });
      }
    } 
  }

  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  goToReturnGroup(returnGroup) {
    if (returnGroup) {
      const { senderHubId } = returnGroup;
      navigateOnce(this, 'ReturnGroupDetail', { type: 'RETURN', senderHubId });
    }
  }
  renderHasReturnWarning({ type, senderHubId }) {
    if (type !== 'PICK') return null;
    const returnGroup = Utils.getReturnGroup(this.props.ReturnItems, senderHubId);
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
    const { index, activeSection, senderAddress, senderName, senderPhone, estimateTotalServiceCost, ordersNum, pointId, completedNum, type, senderHubId } = this.props;
    if (!activeSection) {
      return null;
    } 
    const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
    
    return (
      <TouchableOpacity
        onPress={this.onTripPressOnce.bind(this, { type, senderHubId, ordersNum, pointId })}
        style={DeliverGroupStyles.content}
      >
        <View style={wrapperStyle}>
          <View style={[Styles.itemStyle, { justifyContent: 'space-between' }]}>
            <Text 
              style={[Styles.bigTextStyle, Styles.weakColorStyle]}
              numberOfLines={1}
            >
              {senderName}
            </Text>
            {this.renderCheckedIcon(ordersNum, completedNum)}
          </View>
          <View style={styles.rowStyle}>
            <Text
              style={[Styles.weakColorStyle]}
            >
              {senderAddress}
            </Text>
          </View>
          
          <View style={[Styles.item2Style, { paddingTop: 5 }]}>
            <Text style={[Styles.weakColorStyle]}>
              Đơn hàng: {completedNum}/{ordersNum}
            </Text>
            { type === 'PICK' ?
            <Text style={[Styles.normalColorStyle]}>
            {accounting.formatNumber(estimateTotalServiceCost)} đ
            </Text>
            : null}
          </View>
          <View style={[Styles.item2Style]}>
            <View>
              {this.renderHasReturnWarning({ type, senderHubId })}
            </View>
            <TouchableOpacity
              onPress={() => Utils.phoneCall(senderPhone, true)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <ICO name='ios-call-outline' size={25} color='#006FFF' />
              <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600', marginLeft: 8 }}>SHOP</Text>
            </TouchableOpacity>
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
