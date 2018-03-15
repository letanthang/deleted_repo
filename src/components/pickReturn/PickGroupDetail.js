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
  clientHubId = null;
  pickDeliveryType = null;
  order = {};
  done = false;
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.clientHubId = this.pickGroup.clientHubId;
    this.pickDeliveryType = this.pickGroup.pickDeliveryType;
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
    const Items = this.pickDeliveryType === 1 ? PickItems : ReturnItems;
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
    const Items = this.pickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    const orders = pickGroup.ShopOrders.filter(o => Utils.checkPickCompleteForUnsync(o) === true);
    if (orders.length === 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }

  checkKeywork({ orderCode, ExternalCode }) {
    const keyword = this.props.keyword.toUpperCase()
    return this.props.keyword === '' 
      || orderCode.toUpperCase().includes(keyword)
      || (ExternalCode && ExternalCode.toUpperCase().includes(keyword));
  }

  onOrderPress(order) {
  
    const { orderCode } = order;
    const { clientId, clientHubId } = this.pickGroup;
    
    if (this.pickDeliveryType === 1) {
      navigateOnce(this, 'PickOrder', { orderCode, order, clientId, clientHubId });
    } else if (this.pickDeliveryType === 3) {
      navigateOnce(this, 'ReturnOrder', { orderCode, order, clientHubId });
    }
  }

  onChooseDate(date) {    
    const timestamp = date.getTime();
    if (this.order === null) {
      const OrderInfos = _.map(this.orders, order => getUpdateOrderInfo(order, this.buttonIndex, timestamp));
      this.props.updateOrderInfos(OrderInfos);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      const { orderCode, pickDeliveryType } = this.order;
      this.props.updateOrderInfo(orderCode, pickDeliveryType, moreInfo);
    }
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  acceptDeliverPress(order) {
    const newOrder = _.clone(order);
    newOrder.pickDeliveryType = 2;
    newOrder.currentStatus = 'DELIVERING';
    newOrder.Group = null;
    console.log('acceptDeliveryPress!');
    this.props.addOneOrder(newOrder);
  }

  checkDelivering(order) {
    if (Utils.getOrder(this.props.db, order.orderCode, 2)) return true;
    return false;
  }

  render() {
    const { PickItems, ReturnItems, keyword } = this.props;
    const Items = this.pickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.clientHubId === this.clientHubId);
    const orders = pickGroup.ShopOrders.filter(o => this.checkKeywork(o));
    const animated = orders.length < 10;
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
            keyExtractor={(item, index) => item.orderCode}
            renderItem={({ item }) => {
              const order = item;
              const { 
                orderCode, recipientName, recipientPhone,
                height, width, weight, length, currentStatus,
                ExternalCode, senderPay, success, note, pickWarehouseId, 
                deliverWarehouseId, done
              } = item;

              const realDone = done;
              const deliverable = realDone && pickWarehouseId === deliverWarehouseId && Utils.checkPickSuccess(currentStatus);
              const isDelivering = this.checkDelivering(order);
              const deliverStatus = isDelivering ? 'Đã nhận giao' : 'Nhận đi giao';
              return (
                <TouchableOpacity
                  onPress={this.onOrderPress.bind(this, item)}
                >
                  <View style={[Styles.orderWrapperStyle]}>
                    <View style={Styles.item2Style}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{orderCode}</Text>
                        <OrderStatusText 
                          order={order}
                          style={{ marginLeft: 10 }}
                        />
                      </View>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(senderPay)} đ</Text>
                    </View>
                    {success === false && realDone === false ?
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
                      <Text style={Styles.weakColorStyle}>Nhận: {recipientName} - {recipientPhone}</Text>

                      
                    </View>
                    <View style={Styles.item2Style}>
                      <Text style={Styles.weakColorStyle}>{weight} g | {length}-{width}-{height} (cm3)</Text>
                      {deliverable ?
                      <FormButton
                        disabled={isDelivering}
                        theme='theme1'
                        text={deliverStatus}
                        width={100}
                        onPress={this.acceptDeliverPress.bind(this, order)}
                      /> : null}
                    </View>
                    <ActionButtons
                      animated={animated}
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
