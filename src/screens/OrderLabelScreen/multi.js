import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  Container, Header, Left, Body, Title,
  Content, Button, Icon,
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
  render() {
    console.log('render')
    const pickGroup = this.props.PickItems.find(g => g.senderHubId === this.senderHubId);
    const orders = pickGroup.ShopOrders;
    const order = orders[this.state.index];
    const { code } = order;
    const { goBack } = this.props.navigation;
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
            <Title>TEST MULTI PRINT</Title>
          </Body>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ paddingTop: 20 }}
        >
          <Text>STT: {this.state.index + 1} / {orders.length}</Text>
          <TouchableOpacity
            onPress={() => this.setState({ index: (this.state.index + 1) % orders.length })}
          >
            <Text>Next</Text>
          </TouchableOpacity>
          <Label1
            order={order}
            setOrder={this.props.setOrder}
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
