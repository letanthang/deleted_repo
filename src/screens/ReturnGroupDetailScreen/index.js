import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar } from 'react-native-progress';
import { pdListFetch, changeDone1, changeKeyword1 } from '../../actions';
import { get3Type } from '../../selectors';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import ReturnGroupDetail from './ReturnGroupDetail';
import LoadingSpinner from '../../components/LoadingSpinner';
import LogoButton from '../../components/LogoButton';

class PickGroupDetailScreen extends Component {
  state = { showSearch: false };

  componentWillMount() {
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.senderHubId = this.pickGroup.senderHubId;
    this.type = this.pickGroup.type;
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
  }

  componentWillReceiveProps({ PickItems, ReturnItems }) {
    const Items = this.type === 'PICK' ? PickItems : ReturnItems;
    this.pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
  }

  checkComplete(order) {
    return Utils.checkReturnCompleteForUnsync(order);
  }

  checkRealDone() {
    const completeNum = this.pickGroup.ShopOrders.filter(o => o.done).length;
    return completeNum === this.totalNum;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    this.props.updateOrderStatus({ OrderInfos });
  }

  confirmUpdateOrder() {
    // this.props.pdListFetch({})
    //   .then(() => this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId, type: 'RETURN' }));
    this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId, type: 'RETURN' });
  }

  hasUnsynced(pickGroup) {
    const found = pickGroup.ShopOrders.find(o => Utils.isCompletedUnsynced(o));
    if (found) return true;
    return false;
  }

  renderHeader(pickGroup) {
    const { done, keyword } = this.props;
    const { goBack } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Tìm đơn hàng ..." value={keyword} 
              onChangeText={(text) => { 
                  this.props.changeKeyword1(text);
              }}
              autoFocus
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.changeKeyword1('');
              }}
              style={{ padding: 8 }}
            >
              <IconFA 
                name="times-circle" size={14} 
              />
            </TouchableOpacity>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 0 }}
              onPress={() => {
                this.setState({ showSearch: !this.state.showSearch });
                this.props.changeKeyword1('');
              }}
            >
              <Text uppercase={false}>Huỷ</Text>
            </Button>
          </Right>
        </Header>
        );
    } 

    return (
      <Header>
        <Left style={Styles.leftStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <LogoButton dispatch={this.props.navigation.dispatch} />
        </View>
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>{pickGroup.clientName} - {pickGroup.senderName}</Title>
        </Body>
        <Right style={Styles.rightStyle}>
          <Button
            transparent
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Icon name="search" />
          </Button>
        </Right>
      </Header>
    );
  }

  render() {
    const { PickItems, ReturnItems, navigation } = this.props;
    const { width } = Dimensions.get('window');
    const { type } = this.pickGroup;
    const Items = type === 'PICK' ? PickItems : ReturnItems;
    const pickGroup = Items.find(trip => trip.senderHubId === this.senderHubId); 
    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <ReturnGroupDetail navigation={navigation} />
        <LoadingSpinner loading={false} />
        <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2, height: 13 }}>
          <Bar 
            color='blue'
            unfilledColor='#ccc'
            borderRadius={2}
            progress={this.doneNum / this.totalNum}
            height={9}
            width={width - 4}
            indeterminate={false}
            style={{ marginLeft: 2, marginRight: 2 }}
          />
        </View>
        {!this.checkRealDone() && this.hasUnsynced(pickGroup) ?
        <Footer style={{ backgroundColor: Colors.background, borderTopWidth: 0 }}>
        <FooterTab style={{ backgroundColor: Colors.background }}>
          <TouchableOpacity 
            style={Styles.updateButtonStyle}
            onPress={this.confirmUpdateOrder.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Cập Nhật</Text>
          </TouchableOpacity>
        </FooterTab>
        </Footer>
        : null} 
      </Container>
      
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, pd, returnGroup } = state;
  const { sessionToken } = auth;
  const { tripCode } = pd;
  const { OrderInfos, done, keyword } = returnGroup;
  const { ReturnItems, PickItems } = get3Type(state);
  return { ReturnItems, PickItems, sessionToken, tripCode, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { pdListFetch, changeDone1, changeKeyword1 })(PickGroupDetailScreen);
