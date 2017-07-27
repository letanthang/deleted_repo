import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { 
  Content, Card, CardItem, Text,
  List, Right 
} from 'native-base';

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
  
  renderPickGroup(pickGroup) {
    console.log(pickGroup);
    const { Address, CircleName, ClientName, DisplayOrder } = pickGroup;
    //const TotalServiceCost = pickGroup.PickReturnSOs.reduce((a, b) => a.ServiceCost + b.ServiceCost, 0);
    let TotalServiceCost = 0; 
    pickGroup.PickReturnSOs.forEach(order => { TotalServiceCost += order.ServiceCost; });
    return (
      <TouchableOpacity
        onPress={this.onPickGroupPress.bind(this, pickGroup)}
      >
        <Card>
            <CardItem header>
              <Text>
                [{DisplayOrder}] {ClientName} {CircleName}
              </Text>
            </CardItem>
            <CardItem>
              <Text>
                {Address}
              </Text>              
            </CardItem>
            <CardItem>
              <Text>
                Tong thu: {TotalServiceCost} d
              </Text>
            </CardItem>
            <CardItem footer>
              <Text>
                Don hang: {0}/{pickGroup.PickReturnSOs.length}
              </Text>
            </CardItem>
            <CardItem>
              <Right>
                <Text style={{ color: '#00b0ff' }}>GỌI ĐIỆN CHO SHOP</Text>
              </Right>
            </CardItem>
          </Card>
      </TouchableOpacity>      
    );
  }
  render() {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const pickList = this.props.pds.PickReturnItems.filter(pg => pg.PickDeliveryType === 1);
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

export default PickGroupList;
