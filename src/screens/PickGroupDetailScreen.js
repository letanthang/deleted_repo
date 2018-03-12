import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar } from 'react-native-progress';
import { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch } from '../actions';
import { get3Type } from '../selectors';
import Utils from '../libs/Utils';
import { Styles, Colors } from '../Styles';
import PickGroupDetail from '../components/pickReturn/PickGroupDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import LogoButton from '../components/LogoButton';


class PickGroupDetailScreen extends Component {
  state = { showSearch: false };

  componentWillMount() {
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.clientHubId = this.pickGroup.clientHubId;
    this.pickDeliveryType = this.pickGroup.pickDeliveryType;
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
  }

  componentWillReceiveProps({ PickItems, ReturnItems }) {
    const Items = this.pickDeliveryType === 1 ? PickItems : ReturnItems;
    this.pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
  }

  componentWillUnmount() {
    this.props.resetPickGroup();
  }

  checkComplete(order) {
    return Utils.checkPickCompleteForUnsync(order);
  }

  checkRealDone() {
    const completeNum = this.pickGroup.ShopOrders.filter(o => Utils.checkPickComplete(o.currentStatus)).length;
    return completeNum === this.totalNum;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    this.props.updateOrderStatus({ OrderInfos });
  }

  confirmUpdateOrderOnce = _.debounce(this.confirmUpdateOrder, 400, { leading: true, trailing: false });

  confirmUpdateOrder() {
    // this.props.pdListFetch()
    //   .then(() => this.props.navigation.navigate('PickConfirm', { clientHubId: this.clientHubId }));
    this.props.navigation.navigate('PickConfirm', { clientHubId: this.clientHubId });
  }

  renderHeader(pickGroup) {
    const { goBack } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Tìm đơn hàng ..." value={this.props.keyword} 
              onChangeText={(text) => { 
                  this.props.changeKeyword(text);
              }}
              autoFocus
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => this.props.changeKeyword('')}
              style={{ padding: 8 }}
            >
              <IC 
                name="close-circle-outline" size={14} 
              />
            </TouchableOpacity>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 0 }}
              onPress={() => {
                this.setState({ showSearch: !this.state.showSearch });
                this.props.changeKeyword('');
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
          <Title>{pickGroup.clientName} - {pickGroup.contactName}</Title>
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
    const { loading, addOrderLoading, PickItems, ReturnItems } = this.props;
    const { width } = Dimensions.get('window');
    const { pickDeliveryType } = this.pickGroup;
    const Items = pickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(trip => trip.clientHubId === this.clientHubId); 
    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <PickGroupDetail navigation={this.props.navigation} />
        <LoadingSpinner loading={loading || addOrderLoading} />
        
        {this.doneNum === this.totalNum && !this.checkRealDone() ?
        <Footer style={{ backgroundColor: Colors.background, borderTopWidth: 0 }}>
        <FooterTab style={{ backgroundColor: Colors.background }}>
          <TouchableOpacity 
            style={Styles.updateButtonStyle}
            onPress={this.confirmUpdateOrderOnce.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Cập Nhật</Text>
          </TouchableOpacity>
        </FooterTab>
        </Footer>
        : 
        <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20 }}>
          <Bar 
            color='blue'
            unfilledColor='#ccc'
            borderRadius={2}
            progress={this.doneNum / this.totalNum}
            height={10}
            width={width - 20}
            indeterminate={false}
            style={{ marginLeft: 10, marginRight: 10 }}
          />
        </View>
        }
      </Container>
      
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, pd, pickGroup } = state;
  const { sessionToken } = auth;
  const { pdsId, loading, addOrderLoading } = pd;
  const { OrderInfos, done, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, sessionToken, pdsId, state, loading, addOrderLoading, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch })(PickGroupDetailScreen);
