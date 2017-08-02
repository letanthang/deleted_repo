import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from './actions';
import Utils from './libs/Utils';
import LoadingSpinner from './components/LoadingSpinner';

class PickOrderScreen extends Component {

  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`PickOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const deliveryList = this.props.pds.DeliveryItems;
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = deliveryList.find(o => o.OrderID === OrderID);
    console.log('====================================');
    console.log('PickOrderScreen: cdu');
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
    const order = this.props.navigation.state.params.order;

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
              onPress={() => navigate('DrawerOpen')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body style={{ flex: 3 }}>
            <Title>{OrderCode}</Title>
          </Body>
          <Right>
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
          </Right>
          
        </Header>
        <Content>
          <List>
            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Tổng quan</Text>
            </ListItem>
            <ListItem>
              <Text>Mã nhận hàng</Text>
              <Right>
                <Text>{ExternalCode || 'Không có'}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Mã đơn hàng shop</Text>
              <Right>
                <Text>{ExternalCode || 'Không có'}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Gói dịch vụ</Text>
              <Right>
                <Text>{ServiceName}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Tổng thu người gởi</Text>
              <Right>
                <Text>{ServiceCost} đ</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Phí vận chuyển</Text>
              <Right>
                <Text>{ServiceCost} đ</Text>
              </Right>
            </ListItem>

            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Khối lượng và kích thước</Text>
            </ListItem>
            <ListItem>
              <Text>Khối lượng</Text>
              <Right>
                <Text>{Weight} g</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Kích thước</Text>
              <Right>
                <Text>{Length}cm x {Width}cm x {Height}cm</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Khối lượng qui đổi</Text>
              <Right>
                <Text>{Length * Width * Height * 0.2} g</Text>
              </Right>
            </ListItem>

            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Thông tin khách hàng</Text>
            </ListItem>
            <ListItem>
              <Text>Tên khách hàng</Text>
              <Right>
                <Text>{RecipientName}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Số điện thoại</Text>
              <Right>
                <Button
                  transparent
                  iconRight
                  onPress={() => phonecall(RecipientPhone, true)}
                >
                  <Text>{RecipientPhone}</Text>
                  <Icon name='call' />
                </Button>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Địa chỉ</Text>
              <Right>
                <Text>{Address}</Text>
              </Right>
            </ListItem>


            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Ghi chú</Text>
            </ListItem>
            <ListItem>
              <Text>Ghi chú đơn hàng</Text>
              <Right>
                <Text>{Note}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>Lịch sử đơn hàng</Text>
              <Text>{Log}</Text>
              </Body>
            </ListItem>
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
