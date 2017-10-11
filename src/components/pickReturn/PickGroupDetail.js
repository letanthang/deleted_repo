import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
// import * as Communications from 'react-native-communications';
import { 
  Content, List
} from 'native-base';
import { updateOrderStatus, getConfiguration } from '../../actions';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import OrderStatusText from '../OrderStatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import ActionButtons from './ActionButtons';
import ActionModal from './ActionModal';
import { PickErrors, ReturnErrors } from '../Constant';

class PickGroupDetail extends Component {
  state = { OrderInfos: {}, keyword: '', modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  buttons = null;
  codes = null;
  cancelIndex = null;
  destructiveIndex = -1;
  changeDateIndex = null;
  cannotContactIndex = null;
  cannotCallIndex = null;
  notHangUpIndex = null;
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
  
    this.buttons = Object.values(PickErrors);
    this.buttons.push('Cancel');
    this.codes = Object.keys(PickErrors);
    this.cancelIndex = this.buttons.length - 1;
    this.changeDateIndex = 0;
    this.cannotContactIndex = 1;
    this.cannotCallIndex = 2;
    this.notHangUpIndex = 3;
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
    this.updateOrderToFail(this.order, this.state.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow, buttonIndex: null });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  renderActionButtons(rightText, order) {
    console.log(order);
    const OrderID = order.OrderID;
    return (
      <ActionButtons 
        info={this.state.OrderInfos}
        order={order}
        onInfoChanged={info => {
          const OrderInfos = _.cloneDeep(this.state.OrderInfos);
          OrderInfos[OrderID] = info;
          this.setState({ OrderInfos });
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
            renderItem={(order) => {
              const { 
                OrderCode, RecipientName, RecipientPhone, PickDeliveryType,
                Height, Width, Weight, Length, CurrentStatus,
                ExternalCode, CODAmount
              } = order;
              const rightText = 'LẤY';
              return (
                <TouchableOpacity
                  onPress={this.onOrderPress.bind(this, order)}
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
                    
                    {this.renderActionButtons(rightText, order)}
                    
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


export default connect(mapStateToProps, { updateOrderStatus, getConfiguration })(PickGroupDetail);
