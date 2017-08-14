import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List 
} from 'native-base';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from './actions';
import Utils from './libs/Utils';
import LoadingSpinner from './components/LoadingSpinner';
import { Styles, OrderStyles } from './Styles';

let ClientID = null;
class PickOrderScreen extends Component {
  
  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`PickOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = Utils.getOrder(this.props.pds, OrderID);
    console.log('====================================');
    console.log(`PickOrderScreen: cdu, OrderId = ${OrderID}, order = `);
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

  updateOrderToFail(order) {
    console.log('giao loi pressed');
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
  
  render() {
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = Utils.getOrder(this.props.pds, OrderID);
    ClientID = this.props.navigation.state.params.ClientID;
    //const order = this.props.navigation.state.params.order;

    const { navigate, goBack } = this.props.navigation;
    const { 
      RecipientName, RecipientPhone, Address, ExternalCode,
      ServiceName, TotalCollectedAmount, Width, Height,
      CODAmount, Weight, Length, ServiceCost,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      Note, Log, CurrentStatus
    } = order;

    return (
      <Container>
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
            <Title style={Styles.normalColor}>{OrderCode}</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => navigate('POUpdateWeightSize', { OrderID, ClientID })}
            >
              <Icon name="create" />
            </Button>
          </Right>
          
        </Header>
        <Content>
          <List style={{ backgroundColor: 'white' }}>
            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Tổng quan</Text>
            </View>
            <View style={Styles.rowStyle}> 
              <Text style={[Styles.col1Style, Styles.weakColor]}>Mã nhận hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ExternalCode || 'Không có'}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Mã đơn hàng shop</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ExternalCode || 'Không có'}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Gói dịch vụ</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ServiceName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Tổng thu người gởi</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ServiceCost} đ</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Phí vận chuyển</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{ServiceCost} đ</Text>
            </View>

            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Khối lượng và kích thước</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Khối lượng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Weight} g</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Kích thước</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Length}cm x {Width}cm x {Height}cm</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Khối lượng qui đổi</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Length * Width * Height * 0.2} g</Text>
            </View>

            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Thông tin khách hàng</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Tên khách hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{RecipientName}</Text>
            </View>
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Số điện thoại</Text>
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
            <View style={Styles.rowStyle}>
                <Text style={[Styles.col1Style, Styles.weakColor]}>Địa chỉ</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Address}</Text>
            </View>
            <View style={Styles.rowHeaderStyle}>
              <Text style={{ color: 'white' }}>Ghi chú</Text>
            </View>
            <View style={[Styles.rowStyle]}>
              <Text style={[Styles.col1Style, Styles.weakColor]}>Ghi chú đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Note}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <View>
                <Text style={[Styles.weakColor]}>Lịch sử đơn hàng</Text>
                <Text style={[Styles.midTextStyle, Styles.normalColor]}>{Log}</Text>
              </View>
            </View>
          </List>
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
