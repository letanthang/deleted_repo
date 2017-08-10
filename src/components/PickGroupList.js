import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { 
  Content,
  List,
  Button
} from 'native-base';
import {
  Card 
} from 'react-native-elements';
import * as Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/FontAwesome';

import Utils from '../libs/Utils';

class PickGroupList extends Component {
  componentWillMount() {
  
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  onPickGroupPress(pickGroup) {
    console.log('PickGroupPress called ');
    console.log(pickGroup);
    this.props.navigation.navigate('PickGroupDetail', { pickGroup });
  }
  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <Icon name='check-circle-o' size={25} color='green' />;
    }
    return null;
  }
  renderPickGroup(pickGroup) {
    console.log('pickGroup =');
    console.log(pickGroup);
    const { Address, CircleName, ClientName, DisplayOrder, ContactName, ContactPhone } = pickGroup;
    
    let TotalServiceCost = 0; 
    pickGroup.PickReturnSOs.forEach(order => { TotalServiceCost += order.ServiceCost; });
    const ordersNum = pickGroup.PickReturnSOs.length;
    const completedNum = pickGroup.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
    return (
      <TouchableOpacity
        onPress={this.onPickGroupPress.bind(this, pickGroup)}
      >
        <Card containerStyle={styles.tripContainer}>
            <View style={[styles.rowStyle, { justifyContent: 'space-between' }]}>
              <Text 
                style={styles.bigTextStyle} 
                numberOfLines={1}
              >
                [{DisplayOrder}] {ClientName}
              </Text>
              {this.renderCheckedIcon(ordersNum, completedNum)}
            </View>
            <View style={styles.rowStyle}>
              <Text 
                style={styles.bigTextStyle}
                numberOfLines={1}
              >
                {ContactName}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text>
                {Address}
              </Text>              
            </View>
            <View style={styles.rowStyle}>
              <Text>
                Tổng thu: {TotalServiceCost} d
              </Text>
            </View>
            <View style={[styles.rowStyle, { paddingTop: 5 }]}>
              <Text style={styles.midTextStyle}>
                Đơn hàng: {completedNum}/{ordersNum}
              </Text>
            </View>
            <View style={[styles.rowStyle, styles.rightStyle]}>
              <Button
                small
                transparent
                onPress={() => Communications.phonecall(ContactPhone, true)}
              >
                <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600' }}>GỌI ĐIỆN CHO SHOP</Text>
              </Button>
            </View>
          </Card>
      </TouchableOpacity>      
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    let pdType = this.props.pdType;
    pdType = pdType === undefined ? 1 : pdType;
    console.log('====================================');
    console.log(`PickGroupList render! pdType = ${pdType}`);
    console.log('====================================');
    const pickList = this.props.pds.PickReturnItems.filter(pg => pg.PickDeliveryType === pdType);
    return (
      <Content style={{ backgroundColor: '#eee' }}>
      <List
        dataArray={pickList}
        renderRow={this.renderPickGroup.bind(this)}
      />
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2
  },
  bigTextStyle: {
    fontSize: 19, 
    fontWeight: '500'
  },
  midTextStyle: {
    fontSize: 15, 
    fontWeight: '500'
  },
  rightStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 0
  },
  tripContainer: {
    padding: 8,
    margin: 8,
    paddingBottom: 0
  }
}); 

export default PickGroupList;
