import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { 
  Content, Card, CardItem, Text,
  List, ListItem, Item, Right, Badge 
} from 'native-base';
import { connect } from 'react-redux';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';

class DeliveryGroupList extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('DeliveryGroupList CWM');
    console.log('====================================');
    this.state = { keyword: '' };
  }
  componentWillUpdate() {
    
  }
  componentWillReceiveProps(nextProps) {
    console.log('DeliveryByGroup cwrp');
    const { keyword } = nextProps;
    this.setState({ keyword });
  }
  componentDidUpdate(prevProps, prevState) {

  }
  onDeliveryOrderPress(OrderID) {
    console.log('onDeliveryOrderPress called with OrderID =');
    console.log(OrderID);
    this.props.navigation.navigate('DeliveryOrder', { OrderID });
  }

  renderStatusText(status) {
    const displayStatus = Utils.getDisplayStatus(status);
    let textColor = '#65BD68';
    if (displayStatus === 'Đã giao') {
      textColor = 'grey';
    } else if (displayStatus === 'Giao lỗi') {
      textColor = '#E82027';
    }
    return (
      <Text style={{ color: textColor }}>
        {displayStatus}
      </Text>
    );
  }

  renderOrder(order) {
    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount, DisplayOrder } = order;
    return (
      <TouchableOpacity
        onPress={this.onDeliveryOrderPress.bind(this, OrderID)}
      >
        <View style={Styles.orderWrapperStyle}>
          <View style={Styles.item2Style}>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
              [{DisplayOrder}] {OrderCode}
            </Text>
            <Badge>
              <Text>6h</Text>
            </Badge>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={[Styles.midTextStyle, Styles.weakColorStyle]}>
              {Address}
            </Text>
          </View>
          <View style={Styles.itemStyle}>
            {this.renderStatusText(CurrentStatus)}
          </View>
        </View>
      </TouchableOpacity>
      
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const deliveryList = this.props.deliveryList.filter(order => this.state.keyword === '' 
      || order.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase()));
    console.log(deliveryList);
    return (
      <Content style={{ backgroundColor: Colors.background }}>
      <List
        dataArray={deliveryList}
        renderRow={this.renderOrder.bind(this)}
      />
      </Content>
    );
  }
}

const mapStateToProps = ({ pd }) => {
  const { pds } = pd;
  return { pds };
};

export default connect(mapStateToProps)(DeliveryGroupList);
