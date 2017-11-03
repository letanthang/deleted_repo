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
    order = Utils.getOrder(this.props.pds, OrderID);
    console.log('====================================');
    console.log(`ReturnOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentWillReceiveProps(nextProps) {
    const { pds } = nextProps;
    order = Utils.getOrder(pds, OrderID);
  }

  componentDidUpdate() {
    console.log('====================================');
    console.log('ReturnOrderScreen: cdu');
    console.log('====================================');
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
        console.log('user cancel');
      } else if (error === 'moreCall') {
        console.log('not enough call');
      } else if (error === 'chooseDate') {
        this.buttonIndex = buttonIndex;
        this.setState({ modalShow: true });
      }
    });
  }

  renderButtons(CurrentStatus) {
    const done = Utils.checkReturnComplete(CurrentStatus);
    if (done) {
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', margin: 8 }}
        >
          <OrderStatusText 
            CurrentStatus={CurrentStatus}
            PickDeliveryType={1}
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
          {this.renderButtons(CurrentStatus)}
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

const mapStateToProps = ({ pd, auth }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  return { pds, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus }
)(ReturnOrderScreen);
