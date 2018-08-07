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
import OrderStatusText from '../../components/OrderStatusText';
import DataEmptyCheck from '../../components/DataEmptyCheck';
import ReturnActionButtons from './ReturnActionButtons';
import ReturnActionAllButtons from './ReturnActionAllButtons';
import ActionModal from '../../components/ActionModal';
import { getUpdateOrderInfo } from '../../components/ReturnHelpers';
import { get3Type } from '../../selectors/index';


class PickGroupDetail extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  
  pickGroup = null;
  senderHubId = null;
  type = null;
  order = {};
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.senderHubId = this.pickGroup.senderHubId;
    this.type = this.pickGroup.type;
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }  

  checkRealDone() {
    const { PickItems, ReturnItems } = this.props;
    const Items = this.type === 'PICK' ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    const orders = pickGroup.ShopOrders.filter(o => !o.done);
    if (orders.length === 0) return true;
    return false;
  }

  checkKeywork({ orderCode, externalCode }) {
    const keyword = this.props.keyword.toUpperCase(); 
    return this.props.keyword === '' 
      || orderCode.toUpperCase().includes(keyword)
      || (externalCode && externalCode.toUpperCase().includes(keyword));
  }
  onOrderPress(order) {
    const { orderCode } = order;
    const { clientId, senderHubId } = this.pickGroup;
    
    if (this.type === 'PICK' || this.type === 'TRANSIT_IN') {
      navigateOnce(this, 'PickOrder', { orderCode, order, clientId, senderHubId, type: this.type });
    } else if (this.type === 'RETURN') {
      navigateOnce(this, 'ReturnOrder', { orderCode, order, senderHubId, type: this.type });
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

  render() {
    console.log('ReturnGroupDetail render!');
    const { PickItems, ReturnItems, keyword } = this.props;
    const Items = this.type === 'PICK' ? PickItems : ReturnItems;
    const pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
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
            keyExtractor={(item, index) => item.orderCode}
            renderItem={({ item }) => {
              const order = item;
              const { 
                orderCode, receiverName, receiverPhone,
                externalCode, collectAmount, willSucceeded, note, newDate
              } = item;
              const fullNote = Utils.getFullNote(note, newDate);
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
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(collectAmount)} đ</Text>
                    </View>
                    {willSucceeded === false ?
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle, { color: '#FF7F9C' }]}>{fullNote}</Text>
                    </View>
                    : null}
                    {externalCode ?
                    <View style={Styles.itemStyle}>
                      <Text style={[Styles.weakColorStyle]}>Mã ĐH shop: {externalCode}</Text>
                    </View>
                    : null}
                    <View style={Styles.itemStyle}>
                      <Text style={Styles.weakColorStyle}>Nhận: {receiverName} - {receiverPhone}</Text>
                    </View>
                    <ReturnActionButtons
                      done={order.done}
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
  const { tripCode, loading } = pd;
  const { configuration } = config;
  const { keyword } = returnGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { sessionToken, PickItems, ReturnItems, tripCode, loading, configuration, keyword };
};

export default connect(mapStateToProps, { updateOrderInfo, updateOrderInfos, getConfiguration, changeDone1, changeKeyword1 })(PickGroupDetail);
