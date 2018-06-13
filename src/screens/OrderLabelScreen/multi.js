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
import Label1 from './Label2';

class OrderLabelsScreen extends Component {
  constructor() {
    super();
    this.state = { index: 0 };
  }
  componentWillMount() {
    this.senderHubId = this.props.navigation.state.params.senderHubId;
    
    console.log('OrderLabelsScreen mount');
  }
  nextOrder() {
    if (this.state.index < this.orders.length - 1) {
      this.setState({ index: (this.state.index + 1) % this.orders.length })
    }
  }

  async printOrder(order) {
    try {
      const { imageUri1, imageUri2 } = order;
      let uri = imageUri1.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = imageUri2.substring(7);   
      await BluetoothSerial.writeImage(uri);
      return BluetoothSerial.write('\n\n\n');
      
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('BluetoothExample');
    }
  }
  async printAll() {
    for (const order of this.orders) {
      await this.printOrder(order);
    }
  }

  render() {
    console.log('render');
    const pickGroup = this.props.PickItems.find(g => g.senderHubId === this.senderHubId);
    this.orders = pickGroup.ShopOrders.filter(o => o.done && Utils.checkPickSuccess(o.status));
    const order = this.orders[this.state.index];
    const { code } = order;
    const { goBack, navigate } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
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
            <Title>TEST MULTI PRINT {code}</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => navigate('BluetoothExample', { code })}
            >
              <IC name="bluetooth-connect" size={28} color="white" />
            </Button>
          </Right>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ paddingTop: 20 }}
        >
          <Text>STT: {this.state.index + 1} / {this.orders.length}</Text>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#000044', justifyContent: 'center' }}
            onPress={this.nextOrder.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>1Next1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#004400', justifyContent: 'center' }}
            onPress={() => this.printAll()}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Print All</Text>
          </TouchableOpacity>
          <Label1
            order={order}
            setOrder={this.props.setOrder}
            nextOrder={this.nextOrder.bind(this)}
          />
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
