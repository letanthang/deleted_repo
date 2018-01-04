import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Content
} from 'native-base';
import { updateOrderStatus, getConfiguration, updateAllOrderInfo, updateOrderInfo, setAllStatus, changeDone, addOneOrder } from '../../actions';
import Utils from '../../libs/Utils';
import { get3Type } from '../../selectors';
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
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
    this.autoChangeTab();
  }

  autoChangeTab() {
    if (this.props.done) return;
    
    const { done, PickItems, ReturnItems } = this.props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === done);
    if (orders.length === 0) {
      this.props.changeDone(!done);
    }
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  checkComplete({ CurrentStatus, PickDeliveryType }) {
    if (PickDeliveryType === 1) {
      return Utils.checkPickComplete(CurrentStatus);
    } else {
      return Utils.checkReturnComplete(CurrentStatus);
    }
  }

  checkKeywork({ OrderCode, ExternalCode }) {
    const keyword = this.props.keyword.toUpperCase()
    return this.props.keyword === '' 
      || OrderCode.toUpperCase().includes(keyword)
      || (ExternalCode && ExternalCode.toUpperCase().includes(keyword));
  }

  onOrderPress(order) {
  
    const { OrderID } = order;
    const { ClientID, ClientHubID } = this.pickGroup;
    
    if (this.PickDeliveryType === 1) {
      navigateOnce(this, 'PickOrder', { OrderID, order, ClientID, ClientHubID });
    } else if (this.PickDeliveryType === 3) {
      navigateOnce(this, 'ReturnOrder', { OrderID, order, ClientHubID });
    }
  }

  onChooseDate(date) {    
    const timestamp = date.getTime();
    if (this.order === null) {
      const OrderInfos = _.map(this.orders, order => getUpdateOrderInfo(order, this.buttonIndex, timestamp));
      this.props.updateAllOrderInfo(OrderInfos);
      this.props.setAllStatus(false);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      this.props.updateOrderInfo(this.order.OrderID, moreInfo);
    }
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  renderInfosForPick({ Weight, Length, Width, Height }) {
    if (this.PickDeliveryType === 3) return null;
    return (
      <View>
        <View style={Styles.itemStyle}>
          <Text style={Styles.weakColorStyle}>{Weight} g | {Length}-{Width}-{Height} (cm3)</Text>
        </View>
      </View>
    );
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
    if (Utils.getOrder(this.props.pds, order.OrderID, 2)) return true;
    return false;
  }

  render() {
    const { done, PickItems, ReturnItems } = this.props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === done && this.checkKeywork(o));


    return (
      <Content style={{ backgroundColor: Colors.background }}>
        <ActionAllButtons
          done={done}
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
            renderItem={({ item }) => {
              const order = item;
              const { 
                OrderCode, RecipientName, RecipientPhone, PickDeliveryType,
                Height, Width, Weight, Length, CurrentStatus,
                ExternalCode, CODAmount, OrderID
              } = item;
              const rightText = 'LẤY';
              return (
                <TouchableOpacity
                  onPress={this.onOrderPress.bind(this, item)}
                >
                  <View style={[Styles.orderWrapperStyle]}>
                    <View style={Styles.item2Style}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{OrderCode}</Text>
                        <OrderStatusText 
                          CurrentStatus={CurrentStatus}
                          PickDeliveryType={PickDeliveryType}
                          style={{ marginLeft: 10 }}
                        />
                      </View>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(CODAmount)} đ</Text>
                    </View>
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {ExternalCode}</Text>
                    </View>
                    <View style={Styles.itemStyle}>
                      <Text style={Styles.weakColorStyle}>Nhận: {RecipientName} - {RecipientPhone}</Text>
                    </View>
                    {this.renderInfosForPick({ Weight, Length, Width, Height })}
                    {done ?
                    <View style={Styles.itemStyle}>
                      <FormButton
                        disabled={this.checkDelivering(order)}
                        theme='success'
                        text="Nhận đi giao"
                        width={100}
                        onPress={this.acceptDeliverPress.bind(this, order)}
                      />
                    </View>
                    : null}
                    <ActionButtons
                      done={done}
                      info={this.props.OrderInfos[OrderID]}
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
  componentDidUpdate(prevProps) {
    if (prevProps.PickItems !== this.props.PickItems) this.autoChangeTab();
  }
}

const mapStateToProps = (state) => {
  const { auth, pd, other, pickGroup } = state;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const { configuration } = other;
  const { showDatePicker, OrderInfos, done, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, sessionToken, pdsId, loading, configuration, showDatePicker, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateAllOrderInfo, updateOrderInfo, setAllStatus, changeDone, addOneOrder })(PickGroupDetail);
