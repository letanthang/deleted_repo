import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Header,
  Content, Text
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import { get3Type } from '../selectors';
import { createPGroup, updateShopPGroup, resetPGroup } from '../actions';
import { Colors, Styles, DeliverGroupStyles } from '../Styles';
import Utils from '../libs/Utils';

class GroupPickScreen extends Component {
  state = { showSearch: false, keyword: '', groupCheck: {} };
  componentWillMount() {
    console.log(this.props.pgroups);
    console.log(Object.keys(this.props.pgroups));
    this.calNewGroup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pgroups !== this.props.pgroups) {
      this.calNewGroup(nextProps);
    }
  }

  onOrderChecked(ID) {
    const groupCheck = this.state.groupCheck;
    groupCheck[ID] = !groupCheck[ID];
    this.setState({ groupCheck });
  }
  onCreateGroup() {
    const { groupName, groupCheck } = this.state;
    this.props.createPGroup(groupName);
    this.props.updateShopPGroup(groupCheck, groupName);
    this.setState({ groupCheck: {} });
  }

  onResetGroup() {
    Alert.alert('Xoá nhóm', 'Bạn có chắc xoá hết nhóm để tạo lại?', 
    [
      { text: 'Huỷ', onPress: () => {} },
      { text: 'Đồng ý', onPress: () => this.resetGroup() },
    ]);
  }

  resetGroup() {
    this.props.resetPGroup(); 
    this.setState({ groupCheck: {} });
  }

  calNewGroup({ pgroups }) {
    const groupLength = Object.keys(pgroups).length - 1;
    this.setState({ groupName: `Nhóm ${groupLength}` });
    console.log(groupLength);
  }

  checkTripDone(trip) {
    const ordersNum = trip.ShopOrders.length;
    const completedNum = trip.ShopOrders.filter(o => Utils.checkPickComplete(o.currentStatus)).length;
    return (ordersNum === completedNum);
  }

  renderHeader() {
    const { goBack } = this.props.navigation;

    return (
      <Header>
        <Left style={Styles.leftStyle}>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>Tạo Nhóm Lấy</Title>
        </Body>
        <Right style={Styles.rightStyle} />
      </Header>
    );
  }

  render() {
    const items = this.props.PickItems.filter(o => o.shopGroup === undefined && !this.checkTripDone(o));
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
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
            keyExtractor={(item, index) => item.clientHubId}
            renderItem={({ item }) => {
              const order = item;
              const { address, clientHubId, contactName } = order;
              const groupChecked = this.state.groupCheck[clientHubId];
              return (
                <TouchableOpacity
                  onPress={this.onOrderChecked.bind(this, clientHubId)}
                >
                  <View style={Styles.rowStyle}>
                    <View style={[DeliverGroupStyles.col1Style]}>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                        {contactName}
                      </Text>
                      <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                        {address}
                      </Text>
                    </View>
                    <View
                      style={DeliverGroupStyles.col2Style}
                    >
                      <CheckBox 
                        style={{ backgroundColor: '#fff' }}
                        onPress={this.onOrderChecked.bind(this, clientHubId)}
                        checked={groupChecked}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        
      </Content>
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  const { pgroups } = state.pd;
  const { PickItems } = get3Type(state);
  return { PickItems, pgroups };
};

export default connect(mapStateToProps, { createPGroup, updateShopPGroup, resetPGroup })(GroupPickScreen);
