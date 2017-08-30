import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, TouchableOpacity, ListView } from 'react-native';
import { 
  Content, Text, 
  Button,
  List
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import LocalGroup from '../../libs/LocalGroup';
import Utils from '../../libs/Utils';
import { updateOrderGroup, pdListFetch } from '../../actions';
import DataEmptyCheck from '../DataEmptyCheck';

let checkList = {};
class DeliveryGroupCreate extends Component {
  componentWillMount() {
    console.log('DeliveryGroupCreate: cwm !');
    
    const pds = this.props.pds;
    console.log(pds);
    
    const GroupLength = LocalGroup.getGroups().length + 1;
    const GroupName = `nhom${GroupLength}`;
    this.state = { GroupName };
    this.createDataSource(this.props);
    console.log(this.state.GroupName);
  }

  componentWillReceiveProps(nextProps) {
    console.log('DeliveryGroupCreate: cwrp');
    const list = nextProps.pds.DeliveryItems.filter(order => order.Group === null && !Utils.checkDeliveryComplete(order.CurrentStatus));
    checkList = {};
    list.forEach(order => { checkList[order.OrderID] = false; });
    this.createDataSource(nextProps);
  }
  
  onOrderChecked(OrderID) {
    console.log(`onOrderChecked OrderID = ${OrderID}`);
    //this.setState({ [OrderID]: !checkList[OrderID] });
    checkList[OrderID] = !checkList[OrderID];
    this.createDataSource(this.props);
  }
  onCreateGroup() {
    console.log('onCreateGroup pressed');

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
      console.log('createGroup: orderGroup = ');
      console.log(orderGroup);
      await LocalGroup.setOrdersGroups(orderGroup);

      //update store
      this.props.updateOrderGroup(orderGroup);


      //update new group name
      const GroupLength = LocalGroup.getGroups().length + 1;
      const NewGroupName = `nhom${GroupLength}`;
      this.setState({ GroupName: NewGroupName });
    } catch (error) {
      console.log('creategroup & add order group fail with error =');
      console.log(error);
    }
  }
  onResetGroup() {
    console.log('onCreateGroup pressed');

    this.resetGroup();
  }

  async resetGroup() {
    try {
      await LocalGroup.resetDB();
      this.props.pdListFetch();
      //update new group name
      // const GroupLength = LocalGroup.getGroups().length + 1;
      // const NewGroupName = `nhom${GroupLength}`;
      // this.setState({ GroupName: NewGroupName });
      // this.createDataSource(this.props);
    } catch (error) {
      console.log('resetGroup failed');
      console.log(error);
    }
  }
  
  createDataSource({ pds }) {
    const list = pds.DeliveryItems.filter(order => order.Group === null && !Utils.checkDeliveryComplete(order.CurrentStatus));
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
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
              {OrderCode}
            </Text>
            <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
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
    // const { pds } = this.props;
    console.log('DeliveryGroupCreate: render called, state =| datasource =');
    // console.log(pds);
    
    
    return (
      <Content style={{ backgroundColor: Colors.row }}>
        <View style={Styles.rowStyle}>
          <TextInput 
            style={{ height: 40, flex: 1, borderColor: 'gray', borderBottomWidth: 2, borderBottomColor: '#06B2F5' }}
            value={this.state.GroupName}
            onChangeText={(GroupName) => this.setState({ GroupName })}
          />
          <Button 
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
const mapStateToProps = ({ pd }) => {
  const { pds } = pd;
  return { pds };
};
export default connect(mapStateToProps, { updateOrderGroup, pdListFetch })(DeliveryGroupCreate);
