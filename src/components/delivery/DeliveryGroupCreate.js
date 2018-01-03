import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, TouchableOpacity, ListView } from 'react-native';
import { 
  Content, Text, 
  Button,
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import LocalGroup from '../../libs/LocalGroup';
import Utils from '../../libs/Utils';
import { get3Type } from '../../selectors';
import { updateOrderGroup, pdListFetch } from '../../actions';
import DataEmptyCheck from '../DataEmptyCheck';

let checkList = {};
class DeliveryGroupCreate extends Component {
  componentWillMount() {
    
    const GroupLength = LocalGroup.getGroups().length + 1;
    const GroupName = `nhom${GroupLength}`;
    const dataSource = this.getDataSource(this.props);
    this.setState({ GroupName, dataSource });
  }

  componentWillReceiveProps(nextProps) {
    const list = nextProps.DeliveryItems.filter(order => order.Group === null && !Utils.checkDeliveryComplete(order.CurrentStatus));
    checkList = {};
    list.forEach(order => { checkList[order.OrderID] = false; });
    this.createDataSource(nextProps);
  }
  
  onOrderChecked(OrderID) {
    //this.setState({ [OrderID]: !checkList[OrderID] });
    checkList[OrderID] = !checkList[OrderID];
    this.createDataSource(this.props);
  }
  onCreateGroup() {

    this.createGroup(this.state.GroupName);
  }

  async createGroup(GroupName) {
    try {
      //update local storage
      await LocalGroup.addGroup(GroupName);
      const orderGroup = {};
      _.each(checkList, (value, prop) => {
        if (value) {
          orderGroup[prop] = GroupName;
        }
      });
      await LocalGroup.setOrdersGroups(orderGroup);

      //update store
      this.props.updateOrderGroup(orderGroup);


      //update new group name
      const GroupLength = LocalGroup.getGroups().length + 1;
      const NewGroupName = `nhom${GroupLength}`;
      this.setState({ GroupName: NewGroupName });
    } catch (error) {
      //log error
    }
  }
  onResetGroup() {
    this.resetGroup();
  }

  async resetGroup() {
    try {
      await LocalGroup.resetDB();
      this.props.pdListFetch();
    } catch (error) {
      // log error
    }
  }
  
  createDataSource({ DeliveryItems }) {
    
    const dataSource = this.getDataSource({ DeliveryItems });
    this.setState({ dataSource });
  }

  getDataSource({ DeliveryItems }) {
    const list = DeliveryItems.filter(order => order.Group === null && !Utils.checkDeliveryComplete(order.CurrentStatus));
    list.forEach((order, index) => {
      list[index].groupChecked = checkList[order.OrderID];
    });

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(list);
  }

  renderOrder(order) {
    const { DeliveryAddress, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount, groupChecked } = order;
    return (
      <TouchableOpacity
        onPress={this.onOrderChecked.bind(this, OrderID)}
      >
        <View style={Styles.rowStyle}>
          <View style={[DeliverGroupStyles.col1Style]}>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
              {OrderCode}
            </Text>
            <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
              {DeliveryAddress}
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
    if (!this.state.dataSource) return null;
    
    
    return (
      <Content style={{ backgroundColor: Colors.row }}>
        <View style={Styles.rowStyle}>
          <TextInput 
            style={{ height: 40, flex: 1 }}
            value={this.state.GroupName}
            onChangeText={(GroupName) => this.setState({ GroupName })}
          />
          <Button
            style={{ marginLeft: 4, marginRight: 4 }} 
            small
            light
            onPress={this.onCreateGroup.bind(this)}
          >
            <Text>Tạo Nhóm</Text>
          </Button>
          <Button 
            small
            light
            onPress={this.onResetGroup.bind(this)}
          >
            <Text>Reset</Text>
          </Button>
        </View> 
        <DataEmptyCheck
          data={this.state.dataSource.getRowCount()}
          message='Không có dữ liệu'
        >
          <ListView
            dataSource={this.state.dataSource}
            renderRow={order => this.renderOrder(order)}
          />
        </DataEmptyCheck>
        
      </Content>
    );
  }
}
const mapStateToProps = (state) => {
  const { DeliveryItems } = get3Type(state);
  return { DeliveryItems };
};
export default connect(mapStateToProps, { updateOrderGroup, pdListFetch })(DeliveryGroupCreate);
