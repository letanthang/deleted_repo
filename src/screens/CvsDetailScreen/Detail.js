import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, FlatList, SectionList, RefreshControl, Text, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { 
  Content
} from 'native-base';
import { updateOrderStatus, getConfiguration, updateOrderInfos, updateOrderInfo, setAllStatus, changeDone, addOneOrder, pdListFetch } from '../../actions';
import Utils from '../../libs/Utils';
import { get3Type, getOrders } from '../../selectors';
import { navigateOnce } from '../../libs/Common';
import { Styles, Colors } from '../../Styles';
import DataEmptyCheck from '../../components/DataEmptyCheck';
import ActionAllButtons from './ActionAllButtons';
import ActionModal from '../../components/ActionModal';
import { getUpdateOrderInfo } from '../../components/Helpers';
import OrderItem from './OrderItem';

class Detail extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false, notify: 0 };
  
  pickGroup = null;
  senderHubId = null;
  type = null;
  order = {};
  done = false;
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.pickGroup;
    this.senderHubId = this.pickGroup.senderHubId;
    this.type = this.pickGroup.type;
    this.checkDone(this.props);
  }
  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }
  componentWillReceiveProps(nextProps) {
    this.checkDone(nextProps);
  }

  checkRealDone() {
    const { CvsItems } = this.props;
    const Items = CvsItems;
    const pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    if (pickGroup == null) {
      this.props.navigation.popToTop();
    }
    const orders = pickGroup.ShopOrders.filter(o => {
      const result = !o.done;
      return result;
    });
    if (orders.length === 0) return true;
    return false;
  }

  checkDone(props) {
    const { CvsItems } = props;
    const Items = CvsItems
    const pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    const orders = pickGroup.ShopOrders.filter(o => Utils.checkCompleteForUnsync(o) === true);
    if (orders.length === 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }

  checkKeywork({ orderCode, externalCode }) {
    const keyword = this.props.keyword.toUpperCase()
    return this.props.keyword === '' 
      || orderCode.toUpperCase().includes(keyword)
      || (externalCode && externalCode.toUpperCase().includes(keyword));
  }

  onOrderPress(order) {
  
    const { orderCode } = order;
    const { clientId, senderHubId } = this.pickGroup;
    Keyboard.dismiss();
    if (this.type === 'PICK' || this.type === 'TRANSIT_IN') {
      navigateOnce(this, 'PickOrder', { orderCode, order, clientId, senderHubId, refresh: this.props.refresh, type: this.type });
    } else if (this.type === 'RETURN') {
      navigateOnce(this, 'ReturnOrder', { orderCode, order, senderHubId, refresh: this.props.refresh, type: this.type });
    }
  }

  onChooseDate(date) {
    const timestamp = date.getTime();
    if (this.order === null) {
      const OrderInfos = _.map(this.orders, order => getUpdateOrderInfo(order, this.buttonIndex, timestamp));
      this.props.updateOrderInfos(OrderInfos);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      const { orderCode, type } = this.order;
      this.props.updateOrderInfo(orderCode, type, moreInfo);
    }
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }
  onSelectDateCase(buttonIndex, order) {
    this.buttonIndex = buttonIndex;
    this.order = order;
    this.setState({ modalShow: true });
  }

  acceptDeliverPress(order) {
    
    const { orderCode, senderHubId } = order;
    this.props.addOneOrder(orderCode, 'DELIVER', senderHubId);
  }

  checkDelivering(order) {
    if (Utils.getOrder(this.props.db, order.orderCode, 'DELIVER')) return true;
    return false;
  }

  reloadData() {
    this.props.pdListFetch({});
  }
  resetAllButton() {
    this.setState({ notify: this.state.notify + 1 });
  }

  render() {
    const { CvsItems, keyword } = this.props;
    const Items = CvsItems;
    const pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    const orders = pickGroup.ShopOrders.filter(o => this.checkKeywork(o) && !o.done) || [];
    const ordersDone = pickGroup.ShopOrders.filter(o => this.checkKeywork(o) && o.done) || [];
    const sections = [{ data: orders, title: 'Đơn đang chạy', index: 0 }, { data: ordersDone, title: 'Đơn đã xong', index: 1 }];
    const animated = true; //const animated = orders.length < 10;
    const hidden = orders.length === 0 || (keyword !== '') || this.checkRealDone();
    return (
      <Content
        keyboardShouldPersistTaps='handled'
        refreshControl={
          <RefreshControl
            refreshing={this.props.loading}
            onRefresh={this.reloadData.bind(this)}
          />
        } 
        style={{ backgroundColor: Colors.background }}
      >
        <ActionAllButtons
          navigation={this.props.navigation}
          done={hidden}
          orders={orders}
          notify={this.state.notify}
          onSelectDateCase={buttonIndex => {
            this.buttonIndex = buttonIndex;
            this.order = null;
            this.orders = orders;
            this.setState({ modalShow: true });        
          }}
          style={Styles.actionAllWrapperStyle}
        />
        <DataEmptyCheck
          data={sections}
          message='Không có dữ liệu'
        >
          <View>
          <SectionList
            keyboardShouldPersistTaps='handled'
            sections={sections}
            keyExtractor={(item, index) => item.orderCode}
            renderItem={({ item }) => {
              const isDelivering = this.checkDelivering(item);
              return (
                <OrderItem 
                  navigation={this.props.navigation}
                  order={item}
                  animated={animated}
                  acceptDeliverPress={this.acceptDeliverPress.bind(this)}
                  onOrderPress={this.onOrderPress.bind(this)}
                  isDelivering={isDelivering}
                  onSelectDateCase={this.onSelectDateCase.bind(this)}
                  resetAllButton={this.resetAllButton.bind(this)}
                />
              );
            }}
            renderSectionHeader={({ section }) => {
              if (section.data.length === 0) return null
              const style = section.index === 0 ? Styles.headerText0 : Styles.headerText;
              return (
                <View style={Styles.sectionHeader}>
                  <Text style={style}>{section.title}</Text>
                </View>
              );
            }}
          />
          </View>
        </DataEmptyCheck>
       
        <ActionModal
          visible={this.state.modalShow}
          onChooseDate={this.onChooseDate.bind(this)}
          onCancelDate={this.onCancelDate.bind(this)}
        />
        
      </Content>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, pd, config, pickGroup, other } = state;
  const { sessionToken } = auth;
  const { tripCode, timeServer } = pd;
  const { loading } = other;
  const { configuration } = config;
  const { keyword } = pickGroup;
  const { PickItems } = get3Type(state);
  const db = getOrders(state);
  return { db, CvsItems: PickItems, sessionToken, tripCode, loading, configuration, keyword, timeServer };
};

export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateOrderInfos, updateOrderInfo, setAllStatus, changeDone, addOneOrder, pdListFetch })(Detail);
