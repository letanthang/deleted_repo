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
  onTripPress({ type, senderHubId }) {
    this.props.navigation.navigate('CvsDetail', { type, senderHubId });
  }

  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  
  render() {
    const { index, activeSection, senderAddress, senderName, senderPhone, estimateTotalServiceCost, ordersNum, completedNum, type, senderHubId } = this.props;
    if (!activeSection) {
      return null;
    } 
    const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
    
    return (
      <TouchableOpacity
        onPress={this.onTripPressOnce.bind(this, { type, senderHubId })}
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
            <Text>{completedNum}/{ordersNum}</Text>
          </View>
          
          <View style={Styles.item2Style}>
            <Text style={[Styles.weakColorStyle, { flex: 0.9}]}>
              {senderAddress}
            </Text>
            <TouchableOpacity
              onPress={() => Utils.phoneCall(senderPhone, true)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <ICO name='ios-call-outline' size={25} color='#006FFF' />
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
