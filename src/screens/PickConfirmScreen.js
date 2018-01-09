import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { accounting } from 'accounting';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List 
} from 'native-base';
import { updateOrderStatus, getConfiguration } from '../actions';
import Utils from '../libs/Utils';
import { get3Type } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { Styles, Colors } from '../Styles';
import LogoButton from '../components/LogoButton';
import { getUpdateOrderInfo, getUpdateOrderInfoForDone, updateOrderToFailWithReason2 } from '../components/pickReturn/Helpers';

class PickOrderScreen extends Component {
  state = { modalShow: false }

  componentWillMount() {
    // ClientID = this.props.navigation.state.params.ClientID;
    this.ClientHubID = this.props.navigation.state.params.ClientHubID;
    this.pickGroup = this.props.PickItems.find(g => g.ClientHubID === this.ClientHubID);
  }
  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps({ PickItems }) {
    this.pickGroup = PickItems.find(g => g.ClientHubID === this.ClientHubID);
  }

  componentDidUpdate() {
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    console.log(this.props.PickItems);
    const { ContactName, TotalServiceCost } = this.pickGroup;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
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
          <Body style={Styles.bodyStyle}>
            <Title>Lấy hàng Shop</Title>
          </Body>
          <Right style={Styles.rightStyle}>
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
          <List>
            <View style={Styles.rowHeaderStyle}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>Thông tin đơn hàng shop</Text>
            </View>
            <View style={Styles.rowStyle}> 
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tên Shop</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{ContactName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Số lượng đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{this.pickGroup.ShopOrders.length}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu COD</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{TotalServiceCost}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Chữ kí xác nhận</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>20</Text>
            </View>
  
          </List>
        </Content>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth } = state;
  const { sessionToken } = auth;
  const { pdsId, loading } = pd;
  const { PickItems } = get3Type(state);
  return { PickItems, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus, getConfiguration }
)(PickOrderScreen);
