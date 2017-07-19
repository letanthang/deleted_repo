import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { updateOrderStatus } from './actions';



class DeliveryOrderScreen extends Component {
  componentWillMount() {
    console.log(`DeliveryOrderScreen: cwm called with
     OrderID = ${this.props.navigation.state.params.OrderID}`);
    console.log(this.props.deliveryList);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('cdu called');
  }

  render() {
    const { navigate } = this.props.navigation;
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log(`hhhhhhhhhhhhhhhhhhhh render orderid = ${OrderID}`);
    const orders = this.props.deliveryList.filter(order => order.OrderID === OrderID);

    if (orders.length === 0) return <View><Text>Not found</Text></View>;

    const { 
      RecipientName, RecipientPhone, Address, CODAmount,
      ClientName, ContactPhone, RequiredNote, OrderCode,
      DisplayOrder, Note, Log
    } = orders[0];

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
          <Body>
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
        <Content>
          <List>
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
                <Text>{RecipientPhone}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Text>Địa chỉ</Text>
              <Right>
                <Text>{Address}</Text>
              </Right>
            </ListItem>
            <ListItem itemHeader first style={{ backgroundColor: '#06B2F5' }}>
              <Text style={{ color: 'white' }}>Thông tin đơn hàng</Text>
            </ListItem>
            <ListItem>
              <Text>Tổng thu</Text>
              <Right><Text>{CODAmount}</Text></Right>
            </ListItem>
            <ListItem>
              <Text>Nhà cung cấp</Text>
              <Right><Text>{ClientName}</Text></Right>
            </ListItem>
            <ListItem>
              <Text>SĐT NCC</Text>
              <Right>
                <Text>{ContactPhone}</Text>
              </Right>
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
            <ListItem>
              <Text>Ghi chú xem hàng</Text>
              <Right>
                <Text>{RequiredNote}</Text>
              </Right>
            </ListItem>
          </List>

          <Grid>
            <Col style={{ margin: 2 }}>
              <Button block style={{ backgroundColor: '#06B2F5' }}>
              <Text>GIAO LỖI</Text>
              </Button>
            </Col>
            <Col style={{ margin: 2 }}>
            <Button block style={{ backgroundColor: '#06B2F5' }}>
              <Text>ĐÃ GIAO</Text>
              </Button>
            </Col>
          </Grid>
        </Content>
      </Container>
      
    );
  }
}

const mapStateToProps = ({ pd }, ownProps) => {
  const OrderID = ownProps.navigation.state.params.OrderID;
  const { deliveryList } = pd;
  return { deliveryList, order: deliveryList[OrderID] };
};


export default connect(mapStateToProps, { updateOrderStatus })(DeliveryOrderScreen);
