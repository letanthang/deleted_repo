import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, TextInput, Platform } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar } from 'react-native-progress';
import { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd } from '../../actions';
import { get3Type } from '../../selectors';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import PickGroupDetail from './PickGroupDetail';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import LogoButton from '../../components/LogoButton';

class PickGroupDetailScreen extends Component {
  constructor() {
    super();
    this.state = { showSearch: false, keyword: '' };
    this.searchDebounce = _.debounce(this.searchKeyword, 500, { leading: false, trailing: true });
  }
  

  componentWillMount() {
    const { senderHubId, type } = this.props.navigation.state.params;
    this.senderHubId = senderHubId;
    this.type = type;
  }

  componentWillReceiveProps({ PickItems, ReturnItems }) {
    
  }

  componentWillUnmount() {
    this.props.resetPickGroup();
  }

  checkComplete(order) {
    return Utils.checkCompleteForUnsync(order);
  }

  checkRealDone() {
    const completeNum = this.pickGroup.ShopOrders.filter(o => o.done).length;
    return completeNum === this.totalNum;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    this.props.updateOrderStatus({ OrderInfos });
  }

  confirmUpdateOrderOnce = _.debounce(this.confirmUpdateOrder, 400, { leading: true, trailing: false });

  confirmUpdateOrder() {
    // this.props.pdListFetch({})
    //   .then(() => this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId }));
    this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId, type: 'PICK' });
  }

  hasUnsynced(pickGroup) {
    const found = pickGroup.ShopOrders.find(o => Utils.isCompletedUnsynced(o));
    if (found) return true;
    return false;
  }

  refresh() {
    if (this.myInput) {
      this.myInput.focus();
    }
  }

  searchKeyword(text) {
    this.props.changeKeyword(text);
  }

  onKeywordChange(text) {
    this.setState({ keyword: text });
    this.searchDebounce(text);
  }

  renderHeader(pickGroup) {
    const { goBack, navigate } = this.props.navigation;
    const bodyStyle = Platform.OS === 'android' ? Styles.bodyStyleAndroid : Styles.bodyStyle;
    const rightStyle = Platform.OS === 'android' ? Styles.rightStyleAndroid : Styles.rightStyle;

    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <TextInput
              style={{ flex: 1, fontSize: 16 }}
              underlineColorAndroid='transparent'
              placeholder="Tìm đơn hàng ..." value={this.state.keyword} 
              onChangeText={this.onKeywordChange.bind(this)}
              autoFocus
              selectTextOnFocus
              autoCorrect={false}
              ref={input => this.myInput = input}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ keyword: '' });
                this.props.changeKeyword('');
              }}
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
                this.setState({ showSearch: !this.state.showSearch, keyword: '' });
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
        <Body style={bodyStyle}>
          <Title>{pickGroup.clientName} - {pickGroup.senderName}</Title>
        </Body>
        <Right style={rightStyle}>
          <Button
            transparent
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Icon name="search" />
          </Button>
          <Button
            transparent
            onPress={() => this.props.getNewOrdersForAdd(this.senderHubId) }
          >
            <Icon name="add" />
          </Button>
          {Platform.OS == 'android' ?
          <Button
            transparent
            onPress={() => navigate('OrderLabels', { senderHubId: this.senderHubId})}
          >
            <Icon name="print" />
          </Button>
          : null}
        </Right>
      </Header>
    );
  }

  render() {
    console.log('PickGroupDetailScreen render');
    const { addOrderLoading, PickItems, ReturnItems } = this.props;
    const { width } = Dimensions.get('window');
    const type = this.type;
    const Items = type === 'PICK' ? PickItems : ReturnItems;
    const pickGroup = Items.find(trip => trip.senderHubId === this.senderHubId);
    if (pickGroup == null) {
      this.props.navigation.popToTop();
      return null;
    }
    this.pickGroup = pickGroup;
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ProgressBar
          progress={this.props.progress}
          loading={this.props.loading}
        />
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <PickGroupDetail navigation={this.props.navigation} pickGroup={pickGroup} refresh={this.refresh.bind(this)} />
        <LoadingSpinner loading={addOrderLoading} />
        
        
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
            onPress={this.confirmUpdateOrderOnce.bind(this)}
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
  const { auth, pd, pickGroup, other } = state;
  const { progress, loading } = other;
  const { sessionToken } = auth;
  const { tripCode, addOrderLoading } = pd;
  const { OrderInfos, done, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, sessionToken, tripCode, loading, progress, addOrderLoading, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd })(PickGroupDetailScreen);
