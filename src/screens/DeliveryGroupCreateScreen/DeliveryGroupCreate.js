import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { 
  Content, Text, 
  Button,
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import Utils from '../../libs/Utils';
import { get3Type } from '../../selectors';
import { pdListFetch, toggleOrderGroup, updateOrders, createGroup, resetGroup } from '../../actions';

class DeliveryGroupCreate extends Component {
  
  componentWillMount() {
    const groupLength = Object.keys(this.props.groups).length - 1;
    this.setState({ groupName: `Nhóm ${groupLength}` });
  }
  
  onOrderChecked(orderCode) {
    this.props.toggleOrderGroup(orderCode);
  }
  onCreateGroup(items) {
    const list = items.filter(o => o.groupChecked === true);
    const orders = {};
    list.forEach(o => {
      const key = Utils.getKey(o.orderCode, 2);
      orders[key] = _.clone(o);
      orders[key].group = this.state.groupName;
    });
    this.props.createGroup(this.state.groupName);
    this.props.updateOrders(orders);

    const groupLength = Object.keys(this.props.groups).length;
    const newGroupName = `Nhóm ${groupLength}`;
    this.setState({ groupName: newGroupName });
  }

  onResetGroup() {
    Alert.alert('Xoá nhóm', 'Bạn có chắc xoá hết nhóm để tạo lại?', 
    [
      { text: 'Huỷ', onPress: () => {} },
      { text: 'Đồng ý', onPress: () => this.props.resetGroup() },
    ]);
  }

  render() {
    const items = this.props.DeliveryItems.filter(o => o.group === undefined && !o.done);
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
            keyExtractor={(item, index) => item.orderCode}
            renderItem={({ item }) => {
              const order = item;
              const { deliveryAddress, orderCode, groupChecked } = order;
              return (
                <TouchableOpacity
                  onPress={this.onOrderChecked.bind(this, orderCode)}
                >
                  <View style={Styles.rowStyle}>
                    <View style={[DeliverGroupStyles.col1Style]}>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                        {orderCode}
                      </Text>
                      <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                        {deliveryAddress}
                      </Text>
                    </View>
                    <View
                      style={DeliverGroupStyles.col2Style}
                    >
                      <CheckBox 
                        style={{ backgroundColor: '#fff' }}
                        onPress={this.onOrderChecked.bind(this, orderCode)}
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

export default connect(mapStateToProps, { pdListFetch, toggleOrderGroup, updateOrders, createGroup, resetGroup })(DeliveryGroupCreate);
