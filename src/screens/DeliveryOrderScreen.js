import React, { Component } from 'react';
import { View, Alert, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ActionSheet
} from 'native-base';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus, getConfiguration } from '../actions';
import Utils from '../libs/Utils';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import FormButton from '../components/FormButton';
import LogoButton from '../components/LogoButton';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import { getDeliveryDoneOrderInfo, getDeliveryFailOrderInfo, updateOrderToFailWithReason2 } from './Helper';

let order = {};
class DeliveryOrderScreen extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false }
  componentWillMount() {
  }

  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentDidUpdate() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    order = deliveryList.find(o => o.OrderID === OrderID);
  }

  onChooseDate(date) {
    //string
    // const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    //timestamp
    const timestamp = date.getTime();
    this.confirmUpdateOrderFail(this.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow });
  }
  
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  confirmUpdateOrder() {
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên: Đã giao ?';
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrderToDone() }
      ],
      { cancelable: false }
    );
  }

  updateOrderToDone() {
    const OrderInfos = getDeliveryDoneOrderInfo(order);
    this.props.updateOrderStatus({ OrderInfos });
  }

  confirmUpdateOrderFail(buttonIndex, NewDate = 0) {
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên: Giao lỗi ?';
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrderToFail(buttonIndex, NewDate) }
      ],
      { cancelable: false }
    );
  }
  updateOrderToFailWithReason() {
    updateOrderToFailWithReason2(order.RecipientPhone, this.props.configuration, order.OrderCode)
    .then(({ error, buttonIndex }) => {
      if (error === null) {
        this.confirmUpdateOrderFail(buttonIndex);
      } else if (error === 'cancel') {
      } else if (error === 'moreCall') {
      } else if (error === 'chooseDate') {
        this.buttonIndex = buttonIndex;
        this.setState({ modalShow: true });
      }
    });
  }
  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getDeliveryFailOrderInfo(order, buttonIndex, NewDate);
    this.props.updateOrderStatus({ OrderInfos });
  }
  
  renderButtons(currentStatus) {
    const done = Utils.checkDeliveryComplete(currentStatus);
    if (done) {
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', margin: 8 }}
        >
          <OrderStatusText 
            CurrentStatus={currentStatus}
            PickDeliveryType={2}
          />
        </View>
      );
    }
    return (
      <View style={{ paddingBottom: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='danger'
            disabled={done}
            text='Lỗi'
            width={100}
            onPress={() => this.updateOrderToFailWithReason()}
          />
        </View>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='success'
            disabled={done}
            text='Giao'
            width={100}
            onPress={() => this.confirmUpdateOrder()}
          />
        </View>
      </View>
    );
  }

  render() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    order = deliveryList.find(o => o.OrderID === OrderID);

    const { navigate, goBack } = this.props.navigation;
    const { 
      RecipientName, RecipientPhone, DeliveryAddress, CODAmount,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      DisplayOrder, SONote, Log, CurrentStatus
    } = order;


    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            <LogoButton dispatch={this.props.navigation.dispatch} />
            </View>
            
          </Left>
          <Body style={Styles.bodyStyle}>
            <Title>[{DisplayOrder}] {OrderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <Content style={{ backgroundColor: Colors.row, paddingTop: 0 }}>
          <List>
            <View style={Styles.rowHeaderStyle}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Thông tin khách hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tên khách hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{RecipientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Số điện thoại</Text>
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                  onPress={() => Utils.phoneCall(RecipientPhone, true)}
                >
                  <Text>{RecipientPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowLastStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{DeliveryAddress}</Text>
            </View>
            <View style={Styles.rowHeaderStyle}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Thông tin đơn hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{CODAmount}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Nhà cung cấp</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ClientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>SĐT NCC</Text>
                <Button
                  transparent
                  iconRight
                  small
                  style={{ paddingLeft: 0 }}
                >
                  <Text>{ContactPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{SONote}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Log}</Text>
              </View>
            </View>
            <View style={Styles.rowLastStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú xem hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{RequiredNote}</Text>
            </View>
          </List>

          {this.renderButtons(CurrentStatus)}
          <ActionModal
            visible={this.state.modalShow}
            onChooseDate={this.onChooseDate.bind(this)}
            onCancelDate={this.onCancelDate.bind(this)} 
          />
        </Content>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
    );
  }
}

const mapStateToProps = ({ pd, auth, other }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  const { configuration } = other;
  return { pds, pdsId, sessionToken, loading, configuration };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus, getConfiguration }
)(DeliveryOrderScreen);
