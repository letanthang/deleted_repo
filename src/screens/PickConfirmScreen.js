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
import { Styles, Colors } from '../Styles';
import LogoButton from '../components/LogoButton';

class PickConfirmScreen extends Component {
  state = { modalShow: false, signature: null, disabled: false }
  componentWillMount() {
    // clientId = this.props.navigation.state.params.clientId;
    this.senderHubId = this.props.navigation.state.params.senderHubId;
    this.type = this.props.navigation.state.params.type;
    const { PickItems, ReturnItems } = this.props;
    const Items = this.type === 'RETURN' ? ReturnItems : PickItems;
    this.pickGroup = Items.find(g => g.senderHubId === this.senderHubId);
    // if (!this.checkDone() || this.checkRealDone()) {
    //   Alert.alert(
    //     'Không thể cập nhật',
    //     'Có đơn mới thêm vào hoặc chuyến đi đã được cập nhật hoàn tất',
    //     [
    //       { text: 'Quay về', onPress: () => this.props.navigation.goBack() }
    //     ]
    //   );
    // }
  }
  
  componentDidMount() {
    Orientation.lockToPortrait();
    // if (!this.props.configuration) this.props.getConfiguration();
  }
 

  componentWillReceiveProps({ PickItems }) {
    this.pickGroup = PickItems.find(g => g.senderHubId === this.senderHubId);
  }

  checkCompleteForUnsync(o) {
    return this.type === 'RETURN' ? Utils.checkReturnCompleteForUnsync(o) : Utils.checkPickCompleteForUnsync(o);
  }
  checkComplete(o) {
    return o.done;
  }

  checkDone() {
    return this.pickGroup.ShopOrders.filter(o => !this.checkCompleteForUnsync(o)).length === 0;
  }

  checkRealDone() {
    return this.pickGroup.ShopOrders.filter(o => !this.checkComplete(o.status)).length === 0;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined && !o.done);
    this.props.updateOrderStatus({ OrderInfos });
    this.setState({ disabled: true })
    this.props.navigation.goBack();
  }

  confirmUpdateOrder() {
    // if (!this.state.signature) {
    //   Alert.alert('Thông báo', 'Vui lòng kí xác nhận!');
    //   return;
    // }

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
    const { senderName, totalServiceCost, sucessUnsyncedNum, failUnsyncedNum } = this.pickGroup;
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
            <Title>{this.type === 'RETURN' ? 'Trả' : 'Lấy'} hàng Shop</Title>
          </Body>
          <Right style={Styles.rightStyle}>
          </Right>
          
        </Header>
        <Content style={{ backgroundColor: Colors.row }}>
          <List>
            <View style={Styles.rowHeaderConfirm}>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>* Vui lòng kiểm tra lại thông tin đơn hàng</Text>
              <Text style={[Styles.normalColorStyle, Styles.midTextStyle]}>* Đây là số tiền thu & số đơn cập nhật sau cùng</Text>
            </View>
            <View style={Styles.rowStyle}> 
              <Text style={[Styles.col1ConfirmStyle, Styles.weakColorStyle]}>Tên Shop</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{senderName}</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1ConfirmStyle, Styles.weakColorStyle]}>Số lượng đơn hàng</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{sucessUnsyncedNum} lấy / {failUnsyncedNum} lỗi / {this.pickGroup.ShopOrders.length} đơn</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1ConfirmStyle, Styles.weakColorStyle]}>Tổng thu người gửi</Text>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(totalServiceCost)} đ</Text>
            </View>
            {/* <View style={Styles.rowStyle}>
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
            </TouchableOpacity> */}
              
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 16 }}>
              <Button 
                onPress={() => this.confirmUpdateOrder()}
                block 
                style={{ flex: 0.3, margin: 2 }}
                disabled={this.state.disabled}
              >
                <Text>Xác nhận</Text>
              </Button>
            </View>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd, auth } = state;
  const { sessionToken } = auth;
  const { tripCode } = pd;
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, tripCode, sessionToken };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus, getConfiguration }
)(PickConfirmScreen);
