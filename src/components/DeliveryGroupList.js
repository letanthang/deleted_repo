import React, { Component } from 'react';
import { View } from 'react-native';
import { 
  Content, Card, CardItem, Text,
  List, ListItem, Item, Right, Badge 
} from 'native-base';

class DeliveryGroupList extends Component {
  componentWillMount() {
    console.log('DeliveryGroupList cwm');
    console.log(this.props.deliveryList);
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('DeliveryGroupList cdu');
    console.log(this.props.deliveryList);
  }
  
  renderOrder(order) {
    console.log(order);
    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount } = order;
    return (
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
          <Text>
            {CurrentStatus}
          </Text>
          </View>
        </CardItem>
      </Card>
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    return (
      <Content>
      <List
        dataArray={this.props.deliveryList}
        renderRow={this.renderOrder.bind(this)}
      />
      </Content>
    );
  }
}

export default DeliveryGroupList;
