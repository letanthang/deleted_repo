import _ from 'lodash';
import React, { Component } from 'react';
import { View, Alert, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import SignatureCapture from 'react-native-signature-capture';
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

class PickOrderScreen extends Component {
  state = { modalShow: false }
  componentWillMount() {
    // ClientID = this.props.navigation.state.params.ClientID;
    this.ClientHubID = this.props.navigation.state.params.ClientHubID;
    this.pickGroup = this.props.PickItems.find(g => g.ClientHubID === this.ClientHubID);
    if (!this.checkDone() || this.checkRealDone()) {
      Alert.alert(
        'Không thể cập nhật',
        'Có đơn mới thêm vào hoặc chuyến đi lấy này đã hoàn tất',
        [
          { text: 'Quay về', onPress: () => this.props.navigation.goBack() }
        ]
      );
    }
  }
  
  componentDidMount() {
    if (!this.props.configuration) this.props.getConfiguration();
  }

  componentWillReceiveProps({ PickItems }) {
    this.pickGroup = PickItems.find(g => g.ClientHubID === this.ClientHubID);
  }

  componentDidUpdate() {
  }

  checkDone() {
    return this.pickGroup.ShopOrders.filter(o => !Utils.checkPickCompleteForUnsync(o)).length === 0;
  }

  checkRealDone() {
    return this.pickGroup.ShopOrders.filter(o => !Utils.checkPickComplete(o.CurrentStatus)).length === 0;
  }

  saveSign() {
    this.refs["sign"].saveImage();
  }

  resetSign() {
      this.refs["sign"].resetImage();
      this.signed = false;
  }

  _onSaveEvent(result) {
      //result.encoded - for the base64 encoded png
      //result.pathName - for the file path name
      console.log(result);
  }
  _onDragEvent() {
      // This callback will be called when the user enters signature
      console.log("dragged");
      this.signed = true;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    this.saveSign();
    this.props.updateOrderStatus({ OrderInfos })
      .then((failOrders) => {
        console.log(failOrders);
        this.props.navigation.goBack();
      });
  }

  confirmUpdateOrder() {
    console.log(this.signed);
    if (!this.signed === true) {
      Alert.alert('Thông báo', 'Vui lòng kí xác nhận!');
      return;
    }

    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.success !== undefined);
    const OrderNum = OrderInfos.length;
    if (OrderNum === 0) return;

    const message = `Bạn đã lấy đủ đơn và thu tiền Shop, chắc chắn cập nhật ?`;
    const title = 'Cập nhật toàn bộ đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrder() }
      ],
      { cancelable: false }
    );
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
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>{accounting.formatNumber(TotalServiceCost)} đ</Text>
            </View>
            <View style={Styles.rowStyle}>
              <Text style={[Styles.col1Style, Styles.weakColorStyle]}>Chữ kí xác nhận</Text>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableHighlight 
                  style={styles.buttonStyle}
                  onPress={() => this.resetSign()}
                >
                  <Text>Reset</Text>
                </TouchableHighlight>
              </View> 
            </View>
            <View style={Styles.signatureStyle}>
              <SignatureCapture
                style={[{ flex: 1 }, styles.signature]}
                ref="sign"
                onSaveEvent={this._onSaveEvent.bind(this)}
                onDragEvent={this._onDragEvent.bind(this)}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                viewMode='portrait'
              />
            </View>
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

const styles = StyleSheet.create({
  signature: {
      flex: 1,
      borderColor: '#000033',
      borderWidth: 1,
  },
  buttonStyle: {
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      height: 50,
      backgroundColor: "#eeeeee",
      margin: 10
  }
});

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
