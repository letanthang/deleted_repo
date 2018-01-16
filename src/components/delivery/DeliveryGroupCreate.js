import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { 
  Content, Text, 
  Button,
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import LocalGroup from '../../libs/LocalGroup';
import Utils from '../../libs/Utils';
import { get3Type } from '../../selectors';
import { pdListFetch, toggleOrderGroup, updateOrders, createGroup } from '../../actions';

class DeliveryGroupCreate extends Component {
  componentWillMount() {
    const groupLength = Object.keys(this.props.groups) - 1;
    this.state = { groupName: `Nhóm ${groupLength}` };
  }
  
  onOrderChecked(OrderID) {
    this.props.toggleOrderGroup(OrderID);
  }
  onCreateGroup(items) {
    const list = items.filter(o => o.groupChecked === true);
    const orders = {};
    list.forEach(o => {
      orders[o.OrderID] = _.clone(o);
      orders[o.OrderID].group = this.state.groupName;
    });
    this.props.createGroup(this.state.groupName);
    this.props.updateOrders(orders);

    const groupLength = Object.keys(this.props.groups);
    const newGroupName = `Nhóm ${groupLength}`;
    this.setState({ groupName: newGroupName });
  }

  onResetGroup() {
  }

  render() {
    const items = this.props.DeliveryItems.filter(o => o.group === undefined && !Utils.checkDeliveryComplete(o.CurrentStatus));
    console.log(items); 
    return (
      <Content style={{ backgroundColor: Colors.row }}>
        <View style={Styles.rowStyle}>
          <TextInput 
            style={{ height: 40, flex: 1 }}
            value={this.state.groupName}
            onChangeText={(groupName) => this.setState({ groupName })}
          />
          <Button
            style={{ marginLeft: 4, marginRight: 4 }} 
            small
            light
            onPress={this.onCreateGroup.bind(this, items)}
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
        
          <FlatList
            data={items}
            renderItem={({ item }) => {
              const order = item;
              const { DeliveryAddress, OrderCode, OrderID, groupChecked } = order;
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
            }}
          />
        
      </Content>
    );
  }
}
const mapStateToProps = (state) => {
  const { groups } = state.pd;
  const { DeliveryItems } = get3Type(state);
  return { DeliveryItems, groups };
};

export default connect(mapStateToProps, { pdListFetch, toggleOrderGroup, updateOrders, createGroup })(DeliveryGroupCreate);
