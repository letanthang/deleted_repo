import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  Container, Header, Left, Body, Title,
  Content, Button, Icon, Right,
} from 'native-base';
// import IC from 'react-native-vector-icons/MaterialCommunityIcons';
// import BluetoothSerial from 'react-native-bluetooth-serial';
import { connect } from 'react-redux';
import { Styles } from '../../Styles';
import { setOrder } from '../../actions';
import { getOrders, get3Type } from '../../selectors';
import Utils from '../../libs/Utils';
import Label from './Label3';

class OrderLabelsScreen extends Component {
  constructor() {
    super();
    this.state = { index: 0, printEnable: true };
  }
  componentWillMount() {
    this.senderHubId = this.props.navigation.state.params.senderHubId;    
    const pickGroup = this.props.PickItems.find(g => g.senderHubId === this.senderHubId);
    this.orders = pickGroup.ShopOrders.filter(o => o.done && Utils.checkSuccess(o));
    if (this.orders.length === 0) {
      this.props.navigation.goBack();
    }
  }
  componentWillReceiveProps(nextProps) {
    const pickGroup = nextProps.PickItems.find(g => g.senderHubId === this.senderHubId);
    this.orders = pickGroup.ShopOrders.filter(o => o.done && Utils.checkSuccess(o));
  }

  nextOrder() {
    console.log('nextOrder');
    this.setState({ index: (this.state.index + 1) % this.orders.length });
  }

  nextOrderForPrint() {
    const noImageNum = this.orders.filter(o => !o.imageUri).length;
    console.log('nextOrderForPrint ' + noImageNum);
    if (noImageNum > 0) {
      this.setState({ index: (this.state.index + 1) % this.orders.length });
    }
  }

  async printOrder(order) {
    try {
      const { orderCode, imageUri, imageUri1, imageUri2, imageUri3 } = order;
      if (!imageUri) {
        Utils.showToast('Đơn chưa tạo nhãn!', 'danger');
        return;
      }
      this.props.setOrder(orderCode, { printed: true });
      let uri = imageUri1.substring(7);
      await BluetoothSerial.writeImage(uri);
      uri = imageUri2.substring(7);
      await BluetoothSerial.writeImage(uri);
      uri = imageUri3.substring(7);
      await BluetoothSerial.writeImage(uri);
      return BluetoothSerial.write('\n\n');
    } catch (error) {
      console.log(error);
      Utils.showToast('Đã có lỗi. Vui lòng xem lại kết nối máy in.', 'danger');
      // this.props.navigation.navigate('BluetoothExample');
    }
  }
  async printAll(num) {
    console.log('print all');
    this.setState({ printEnable: false });
    const orders = this.orders.filter(o => !o.printed).slice(0, num);
    if (orders.length === 0) {
      console.log('Nothing to print');
      return;
    }
    for (const order of orders) {
      await this.printOrder(order);
    }
  }

  resetPrint() {
    const orders = this.orders.filter(o => o.printed);
    orders.forEach(o => this.props.setOrder(o.orderCode, { printed: false }));
  }
  deleteImages() {
    this.orders.forEach(o => this.props.setOrder(o.orderCode, { imageUri: null }));
  }

  render() {
    if (this.orders.length === 0) {
      return (
        <Text>Chưa có đơn đã lấy để in</Text>
      );
    }

    const order = this.orders[this.state.index];
    const { orderCode } = order;
    const { goBack, navigate } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button
                transparent
                onPress={() => goBack()}
              >
                <Icon name="arrow-back" />
              </Button>
            </View>
          </Left>
          <Body style={Styles.bodyStyle}>
            <Title>In đơn shop</Title>
          </Body>
          <Right  style={{ flex: 0.2 }}>
            <Button
              transparent
              onPress={() => navigate('BluetoothExample', { orderCode })}
            >
              <IC name="bluetooth-connect" size={28} color="white" />
            </Button>
          </Right>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ paddingTop: 8 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Đã in : {this.orders.filter(o => o.printed).length} / {this.orders.length}</Text>
            <Text>STT: {this.state.index + 1} / {this.orders.length}</Text>
            <Text>Có nhãn : {this.orders.filter(o => o.imageUri).length} / {this.orders.length}</Text>
          </View>
          
          <TouchableOpacity
            style={{ padding: 4, backgroundColor: '#000044', justifyContent: 'center', margin: 1 }}
            onPress={this.nextOrder.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Xem tiếp</Text>
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ padding: 4, backgroundColor: '#004400', justifyContent: 'center', flex: 0.5, margin: 1 }}
              onPress={() => this.printAll(3).then(() => this.setState({ printEnable: true }))}
              disabled={!this.state.printEnable}
            >
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>In 3 đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 4, backgroundColor: '#004400', justifyContent: 'center', flex: 0.5, margin: 1 }}
              onPress={() => this.printAll(5).then(() => this.setState({ printEnable: true }))}
              disabled={!this.state.printEnable}
            >
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>In 5 đơn</Text>
            </TouchableOpacity>
          </View>
          
          <Label
            order={order}
            setOrder={this.props.setOrder}
            nextOrder={this.nextOrderForPrint.bind(this)}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}
          >
            <TouchableOpacity
              style={{ padding: 8, justifyContent: 'center', flex: 0.3 }}
              onPress={() => this.resetPrint()}
            >
              <Text style={{ color: '#000044', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>In lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 8, justifyContent: 'center', flex: 0.4 }}
              onPress={() => this.deleteImages()}
            >
              <Text style={{ color: '#000044', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Xoá hình</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const db = getOrders(state);
  const { PickItems } = get3Type(state);
  return { db, PickItems };
};

export default connect(mapStateToProps, { setOrder })(OrderLabelsScreen);
