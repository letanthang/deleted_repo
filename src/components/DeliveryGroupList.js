import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { 
  Content, Card, CardItem, Text,
  List, ListItem, Item, Right, Badge 
} from 'native-base';
import Utils from '../libs/Utils';

class DeliveryGroupList extends Component {
  componentWillMount() {
    
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
    let textColor = '#65BD68';
    if (status === 'WaitingToFinish') {
      textColor = 'grey';
    }
    return (
      <Text style={{ color: textColor }}>
        {Utils.getDisplayStatus(status)}
      </Text>
    );
  }

  renderOrder(order) {
    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount } = order;
    return (
      <TouchableOpacity
        onPress={this.onDeliveryOrderPress.bind(this, OrderID)}
      >
        <Card>
          <CardItem header>
            <Text>
              {OrderCode}
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
    return (
      <Content style={{ backgroundColor: '#eee' }}>
      <List
        dataArray={this.props.deliveryList}
        renderRow={this.renderOrder.bind(this)}
      />
      </Content>
    );
  }
}

export default DeliveryGroupList;
