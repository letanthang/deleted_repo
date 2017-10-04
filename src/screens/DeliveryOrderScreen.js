import React, { Component } from 'react';
import { View, Modal, Alert, TouchableHighlight, DatePickerIOS, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem, ActionSheet 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus, getConfiguration } from '../actions';
import Utils from '../libs/Utils';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import FormButton from '../components/FormButton';
import LogoButton from '../components/LogoButton';
import DatePicker from '../components/DatePicker';
import OrderStatusText from '../components/OrderStatusText';
import { DeliveryErrors } from '../components/Constant';

const BUTTONS = Object.values(DeliveryErrors);
BUTTONS.push('Cancel');
const CODES = Object.keys(DeliveryErrors);
const DESTRUCTIVE_INDEX = -1;
const CHANGE_DATE_INDEX = BUTTONS.length - 3;
const CUSTOMER_CHANGE_DATE_INDEX = 3;
const CANCEL_INDEX = BUTTONS.length - 1;

let order = {};
class DeliveryOrderScreen extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false }
  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`DeliveryOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidMount() {
    console.log('DeliveryOrderScreen cdm');
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentDidUpdate() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    order = deliveryList.find(o => o.OrderID === OrderID);
    console.log('====================================');
    console.log('DeliveryOrderScreen cdu');
    console.log(order);
    console.log('====================================');
  }

  updateOrderToDone() {
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Delivered';
    this.props.updateOrderStatus({ 
      sessionToken, pdsId, PickDeliverySessionDetailID, OrderID, PickDeliveryType, status 
    });
  }

  alertMissOfCall(phoneNumber) {
    console.log(phoneNumber);
    const title = 'Không đủ số cuộc gọi.';
    const message = 'Bạn không thực hiện đủ số cuộc gọi cho khách hàng. Gọi bây giờ?';
    Alert.alert(
      title,
      message,
      [
        { text: 'Gọi', onPress: () => phonecall(phoneNumber, true) },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  updateOrderToFailWithReason() {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Chọn lý do giao lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${buttonIndex} ${CANCEL_INDEX} ${CHANGE_DATE_INDEX}`);
        if (buttonIndex == CANCEL_INDEX) {
          return;
        } else if (buttonIndex == CHANGE_DATE_INDEX || buttonIndex == CUSTOMER_CHANGE_DATE_INDEX) {
          this.setState({ modalShow: true, buttonIndex });
        } else if (buttonIndex == 0 || buttonIndex == 1) {
          //cannot contact
          Utils.validateCallCannotContact(order.RecipientPhone, this.props.configuration)
          .then((result) => {
            if (result) {
              this.updateOrderToFail(buttonIndex); 
            } else {
              this.alertMissOfCall(order.RecipientPhone);
            }
          });
        } else if (buttonIndex == 2) {
          //cannot contact
          Utils.validateCallNotHangUp(order.RecipientPhone, this.props.configuration)
            .then((result) => {
              if (result) {
                this.updateOrderToFail(buttonIndex);
              } else {
                this.alertMissOfCall(order.RecipientPhone);
              }
            });
        } else {
          this.updateOrderToFail(buttonIndex);
        }
      }
    );
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {
    const StoringCode = CODES[buttonIndex]; 
    const reason = BUTTONS[buttonIndex];
    const Log = `${StoringCode}|${reason}`;
    console.log(`giao loi pressed with reason ${reason}`);
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Storing';
    this.props.updateOrderStatus({ 
      sessionToken, 
      pdsId, 
      PickDeliverySessionDetailID, 
      OrderID, 
      PickDeliveryType, 
      status,
      StoringCode,
      NewDate,
      Log 
    });
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
            onPress={this.updateOrderToFailWithReason.bind(this)}
          />
        </View>
        <View style={{ margin: 2 }}>
          <FormButton
            theme='success'
            disabled={done}
            text='Giao'
            width={100}
            onPress={this.updateOrderToDone.bind(this)}
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
      RecipientName, RecipientPhone, Address, CODAmount,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      DisplayOrder, Note, Log, CurrentStatus, NextStatus
    } = order;


    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={{ flex: 0.22 }}>
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
          <Body style={{ flex: 0.53 }}>
            <Title>[{DisplayOrder}] {OrderCode}</Title>
          </Body>
          <Right style={{ flex: 0.25 }}>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
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
                  onPress={() => phonecall(RecipientPhone, true)}
                >
                  <Text>{RecipientPhone}</Text>
                  <Icon name='call' />
                </Button>
            </View>
            <View style={Styles.rowLastStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Address}</Text>
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
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Note}</Text>
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
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalShow}
            onShow={() => this.setState({ androidDPShow: true })}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
          >
            <View 
              style={{ 
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#000000aa'
              }}
            >
              <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 10 }} >
                <Text
                  style={{ alignSelf: 'center', color: 'black', fontWeight: 'bold', margin: 20 }}
                >
                  Chọn ngày
                </Text>
                <DatePicker
                  date={this.state.date}
                  androidDPShow={this.state.androidDPShow}
                  onDateChange={(date) => {
                    this.setState({ date });
                    console.log(`date changed to : ${date}`);
                    }}
                />
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
                >
                    <Btn
                      onPress={this.onChooseDate.bind(this)}
                      title='ĐỒNG Ý'
                      color='#057AFF'
                    />
                </View>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
                >
                    <Btn
                      onPress={this.onCancelDate.bind(this)}
                      title='HUỶ'
                      color='#057AFF'
                    />
                </View>
              </View>
            </View>
          </Modal>
        </Content>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
    );
  }
  onChooseDate() {
    const date = this.state.date;
    //string
    const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    console.log(stringDate);
    //timestamp
    const timestamp = this.state.date.getTime();
    this.updateOrderToFail(this.state.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow, buttonIndex: null });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow, date: new Date() });
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
