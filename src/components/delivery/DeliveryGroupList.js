import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { 
  Content, Card, CardItem, Text, Body,
  List, ListItem, Item, Right, Badge 
} from 'native-base';
import { connect } from 'react-redux';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import StatusText from '../StatusText';
import DataEmptyCheck from '../DataEmptyCheck';


class DeliveryGroupList extends Component {
  componentWillMount() {
    this.state = { keyword: '' };
  }
  componentWillUpdate() {
    
  }
  componentWillReceiveProps(nextProps) {
    const { keyword } = nextProps;
    this.setState({ keyword });
  }
  componentDidUpdate(prevProps, prevState) {

  }
  onDeliveryOrderPress(OrderID) {
    this.props.navigation.navigate('DeliveryOrder', { OrderID });
  }

  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
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
            {this.renderStatusText(order)}
          </View>
        </View>
      </TouchableOpacity>
      
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const deliveryList = this.props.deliveryList.filter(order => this.state.keyword === '' 
      || order.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase()));

    return (
      <Content style={{ backgroundColor: Colors.background }}>
        <DataEmptyCheck 
          data={deliveryList}
          message='Không có dữ liệu'
        >
          <List
            dataArray={deliveryList}
            renderRow={this.renderOrder.bind(this)}
          />
        </DataEmptyCheck>
      </Content>
    ); 
  }
}

const mapStateToProps = ({ pd }) => {
  const { pds } = pd;
  return { pds };
};

export default connect(mapStateToProps)(DeliveryGroupList);
