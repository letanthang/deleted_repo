import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
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

class PickConfirmScreen extends Component {
  state = { modalShow: false, signature: null }
  componentWillMount() {
    // ClientID = this.props.navigation.state.params.ClientID;
    this.ClientHubID = this.props.navigation.state.params.ClientHubID;
    this.PickDeliveryType = this.props.navigation.state.params.PickDeliveryType;
    const { PickItems, ReturnItems } = this.props;
    const Items = this.PickDeliveryType === 3 ? ReturnItems : PickItems;
    this.pickGroup = Items.find(g => g.ClientHubID === this.ClientHubID);
    if (!this.checkDone() || this.checkRealDone()) {
      Alert.alert(
        'Không thể cập nhật',
        'Có đơn mới thêm vào hoặc chuyến đi đã được cập nhật hoàn tất',
        [
          { text: 'Quay về', onPress: () => this.props.navigation.goBack() }
        ]
      );
    }
  }
  
  componentDidMount() {
    Orientation.lockToPortrait();
    // if (!this.props.configuration) this.props.getConfiguration();
  }
 

  componentWillReceiveProps({ PickItems }) {
    this.pickGroup = PickItems.find(g => g.ClientHubID === this.ClientHubID);
  }

  checkCompleteForUnsync(o) {
    return this.PickDeliveryType === 3 ? Utils.checkReturnCompleteForUnsync(o) : Utils.checkPickCompleteForUnsync(o);
  }
  checkComplete(o) {
    return this.PickDeliveryType === 3 ? Utils.checkReturnComplete(o) : Utils.checkPickComplete(o);
  }

  checkDone() {
    return this.pickGroup.ShopOrders.filter(o => !this.checkCompleteForUnsync(o)).length === 0;
  }

  checkRealDone() {
    return this.pickGroup.ShopOrders.filter(o => !this.checkComplete(o.CurrentStatus)).length === 0;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    this.props.updateOrderStatus({ OrderInfos })
      .then((failOrders) => {
        console.log(failOrders);
      });
      this.props.navigation.goBack();
  }

  confirmUpdateOrder() {
    if (!this.state.signature) {
      Alert.alert('Thông báo', 'Vui lòng kí xác nhận!');
      return;
    }

    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    const OrderNum = OrderInfos.length;
    if (OrderNum === 0) return;

    this.updateOrder();

    // const message = `Bạn đã lấy đủ đơn và thu tiền Shop, chắc chắn cập nhật ?`;
    // const title = 'Cập nhật toàn bộ đơn hàng ?';
  
    // Alert.alert(
    //   title,
    //   message,
    //   [
    //     { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
    //     { text: 'Đồng ý', onPress: () => this.updateOrder() }
    //   ],
    //   { cancelable: false }
    // );
  }

  render() {
    const { navigate, goBack } = this.props.navigation;

    if (!this.pickGroup) return null;
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
            <Title>{this.PickDeliveryType === 3 ? 'Trả' : 'Lấy'} hàng Shop</Title>
          </Body>
          <Right style={Styles.rightStyle}>
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
          <List>
            <View style={Styles.rowHeaderConfirm}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>* Vui lòng kiểm tra lại thông tin đơn hàng</Text>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>* Đây là số COD & số đơn cập nhật sau cùng</Text>
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
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Tổng thu người gởi</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(TotalServiceCost)} đ</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Chữ kí xác nhận</Text>
            </View>
            <TouchableOpacity 
              style={Styles.signatureStyle}
              onPress={() => navigate('Signature', { pcScreen: this })}
            >
              {this.state.signature ?
              <Image
                style={StyleSheet.absoluteFillObject}
                source={{ uri: `data:image/png;base64,${this.state.signature.encoded}` }}
              />
              :
              <Text style={{ alignSelf: 'center', textAlign: 'center' }}>Nhấp vào để kí xác nhận</Text>
              }
            </TouchableOpacity>
              
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 16 }}>
              <Button 
                onPress={() => this.confirmUpdateOrder()}
                block 
                style={{ flex: 0.3, margin: 2 }}
              >
                <Text>Xác nhận</Text>
              </Button>
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
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus, getConfiguration }
)(PickConfirmScreen);
