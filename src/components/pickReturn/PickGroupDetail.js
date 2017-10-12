import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
// import * as Communications from 'react-native-communications';
import { 
  Content, List
} from 'native-base';
import { updateOrderStatus, getConfiguration, updateAllOrderInfo } from '../../actions';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import OrderStatusText from '../OrderStatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import ActionButtons from './ActionButtons';
import ActionModal from './ActionModal';
import { updateOrderToFailWithReason, getUpdateOrderInfo } from './Helpers';


class PickGroupDetail extends Component {
  state = { OrderInfos: {}, keyword: '', modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  
  pickGroup = null;
  ClientHubID = null;
  PickDeliveryType = null;
  order = {};
  
  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    console.log('====================================');
    console.log('PickgGroupDetail cwm');
    console.log('====================================');    
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
  }

  componentDidMount() {
    console.log('PickgGroupDetail cdm');
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    console.log('PickgGroupDetail cwrp');
    const { keyword } = nextProps;
    console.log(this.props.pds.PickItems);
    this.setState({ keyword });
  }


  updateOrders(orders, status, infos = {}) {
    const { pickGroup, ClientHubID } = this;
    const { sessionToken, pdsId } = this.props;
    const { PickDeliveryType } = pickGroup;
    console.log(`updateOrders to status : ${status} | pdsId ${pdsId} | ClientHubID ${ClientHubID}`);
    console.log(orders);
    const ordersInfo = _.map(orders, (item) => {
      const { OrderID, PickDeliverySessionDetailID } = item;
      return { OrderID, PickDeliverySessionDetailID };
    });
    console.log(ordersInfo);

    this.props.updateOrderStatus({ 
      sessionToken,
      pdsId,
      PickDeliverySessionDetailID: null, 
      OrderID: ordersInfo, 
      PickDeliveryType, 
      status,
      ClientHubID,
      ...infos 
    });
  }

  checkComplete({ CurrentStatus, PickDeliveryType }) {
    if (PickDeliveryType === 1) {
      return Utils.checkPickComplete(CurrentStatus);
    } else {
      return Utils.checkReturnComplete(CurrentStatus);
    }
  }
  checkKeywork({ OrderCode }) {
    return this.state.keyword === '' || OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase());
  }
  onOrderPress(order) {
    console.log(`onOrderPress called with type = ${this.pickGroup.PickDeliveryType}, order=`);
    console.log(order);
    const { navigate } = this.props.navigation;
    const { OrderID } = order;
    const { ClientID, ClientHubID } = this.pickGroup;
    
    if (this.PickDeliveryType === 1) {
      navigate('PickOrder', { OrderID, order, ClientID, ClientHubID });
    } else if (this.PickDeliveryType === 3) {
      navigate('ReturnOrder', { OrderID, order, ClientHubID });
    }
  }

  onChooseDate(date) {    
    const timestamp = date.getTime();
    const moreInfo = getUpdateOrderInfo(this.order, this.buttonIndex, timestamp);
    this.setStateOrderInfo(this.order, this.info, moreInfo);
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  setStateOrderInfo(order, info, moreInfo = null) {
    const OrderInfos = _.clone(this.state.OrderInfos);
    if (moreInfo) {
      OrderInfos[order.OrderID] = { ...info, ...moreInfo };
    } else {
      OrderInfos[order.OrderID] = info;
    }
    this.props.updateAllOrderInfo(OrderInfos);
    this.setState({ OrderInfos });
  }

  renderActionButtons(rightText, order) {
    const { OrderID, ContactPhone } = order;
    return (
      <ActionButtons 
        info={this.state.OrderInfos[OrderID]}
        order={order}
        onInfoChanged={info => {
          if (info === undefined || info.success) {
            this.setStateOrderInfo(order, info);
          } else {
            // ask for reason
            updateOrderToFailWithReason(ContactPhone, this.props.configuration, (error, buttonIndex) => {
              console.log(' call back !');
              if (error === null) {
                //console.log('set state to loi');
                const moreInfo = getUpdateOrderInfo(order, buttonIndex);
                this.setStateOrderInfo(order, info, moreInfo);
              } else if (error === 'moreCall') {
                console.log('moreCall');
              } else if (error === 'chooseDate') {
                this.order = order;
                this.info = info;
                this.buttonIndex = buttonIndex;
                this.setState({ modalShow: true });
              }
            });
          }
        }} 
      />
    );
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

  render() {
    console.log(this.state);
    const { done, pds } = this.props;
    const Items = this.PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === done && this.checkKeywork(o));

    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log('====================================');

    return (
      <Content style={{ backgroundColor: Colors.background }}>
        <View style={Styles.actionAllWrapperStyle}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cập nhật tất cả thành: </Text>
          {/* <ActionButtons /> */}
        </View>
        <DataEmptyCheck
          data={orders}
          message='Không có dữ liệu'
        >
          <View>
          <FlatList 
            data={orders}
            renderItem={({ item }) => {
              const { 
                OrderCode, RecipientName, RecipientPhone, PickDeliveryType,
                Height, Width, Weight, Length, CurrentStatus,
                ExternalCode, CODAmount
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
                    {!done ? this.renderActionButtons(rightText, item) : null}
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

const mapStateToProps = ({ auth, pd, other }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  const { configuration } = other;
  return { sessionToken, pdsId, pds, loading, configuration };
};


export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateAllOrderInfo })(PickGroupDetail);
