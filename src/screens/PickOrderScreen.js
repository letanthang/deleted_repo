import React, { Component } from 'react';
import { View } from 'react-native';
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
import { Styles, OrderStyles, Colors } from '../Styles';
import DataEmptyCheck from '../components/DataEmptyCheck';

let ClientID = null;
let ClientHubID = null;
let OrderID = null;
class PickOrderScreen extends Component {
  
  componentWillMount() {
    ClientID = this.props.navigation.state.params.ClientID;
    ClientHubID = this.props.navigation.state.params.ClientHubID;
    OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`PickOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const order = Utils.getOrder(this.props.pds, OrderID, ClientHubID, 1);
    console.log('====================================');
    console.log(`PickOrderScreen: cdu, OrderId = ${OrderID}, order = `);
    console.log(order);
    console.log('====================================');
  }

  updateOrderToDone(order) {
    const { sessionToken, pdsId } = this.props;
    const { PickDeliveryType, PickDeliverySessionDetailID } = order;
    const status = 'Delivered';
    this.props.updateOrderStatus({ 
      sessionToken, pdsId, PickDeliverySessionDetailID, OrderID, PickDeliveryType, status 
    });
  }

  updateOrderToFail(order) {
    console.log('giao loi pressed');
    const { sessionToken, pdsId } = this.props;
    const { PickDeliveryType, PickDeliverySessionDetailID } = order;
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
  
  render() {
    const order = Utils.getOrder(this.props.pds, OrderID, ClientHubID, 1);
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
          <Left>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>{OrderCode}</Title>
          </Body>
          <Right>
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
                <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ServiceCost} đ</Text>
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
          </DataEmptyCheck>
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
)(PickOrderScreen);
