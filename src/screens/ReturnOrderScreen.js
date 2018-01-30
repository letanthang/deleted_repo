import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List 
} from 'native-base';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from '../actions';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import OrderStatusText from '../components/OrderStatusText';
import ActionModal from '../components/ActionModal';
import FormButton from '../components/FormButton';
import { getUpdateOrderInfo, getUpdateOrderInfoForDone, updateOrderToFailWithReason2 } from '../components/pickReturn/ReturnHelpers';

let OrderID = null;
let order = {};
class ReturnOrderScreen extends Component {
  state = { modalShow: false } 
  componentWillMount() {
    OrderID = this.props.navigation.state.params.OrderID;
    order = Utils.getOrder(this.props.db, OrderID, 3);
  }

  componentWillReceiveProps(nextProps) {
    const { db } = nextProps;
    const newOrder = Utils.getOrder(db, OrderID, 3);
    if (order.CurrentStatus !== newOrder.CurrentStatus) {
      this.props.navigation.goBack();
    }
    order = newOrder;
  }

  componentDidUpdate() {
  }

  onChooseDate(date) {
    const timestamp = date.getTime();
    this.updateOrderToFail(this.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow });
  }

  confirmUpdateOrderToDone() {
    const message = 'Bạn có chắc chắn muốn cập nhật đơn hàng trên sang đã trả ?';
    const title = 'Cập nhật đơn hàng thành đã trả ?';
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
    const OrderInfos = getUpdateOrderInfoForDone(order);
    this.props.updateOrderStatus({ OrderInfos });
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {
    const OrderInfos = getUpdateOrderInfo(order, buttonIndex, NewDate);
    this.props.updateOrderStatus({ OrderInfos });
  }

  updateOrderToFailWithReason() {
    updateOrderToFailWithReason2(order.ContactPhone, this.props.configuration, order.OrderCode)
    .then(({ error, buttonIndex }) => {
      if (error === null) {
        this.updateOrderToFail(buttonIndex);
      } else if (error === 'cancel') {
      } else if (error === 'moreCall') {
      } else if (error === 'chooseDate') {
        this.buttonIndex = buttonIndex;
        this.setState({ modalShow: true });
      }
    });
  }

  renderButtons() {
    const done = Utils.checkReturnComplete(order);
    if (done) {
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', margin: 8 }}
        >
          <OrderStatusText 
            order={order}
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
            onPress={this.updateOrderToFailWithReason.bind(this)}
          />
        </View>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='success'
            disabled={done}
            text='Trả'
            width={100}
            onPress={this.confirmUpdateOrderToDone.bind(this)}
          />
        </View>
      </View>
    );
  }
  
  render() {

    const { goBack } = this.props.navigation;
    const { 
      RecipientName, RecipientPhone, OrderCode, DeliveryAddress,
      SONote, RequiredNote, Log, CurrentStatus
    } = order;

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          
          <Body style={Styles.bodyStyle}>
            <Title>{OrderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle}>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
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
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{DeliveryAddress}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{SONote}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú xem hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{RequiredNote}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Log}</Text>
              </View>
            </View>
          </List>
          {this.renderButtons()}
        </Content>
        <LoadingSpinner loading={this.props.loading} />
        <ActionModal
          visible={this.state.modalShow}
          onChooseDate={this.onChooseDate.bind(this)}
          onCancelDate={this.onCancelDate.bind(this)} 
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth, config } = state;
  const { configuration } = config;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const db = getOrders(state);
  return { db, pdsId, sessionToken, loading, configuration };
};

export default connect(
  mapStateToProps, 
  { updateOrderStatus }
)(ReturnOrderScreen);
