import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, Modal, Button as Btn } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ActionSheet 
} from 'native-base';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus, getConfiguration } from '../actions';
import Utils from '../libs/Utils';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, OrderStyles, Colors } from '../Styles';
import DataEmptyCheck from '../components/DataEmptyCheck';
import LogoButton from '../components/LogoButton';
import FormButton from '../components/FormButton';
import DatePicker from '../components/DatePicker';
import OrderStatusText from '../components/OrderStatusText';
import { PickErrors } from '../components/Constant';

let ClientID = null;
let ClientHubID = null;
let OrderID = null;
let order = {};
class PickOrderScreen extends Component {
  state = { modalShow: false, date: new Date(), buttonIndex: null, androidDPShow: false }
  buttons = null;
  codes = null;
  cancelIndex = null;
  destructiveIndex = -1;
  changeDateIndex = null;
  cannotContactIndex = null;
  cannotCallIndex = null;
  notHangUpIndex = null;

  componentWillMount() {
    ClientID = this.props.navigation.state.params.ClientID;
    ClientHubID = this.props.navigation.state.params.ClientHubID;
    OrderID = this.props.navigation.state.params.OrderID;

    this.buttons = Object.values(PickErrors);
    this.buttons.push('Cancel');
    this.codes = Object.keys(PickErrors);
    this.cancelIndex = this.buttons.length - 1;
    this.changeDateIndex = 0;
    this.cannotContactIndex = 1;
    this.cannotCallIndex = 2;
    this.notHangUpIndex = 3;
    console.log('====================================');
    console.log(`PickOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }
  componentDidMount() {
    console.log('PickOrderScreen cdm');
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentDidUpdate() {
    order = Utils.getOrder(this.props.pds, OrderID, ClientHubID, 1);
    console.log('====================================');
    console.log(`PickOrderScreen: cdu, OrderId = ${OrderID}, order = `);
    console.log(order);
    console.log('====================================');
  }
  
  render() {
    order = Utils.getOrder(this.props.pds, OrderID, ClientHubID, 1);
    const { navigate, goBack } = this.props.navigation;
    if (!order) {
      goBack();
      return this.renderNullData();
    } 

    const { 
      RecipientName, RecipientPhone, Address, ExternalCode,
      ServiceName, TotalCollectedAmount, Width, Height,
      CODAmount, Weight, Length, ServiceCost,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      Note, Log, CurrentStatus
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
            <Title>{OrderCode}</Title>
          </Body>
          <Right style={{ flex: 0.25 }}>
            <Button
              transparent
              onPress={() => navigate('POUpdateWeightSize', { OrderID, ClientID, ClientHubID })}
            >
              <Icon name="create" />
            </Button>
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
          <DataEmptyCheck
            data={order}
            message='Không có dữ liệu'
          >
            <List>
              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Tổng quan</Text>
              </View>
              <View style={Styles.rowStyle}> 
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã nhận hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ExternalCode || 'Không có'}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Mã đơn hàng shop</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ExternalCode || 'Không có'}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Gói dịch vụ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ServiceName}</Text>
              </View>
              <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu người gởi</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(CODAmount)} đ</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Phí vận chuyển</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ServiceCost} đ</Text>
              </View>

              <View style={Styles.rowHeaderStyle}>
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Khối lượng và kích thước</Text>
              </View>
              <View style={Styles.rowStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Khối lượng</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Weight} g</Text>
              </View>
              <View style={Styles.rowStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Kích thước</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Length}cm x {Width}cm x {Height}cm</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                  <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Khối lượng qui đổi</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Length * Width * Height * 0.2} g</Text>
              </View>

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
                    onPress={() => phonecall(RecipientPhone, true)}
                    style={{ paddingLeft: 0 }}
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
                <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Ghi chú</Text>
              </View>
              <View style={[Styles.rowStyle]}>
                <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Ghi chú đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Note}</Text>
              </View>
              <View style={Styles.rowLastStyle}>
                <View>
                  <Text style={[Styles.weakColorStyle]}>Lịch sử đơn hàng</Text>
                  <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{Log}</Text>
                </View>
              </View>
            </List>
            {this.renderButtons(CurrentStatus)}
          </DataEmptyCheck>
        </Content>
        <LoadingSpinner loading={this.props.loading} />
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
                  mode='date'
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
      </Container>
    );
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

  confirmUpdateOrderToDone() {
    const message = order === null ? 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang đã lấy?' : '';
    const title = order === null ? 'Cập nhật đồng loạt đơn hàng thành đã lấy ?' : 'Cập nhật đơn hàng thành đã lấy ?';
    Alert.alert(
      title,
      message,
      [
        { text: 'Đồng ý', onPress: () => this.updateOrderToDone() },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  confirmUpdateOrderToFail() {
    const message = 'Bạn có chắc chắn muốn cập nhật tất cả đơn hàng đang chạy sang lỗi?';
    Alert.alert(
      'Cập nhật đồng loạt đơn hàng thành lấy lỗi?',
      message,
      [
        { text: 'Đồng ý', onPress: () => this.updateOrderToFailWithReason(null) },
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );
  }
  
  updateOrderToDone() {
    if (order !== null) {
      if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
      
      const status = 'Storing';
      this.updateOrder(status);
    }
  }
  updateOrderToFailWithReason() {
    console.log('updateOrderToFailWithReason pressed');
    ActionSheet.show(
      {
        options: this.buttons,
        cancelButtonIndex: this.cancelIndex,
        destructiveButtonIndex: this.destructiveIndex,
        title: 'Chọn lý do lấy lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${typeof buttonIndex}${typeof this.changeDateIndex}`);

        if (buttonIndex == this.changeDateIndex) {
          console.log('Hien modal popup');
          this.setState({ modalShow: true, buttonIndex });
        } else if (buttonIndex == this.cannotCallIndex || buttonIndex == this.cannotContactIndex) {
          //cannot contact
          Utils.validateCallCannotContact(order.ContactPhone, this.props.configuration)
            .then((result) => {
              console.log(result);
              if (result) { 
                this.updateOrderToFail(buttonIndex); 
              } else {
                this.alertMissOfCall(order.ContactPhone);
              } 
            });
        } else if (buttonIndex == this.notHangUpIndex) {
          console.log(order.ContactPhone);
          //cannot contact
          Utils.validateCallNotHangUp(order.ContactPhone, this.props.configuration)
            .then((result) => {
              console.log(result);
              if (result) { 
                this.updateOrderToFail(buttonIndex); 
              } else {
                this.alertMissOfCall(order.ContactPhone);
              }
            });
        } else {
          this.updateOrderToFail(buttonIndex);
        }
      }
    );
  }

  updateOrderToFail(buttonIndex, NewDate = 0) {  
    if (order.CurrentStatus !== 'Picking' && order.CurrentStatus !== 'Returning') return;
    
    const StoringCode = this.codes[buttonIndex]; 
    const reason = this.buttons[buttonIndex];
    const Log = `${StoringCode}|${reason}`;

    let status = null;
    let infos = {};
    
    status = 'ReadyToPick';     
    infos = { StoringCode, NewDate, Log };
    
    this.updateOrder(status, infos);
  }

  updateOrder(status, infos = {}) {
   
    const { sessionToken, pdsId } = this.props;
    const { PickDeliverySessionDetailID } = order;
   
    console.log(`updateOrder to status : ${status} | pdsId ${pdsId} | ClientHubID ${ClientHubID}`);
    console.log(order);
    this.props.updateOrderStatus({ 
      sessionToken,
      pdsId,
      PickDeliverySessionDetailID, 
      OrderID, 
      PickDeliveryType: 1, 
      status,
      ClientHubID,
      ...infos 
    });
  }

  onChooseDate() {
    const date = this.state.date;
    //string
    const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    console.log(stringDate);
    //timestamp
    const timestamp = this.state.date.getTime();
    this.updateOrderToFail(this.state.buttonIndex, timestamp);
    this.setState({ modalShow: !this.state.modalShow, buttonIndex: null, androidDPShow: false });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow, date: new Date(), androidDPShow: false });
  }
  
  renderNullData() {
    return (
      <Container>
        <Header />
        <Content style={{ padding: 16 }}>
          <Body><Text>Đơn hàng không tồn tài</Text></Body>
        </Content>
      </Container>
    );
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
            text='Lấy'
            width={100}
            onPress={this.confirmUpdateOrderToDone.bind(this)}
          />
        </View>
      </View>
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
  { updateOrderStatus, getConfiguration }
)(PickOrderScreen);
