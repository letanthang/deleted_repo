import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, ListView } from 'react-native';
import { 
  Content, Text, 
  Button,
  List
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Styles, DeliverGroupStyles } from '../Styles';

const checkList = {};
class DeliveryGroupCreate extends Component {
  constructor(props) {
    console.log('constructor called!');
    super(props);
    const { deliveryList } = props;
    deliveryList.forEach(order => { checkList[order.OrderID] = false; });
  }

  componentWillMount() {
    console.log('DeliveryGroupCreate: cwm !');
    console.log(this.props.deliveryList);
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('DeliveryGroupCreate: cwrp');
    this.createDataSource(nextProps);
  }
  
  onOrderChecked(OrderID) {
    console.log(`onOrderChecked OrderID = ${OrderID}`);
    //this.setState({ [OrderID]: !checkList[OrderID] });
    checkList[OrderID] = !checkList[OrderID];
    this.createDataSource(this.props);
  }
  
  createDataSource({ deliveryList }) {
    const list = deliveryList;
    list.forEach((order, index) => {
      list[index].groupChecked = checkList[order.OrderID];
    });

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }); 
    this.setState({ dataSource: ds.cloneWithRows(list) });
    console.log('ds changed');
  }

  renderOrder(order) {
    //console.log(`renderOrder is called! checked = ${this.state[OrderID]}`);
    //console.log(order);

    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount, groupChecked } = order;
    return (
      <TouchableOpacity
        onPress={this.onOrderChecked.bind(this, OrderID)}
      >
        <View style={Styles.rowStyle}>
          <View style={[DeliverGroupStyles.col1Style]}>
            <Text style={[Styles.bigTextStyle, Styles.normalColor]}>
              {OrderCode}
            </Text>
            <Text style={[Styles.smallTextStyle, Styles.weakColor]}>
              {Address}
            </Text>
          </View>
          <View
            style={DeliverGroupStyles.col2Style}
          >
            <CheckBox 
              style={{ backgroundColor: '#fff' }}
              onPress={this.onOrderChecked.bind(this, OrderID)}
              checked={groupChecked}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('DeliveryGroupCreate: render called, state =| datasource =');
    return (
      <Content style={{ backgroundColor: '#fff' }}>
        <View style={Styles.rowStyle}>
          <TextInput 
            style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 2, borderBottomColor: '#06B2F5' }}
            value="Nhom 1"
          />
          <Button 
            small
            light
          >
            <Text>Tạo Nhóm</Text>
          </Button>
        </View> 
        <ListView
          dataSource={this.state.dataSource}
          renderRow={order => this.renderOrder(order)}
        />
      </Content>
    );
  }
}

export default DeliveryGroupCreate;
