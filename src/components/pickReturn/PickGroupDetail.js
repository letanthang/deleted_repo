import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
// import * as Communications from 'react-native-communications';
import { 
  Content, List
} from 'native-base';
import { updateOrderStatus, getConfiguration, updateAllOrderInfo, updateOrderInfo, setAllStatus } from '../../actions';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import OrderStatusText from '../OrderStatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import ActionButtons from './ActionButtons';
import ActionAllButtons from './ActionAllButtons';
import ActionModal from '../ActionModal';
import { getUpdateOrderInfo } from './Helpers';


class PickGroupDetail extends Component {
  state = { keyword: '', modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false };
  
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

  render() {
    const { done, pds } = this.props;
    const Items = this.PickDeliveryType === 1 ? pds.PickItems : pds.ReturnItems;
    const pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    const orders = pickGroup.PickReturnSOs.filter(o => this.checkComplete(o) === done && this.checkKeywork(o));

    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log('====================================');

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
}

const mapStateToProps = ({ auth, pd, other, pickGroup }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  const { configuration } = other;
  const { showDatePicker, OrderInfos } = pickGroup;
  return { sessionToken, pdsId, pds, loading, configuration, showDatePicker, OrderInfos };
};

export default connect(mapStateToProps, { updateOrderStatus, getConfiguration, updateAllOrderInfo, updateOrderInfo, setAllStatus })(PickGroupDetail);
