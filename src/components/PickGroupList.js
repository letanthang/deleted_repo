import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { 
  Content, Card, CardItem, Text,
  List, Right 
} from 'native-base';
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
  
  renderPickGroup(pickGroup) {
    console.log(pickGroup);
    const { Address, CircleName, ClientName, DisplayOrder } = pickGroup;
    //const TotalServiceCost = pickGroup.PickReturnSOs.reduce((a, b) => a.ServiceCost + b.ServiceCost, 0);
    let TotalServiceCost = 0; 
    pickGroup.PickReturnSOs.forEach(order => { TotalServiceCost += order.ServiceCost; });
    const ordersNum = pickGroup.PickReturnSOs.length;
    const completedNum = pickGroup.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
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
                Don hang: {completedNum}/{ordersNum}
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

export default PickGroupList;
