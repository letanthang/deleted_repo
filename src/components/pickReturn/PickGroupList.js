import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import accounting from 'accounting';
import { 
  Content,
  List,
  Button,
  Icon
} from 'native-base';
import {
  Card 
} from 'react-native-elements';
import * as Communications from 'react-native-communications';

import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import DataEmptyCheck from '../DataEmptyCheck';

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
  onPickToReturnPress(pickGroup) {
    const returnGroup = Utils.getReturnGroupFromPG(this.props.pds, pickGroup);
    console.log('PickGroupPress called ');
    console.log(pickGroup);
    this.goToReturnGroup(returnGroup);
  }
  goToReturnGroup(returnGroup) {
    if (returnGroup) {
      this.props.navigation.navigate('PickGroupDetail', { pickGroup: returnGroup });
    }
  }
  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  renderPickGroup(pickGroup) {
    console.log('pickGroup =');
    console.log(pickGroup);
    const { Address, CircleName, ClientName, DisplayOrder, ContactName, ContactPhone } = pickGroup;
    
    let TotalServiceCost = 0; 
    pickGroup.PickReturnSOs.forEach(order => { TotalServiceCost += order.CODAmount; });
    const ordersNum = pickGroup.PickReturnSOs.length;
    const completedNum = pickGroup.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
    return (
      <TouchableOpacity
        onPress={this.onPickGroupPress.bind(this, pickGroup)}
      >
        <Card containerStyle={Styles.tripWrapperStyle}>
            <View style={[Styles.itemStyle, { justifyContent: 'space-between' }]}>
              <Text 
                style={[Styles.bigTextStyle, Styles.normalColorStyle]} 
                numberOfLines={1}
              >
                {ClientName}
              </Text>
              {this.renderCheckedIcon(ordersNum, completedNum)}
            </View>
            <View style={Styles.itemStyle}>
              <Text 
                style={[Styles.bigTextStyle, Styles.weakColorStyle]}
                numberOfLines={1}
              >
                {ContactName}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text
                style={[Styles.weakColorStyle]}
              >
                {Address}
              </Text>              
            </View>
            
            <View style={[Styles.item2Style, { paddingTop: 5 }]}>
              <Text style={[Styles.weakColorStyle]}>
                Đơn hàng: {completedNum}/{ordersNum}
              </Text>
              <Text style={[Styles.normalColorStyle]}>
              {accounting.formatNumber(TotalServiceCost)} đ
              </Text>
            </View>
            <View style={[Styles.item2Style]}>
              <View>
                {this.renderHasReturnWarning(pickGroup)}
              </View>
              <Button
                small
                transparent
                onPress={() => Communications.phonecall(ContactPhone, true)}
                style={{ paddingRight: 0 }}
              >
                <Icon name='call' />
                <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600' }}>SHOP</Text>
              </Button>
            </View>
          </Card>
      </TouchableOpacity>
    );
  }
  renderHasReturnWarning(pickGroup) {
    console.log('renderHasReturnWarning called!');
    if (pickGroup.PickDeliveryType != '1') return null;
    const returnGroup = Utils.getReturnGroupFromPG(this.props.pds, pickGroup);
    console.log(returnGroup);
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
        <Icon name='arrow-dropright' />
      </Button>
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const { done, pds, pdType = 1 } = this.props;
    const Items = (pdType === 1) ? pds.PickItems : pds.ReturnItems;

    console.log('====================================');
    console.log(`PickGroupList render! pdType = ${pdType}`);
    console.log('====================================');
    
    const pickList = Items.filter(pg => {
      if (done !== undefined) {
        const ordersNum = pg.PickReturnSOs.length;
        const completedNum = pg.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
        return done === (ordersNum === completedNum);
      }
      return true;
    });
    console.log(Items);
    console.log(pickList);
    return (
      <Content style={{ backgroundColor: Colors.background }}>
      <DataEmptyCheck
        data={pickList}
        message='Không có dữ liệu'
      >
        <List
          dataArray={pickList}
          renderRow={this.renderPickGroup.bind(this)}
        />
      </DataEmptyCheck>
      
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
    fontSize: 17, 
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
  
});

const mapStateToProps = ({ pd }) => {
  const { pds } = pd;
  return { pds };
};

export default connect(mapStateToProps)(PickGroupList);
