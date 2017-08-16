import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { 
  Content, Card, CardItem, Text,
  List, ListItem, Item, Right, Badge 
} from 'native-base';
import { connect } from 'react-redux';
import Utils from '../libs/Utils';

class DeliveryGroupList extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('DeliveryGroupList CWM');
    console.log('====================================');
    this.state = { keyword: '' };
  }
  componentWillUpdate() {
    
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
        <Card>
          <CardItem header>
            <Text>
              [{DisplayOrder}] {OrderCode}
            </Text>
            <Right>
              <Badge>
                <Text>6h</Text>
              </Badge>
            </Right>
          </CardItem>
          <CardItem>
            <View style={{ flex: 1 }}>          
            <Text>
              {Address}
            </Text>
            <Item style={{ }} />
            {this.renderStatusText(CurrentStatus)}
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
      
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const deliveryList = this.props.deliveryList.filter(order => this.state.keyword === '' 
      || order.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase()));
    console.log(deliveryList);
    return (
      <Content style={{ backgroundColor: '#eee' }}>
      <SearchBar
        round
        lightTheme
        onChangeText={(text) => this.setState({ keyword: text.trim() })}
        value={this.state.keyword}
        placeholder='Type here...'
      />
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
