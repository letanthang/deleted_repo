import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, FlatList, RefreshControl } from 'react-native';
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

class PickGroupDetail extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  
  pickGroup = null;
  clientHubId = null;
  type = null;
  order = {};
  done = false;
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.pickGroup;
    this.clientHubId = this.pickGroup.clientHubId;
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
    const { PickItems, ReturnItems } = this.props;
    const Items = this.type === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    const orders = pickGroup.ShopOrders.filter(o => {
      const result = !o.done;
      return result;
    });
    if (orders.length === 0) return true;
    return false;
  }

  checkDone(props) {
    const { PickItems, ReturnItems } = props;
    const Items = this.type === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    const orders = pickGroup.ShopOrders.filter(o => Utils.checkPickCompleteForUnsync(o) === true);
    if (orders.length === 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }

  checkKeywork({ code, ExternalCode }) {
    const keyword = this.props.keyword.toUpperCase()
    return this.props.keyword === '' 
      || code.toUpperCase().includes(keyword)
      || (ExternalCode && ExternalCode.toUpperCase().includes(keyword));
  }

  onOrderPress(order) {
  
    const { code } = order;
    const { clientId, clientHubId } = this.pickGroup;
    
    if (this.type === 1) {
      navigateOnce(this, 'PickOrder', { code, order, clientId, clientHubId });
    } else if (this.type === 3) {
      navigateOnce(this, 'ReturnOrder', { code, order, clientHubId });
    }
  }

  onChooseDate(date) {
    const timestamp = date.getTime();
    if (this.order === null) {
      const OrderInfos = _.map(this.orders, order => getUpdateOrderInfo(order, this.buttonIndex, timestamp));
      this.props.updateOrderInfos(OrderInfos);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      const { code, type } = this.order;
      this.props.updateOrderInfo(code, type, moreInfo);
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
    const newOrder = _.clone(order);
    newOrder.hasDetail = false;
    newOrder.type = 'DELIVER';
    newOrder.status = 'DELIVERING';
    newOrder.Group = null;
    this.props.addOneOrder(newOrder);
  }

  checkDelivering(order) {
    if (Utils.getOrder(this.props.db, order.code, 2)) return true;
    return false;
  }

  reloadData() {
    this.props.pdListFetch({ all: false, timeServer: this.props.timeServer });
  }

  render() {
    const { PickItems, ReturnItems, keyword } = this.props;
    const Items = this.type === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    const orders = pickGroup.ShopOrders.filter(o => this.checkKeywork(o));
    const animated = true; //const animated = orders.length < 10;
    const hidden = orders.length === 0 || (keyword !== '') || this.checkRealDone();
    return (
      <Content
        refreshControl={
          <RefreshControl
            refreshing={this.props.loading}
            onRefresh={this.reloadData.bind(this)}
          />
        } 
        style={{ backgroundColor: Colors.background }}
      >
        <ActionAllButtons
          done={hidden}
          orders={orders}
          onSelectDateCase={buttonIndex => {
            this.buttonIndex = buttonIndex;
            this.order = null;
            this.orders = orders;
            this.setState({ modalShow: true });        
          }}
          style={Styles.actionAllWrapperStyle}
        />
        <DataEmptyCheck
          data={orders}
          message='Không có dữ liệu'
        >
          <View>
          <FlatList 
            data={orders}
            keyExtractor={(item, index) => item.code}
            renderItem={({ item }) => 
            <OrderItem 
              order={item}
              animated={animated}
              acceptDeliverPress={this.acceptDeliverPress.bind(this)}
              onOrderPress={this.onOrderPress.bind(this)}
              checkDelivering={this.checkDelivering.bind(this)}
              onSelectDateCase={this.onSelectDateCase.bind(this)}
            />}
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
  const { showDatePicker, OrderInfos, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  const db = getOrders(state);
  return { db, PickItems, ReturnItems, sessionToken, tripCode, loading, configuration, showDatePicker, OrderInfos, keyword, timeServer };
};

export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateOrderInfos, updateOrderInfo, setAllStatus, changeDone, addOneOrder, pdListFetch })(PickGroupDetail);
