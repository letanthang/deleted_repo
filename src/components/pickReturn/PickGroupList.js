import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { 
  Content,
  List,
  Button,
  Icon as IC
} from 'native-base';
import {
  Card 
} from 'react-native-elements';
import * as Communications from 'react-native-communications';

import Icon from 'react-native-vector-icons/FontAwesome';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';

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
    if (returnGroup) {
      this.props.navigation.navigate('PickGroupDetail', { pickGroup: returnGroup });
    }
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
        <Card containerStyle={Styles.tripWrapperStyle}>
            <View style={[Styles.itemStyle, { justifyContent: 'space-between' }]}>
              <Text 
                style={[Styles.bigTextStyle, Styles.normalColorStyle]} 
                numberOfLines={1}
              >
                [{DisplayOrder}] {ClientName}
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
              {TotalServiceCost} đ
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
                <IC name='call' />
                <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600' }}>SHOP</Text>
              </Button>
            </View>
          </Card>
      </TouchableOpacity>      
    );
  }
  renderHasReturnWarning(pickGroup) {
    if (!Utils.checkPickGroupHasRP(this.props.pds, pickGroup)) return null;
    return (
      <Button
        warning
        small
        transparent
        style={{ paddingLeft: 0 }}
        onPress={this.onPickToReturnPress(pickGroup).bind(this)}
      >
        <Text style={{ color: '#F3BD71', fontSize: 13, fontWeight: '600' }}>ĐƠN TRẢ</Text>
        <IC name='arrow-dropright' />
      </Button>
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    let pdType = this.props.pdType;
    pdType = pdType === undefined ? 1 : pdType;
    const done = this.props.done;
    console.log('====================================');
    console.log(`PickGroupList render! pdType = ${pdType}`);
    console.log('====================================');
    
    const pickList = this.props.pds.PickReturnItems.filter(pg => {
      if (done === undefined) {
        return pg.PickDeliveryType === pdType;
      } else {
        const ordersNum = pg.PickReturnSOs.length;
        const completedNum = pg.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
        return pg.PickDeliveryType === pdType && done === (ordersNum === completedNum);
      }
    });
    return (
      <Content style={{ backgroundColor: Colors.background }}>
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
