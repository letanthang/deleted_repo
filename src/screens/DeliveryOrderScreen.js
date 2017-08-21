import React, { Component } from 'react';
import { View, Modal, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem, ActionSheet 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from '../actions';
import Utils from '../libs/Utils';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import FormButton from '../components/FormButton';

const BUTTONS = ['KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG', 'KHÁCH ĐỔI Khong nghe may', 'Khach huy don giao', 'Khach chon ngay giao khac', 'Cancel'];
const DESTRUCTIVE_INDEX = -1;
const CHANGE_DATE_INDEX = 3;
const CANCEL_INDEX = 4;

class DeliveryOrderScreen extends Component {
  state = { modalShow: false }
  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`DeliveryOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = deliveryList.find(o => o.OrderID === OrderID);
    console.log('====================================');
    console.log('DeliveryOrderScreen cdu');
    console.log(order);
    console.log('====================================');
  }

  updateOrderToDone(order) {
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Delivered';
    this.props.updateOrderStatus({ 
      sessionToken, pdsId, PickDeliverySessionDetailID, OrderID, PickDeliveryType, status 
    });
  }

  updateOrderToFailWithReason(order) {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Chọn lý do giao lỗi'
      },
      buttonIndex => {
        console.log(`updateOrderToFailWithReason : ${buttonIndex}`);
        if (buttonIndex !== CANCEL_INDEX 
          && buttonIndex !== CHANGE_DATE_INDEX 
          && buttonIndex !== DESTRUCTIVE_INDEX) {
          this.updateOrderToFail(order, BUTTONS[buttonIndex]);
        } else if (buttonIndex === CHANGE_DATE_INDEX) {
          this.setState({ modalShow: true });
        }
      }
    );
  }

  updateOrderToFail(order, reason) {
    console.log(`giao loi pressed with reason ${reason}`);
    const { sessionToken, pdsId } = this.props;
    const { OrderID, PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Storing';
    const StoringCode = 'GHN-SC9649';
    const NewDate = 0;
    const Log = 'GHN-SC9649|KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG';
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
  
  renderButtons(order, currentStatus) {
    const done = Utils.checkDeliveryComplete(currentStatus);
    return (
      <Grid style={{ height: 70, marginTop: 20, marginBottom: 20 }}>
        <Col style={{ margin: 2 }}>
          <FormButton
            disabled={done}
            text='Giao Lỗi'
            onPress={this.updateOrderToFailWithReason.bind(this, order)}
          />
        </Col>
        <Col style={{ margin: 2 }}>
          <FormButton
            disabled={done}
            text='Đã Giao'
            onPress={this.updateOrderToFailWithReason.bind(this, order)}
          />
        </Col>
      </Grid>
    );
  }

  renderDisabledButtons() {
    return (
      <Grid>
        <Col style={{ margin: 2 }}>
          <Button block disabled style={{ backgroundColor: '#aaa' }}>
          <Text>GIAO LỖI</Text>
          </Button>
        </Col>
        <Col style={{ margin: 2 }}>
        <Button block disabled style={{ backgroundColor: '#aaa' }}>
          <Text>ĐÃ GIAO</Text>
          </Button>
        </Col>
      </Grid>
    );
  }

  
  render() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = deliveryList.find(o => o.OrderID === OrderID);

    const { navigate, goBack } = this.props.navigation;
    const { 
      RecipientName, RecipientPhone, Address, CODAmount,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      DisplayOrder, Note, Log, CurrentStatus, NextStatus
    } = order;

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>[{DisplayOrder}] {OrderCode}</Title>
          </Body>
          <Right>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: Colors.row, paddingTop: 16 }}>
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

          {this.renderButtons(order, CurrentStatus)}
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalShow}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
            style={{ backgroundColor: 'red' }}
            >
            <View style={{ alignSelf: 'center', alignItems: 'center', backgroundColor: 'green' }}>
              <View>
                <Text>Hello World!</Text>

                <TouchableHighlight 
                  onPress={() => {
                    this.setState({ modalShow: !this.state.modalShow });
                  }}
                >
                  <Text>Hide Modal</Text>
                </TouchableHighlight>

              </View>
            </View>
          </Modal>
        </Content>
        <LoadingSpinner loading={this.props.loading} />
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
)(DeliveryOrderScreen);
