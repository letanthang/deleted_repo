import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
// import * as Communications from 'react-native-communications';
import { 
  Content, List
} from 'native-base';
import { updateOrderInfo, updateOrderInfos, getConfiguration, changeDone1, changeKeyword1 } from '../../actions';
import Utils from '../../libs/Utils';
import { navigateOnce } from '../../libs/Common';
import { Styles, Colors } from '../../Styles';
import OrderStatusText from '../OrderStatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import ReturnActionButtons from './ReturnActionButtons';
import ReturnActionAllButtons from './ReturnActionAllButtons';
import ActionModal from '../ActionModal';
import { getUpdateOrderInfo } from './Helpers';
import { get3Type } from '../../selectors/index';


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
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }  

  checkRealDone() {
    const { PickItems, ReturnItems } = this.props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.ShopOrders.filter(o => !Utils.checkReturnComplete(o.CurrentStatus));
    console.log(orders.length);
    if (orders.length === 0) return true;
    return false;
  }

  checkKeywork({ OrderCode, ExternalCode }) {
    const keyword = this.props.keyword.toUpperCase(); 
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
      this.props.updateOrderInfos(OrderInfos);
    } else {
      const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
      this.props.updateOrderInfo(this.order.OrderID, moreInfo);
    }
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  render() {
    const { PickItems, ReturnItems, keyword } = this.props;
    const Items = this.PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.ShopOrders.filter(o => this.checkKeywork(o));
    const hidden = orders.length === 0 || keyword !== '' || this.checkRealDone();

    return (
      <Content style={{ backgroundColor: Colors.background }}>
        <ReturnActionAllButtons
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
            keyExtractor={(item, index) => item.OrderID}
            renderItem={({ item }) => {
              const order = item;
              const { 
                OrderCode, RecipientName, RecipientPhone,
                ExternalCode, CODAmount
              } = item;
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
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {ExternalCode}</Text>
                    </View>
                    <View style={Styles.itemStyle}>
                      <Text style={Styles.weakColorStyle}>Nhận: {RecipientName} - {RecipientPhone}</Text>
                    </View>
                    <ReturnActionButtons
                      done={Utils.checkReturnComplete(order.CurrentStatus)}
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
  const { auth, pd, config, returnGroup } = state;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const { configuration } = config;
  const { showDatePicker, OrderInfos, keyword } = returnGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { sessionToken, PickItems, ReturnItems, pdsId, loading, configuration, showDatePicker, OrderInfos, keyword };
};

export default connect(mapStateToProps, { updateOrderInfo, updateOrderInfos, getConfiguration, changeDone1, changeKeyword1 })(PickGroupDetail);
