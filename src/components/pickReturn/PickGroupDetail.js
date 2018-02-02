import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Content
} from 'native-base';
import { updateOrderStatus, getConfiguration, updateOrderInfos, updateOrderInfo, setAllStatus, changeDone, addOneOrder } from '../../actions';
import Utils from '../../libs/Utils';
import { get3Type, getOrders } from '../../selectors';
import { navigateOnce } from '../../libs/Common';
import { Styles, Colors } from '../../Styles';
import OrderStatusText from '../OrderStatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import ActionButtons from './ActionButtons';
import ActionAllButtons from './ActionAllButtons';
import ActionModal from '../ActionModal';
import { getUpdateOrderInfo } from './Helpers';
import FormButton from '../FormButton';

class PickGroupDetail extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  
  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;
  order = {};
  done = false;
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
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
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.ShopOrders.filter(o => {
      const result = !Utils.checkPickComplete(o.CurrentStatus);
      return result;
    });
    if (orders.length === 0) return true;
    return false;
  }

  checkDone(props) {
    const { PickItems, ReturnItems } = props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.ShopOrders.filter(o => Utils.checkPickCompleteForUnsync(o) === true);
    if (orders.length === 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }

  checkKeywork({ OrderCode, ExternalCode }) {
    const keyword = this.props.keyword.toUpperCase()
    return this.props.keyword === '' 
      || OrderCode.toUpperCase().includes(keyword)
      || (ExternalCode && ExternalCode.toUpperCase().includes(keyword));
  }

  onOrderPress(order) {
  
    const { OrderCode } = order;
    const { ClientID, ClientHubID } = this.pickGroup;
    
    if (this.PickDeliveryType === 1) {
      navigateOnce(this, 'PickOrder', { OrderCode, order, ClientID, ClientHubID });
    } else if (this.PickDeliveryType === 3) {
      navigateOnce(this, 'ReturnOrder', { OrderCode, order, ClientHubID });
    }
  }

  onChooseDate(date) {    
    const timestamp = date.getTime();
    if (this.order === null) {
      const OrderInfos = _.map(this.orders, order => getUpdateOrderInfo(order, this.buttonIndex, timestamp));
      this.props.updateOrderInfos(OrderInfos);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      const { OrderCode, PickDeliveryType } = this.order;
      this.props.updateOrderInfo(OrderCode, PickDeliveryType, moreInfo);
    }
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  acceptDeliverPress(order) {
    const newOrder = _.clone(order);
    newOrder.PickDeliveryType = 2;
    newOrder.CurrentStatus = 'Delivering';
    newOrder.Group = null;
    console.log('acceptDeliveryPress!');
    this.props.addOneOrder(newOrder);
  }

  checkDelivering(order) {
    if (Utils.getOrder(this.props.db, order.OrderCode, 2)) return true;
    return false;
  }

  render() {
    const { PickItems, ReturnItems, keyword } = this.props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.ShopOrders.filter(o => this.checkKeywork(o));

    const hidden = orders.length === 0 || (keyword !== '') || this.checkRealDone();
    return (
      <Content style={{ backgroundColor: Colors.background }}>
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
            keyExtractor={(item, index) => item.OrderCode}
            renderItem={({ item }) => {
              const order = item;
              const { 
                OrderCode, RecipientName, RecipientPhone,
                Height, Width, Weight, Length, CurrentStatus,
                ExternalCode, CODAmount, success, note
              } = item;

              const realDone = Utils.checkPickComplete(CurrentStatus);
              const isDelivering = this.checkDelivering(order);
              const deliverStatus = isDelivering ? 'Đã nhận giao' : 'Nhận đi giao';
              return (
                <TouchableOpacity
                  onPress={this.onOrderPress.bind(this, item)}
                >
                  <View style={[Styles.orderWrapperStyle]}>
                    <View style={Styles.item2Style}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{OrderCode}</Text>
                        <OrderStatusText 
                          order={order}
                          style={{ marginLeft: 10 }}
                        />
                      </View>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(CODAmount)} đ</Text>
                    </View>
                    {success === false ?
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle, { color: '#FF7F9C' }]}>{note}</Text>
                    </View>
                    : null}
                    {ExternalCode ?
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {ExternalCode}</Text>
                    </View>
                    : null}
                    <View style={Styles.itemStyle}>
                      <Text style={Styles.weakColorStyle}>Nhận: {RecipientName} - {RecipientPhone}</Text>

                      
                    </View>
                    <View style={Styles.item2Style}>
                      <Text style={Styles.weakColorStyle}>{Weight} g | {Length}-{Width}-{Height} (cm3)</Text>
                      {realDone ?
                      <FormButton
                        disabled={isDelivering}
                        theme='theme1'
                        text={deliverStatus}
                        width={100}
                        onPress={this.acceptDeliverPress.bind(this, order)}
                      /> : null}
                    </View>
                    <ActionButtons
                      done={realDone}
                      info={order}
                      order={order}
                      onSelectDateCase={buttonIndex => {
                        this.buttonIndex = buttonIndex;
                        this.order = order;
                        this.setState({ modalShow: true });
                      }} 
                    />
                  </View>
                </TouchableOpacity>
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
  const { auth, pd, config, pickGroup } = state;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const { configuration } = config;
  const { showDatePicker, OrderInfos, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  const db = getOrders(state);
  return { db, PickItems, ReturnItems, sessionToken, pdsId, loading, configuration, showDatePicker, OrderInfos, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateOrderInfos, updateOrderInfo, setAllStatus, changeDone, addOneOrder })(PickGroupDetail);
