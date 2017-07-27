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
import Utils from './libs/Utils';

class DeliveryOrderScreen extends Component {

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
  
  renderButtons(order, currentStatus) {
    const { sessionToken, pdsId } = this.props;
    const status = 'Delivered';
    const displayStatus = Utils.getDisplayStatus(currentStatus);

    if (displayStatus === 'Đang giao') {
      return (
        <Grid>
          <Col style={{ margin: 2 }}>
            <Button block style={{ backgroundColor: '#06B2F5' }}>
            <Text>GIAO LỖI</Text>
            </Button>
          </Col>
          <Col style={{ margin: 2 }}>
          <Button 
            block style={{ backgroundColor: '#06B2F5' }}
            onPress={() => this.props.updateOrderStatus({ sessionToken, pdsId, order, status })}
          >
            <Text>ĐÃ GIAO</Text>
            </Button>
          </Col>
        </Grid>
      );
    }

    return this.renderDisabledButtons();
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

          {this.renderButtons(order, CurrentStatus)}
        </Content>
      </Container>
      
    );
  }
}

const mapStateToProps = ({ pd, auth }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId } = pd;
  return { pds, pdsId, sessionToken };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus }
)(DeliveryOrderScreen);
