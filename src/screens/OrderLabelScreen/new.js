import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ImageEditor, CameraRoll, PixelRatio } from 'react-native';
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import ViewShot from 'react-native-view-shot';
import { 
  Container, Header, Left, Body, Title,
  Content, Text, Button, Icon, Right
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import BluetoothSerial from 'react-native-bluetooth-serial';
import { connect } from 'react-redux';
import { Styles } from '../../Styles';
import { setProps, setOrder } from '../../actions';
import { getOrders } from '../../selectors';
import Utils from '../../libs/Utils';
import Label from './Label3';


class OrderLabelScreen extends Component {
  state = { bcUri: null, fullUri: null }
  componentDidMount() {
    console.log('new edit')
  }
  
  async printOrder() {
    try {
      // await BluetoothSerial.write('\n');
      let uri = this.props.imageUri1.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = this.props.imageUri2.substring(7);   
      await BluetoothSerial.writeImage(uri);
      await BluetoothSerial.write('\n\n');
      
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('BluetoothExample');
    }
}

  render() {
    const code = this.props.navigation.state.params.code;
    const order = Utils.getOrder(this.props.db, code, 'PICK');
    // console.log('OrderLabel render');
    const { navigate, goBack } = this.props.navigation;
    const { receiverName, receiverAddress, receiverPhone } = order;
    // console.log(order);
    
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
            <Title>In đơn {code}</Title>
          </Body>
          <Right style={{ flex: 0.2 }}>
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
          <Label
            order={order}
            setOrder={this.props.setOrder}
            nextOrder={()=>{}}
          />
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const db = getOrders(state);
  const { imageUri, imageUri1, imageUri2, imageUri3 } = state.other;
  return { db, imageUri, imageUri1, imageUri2, imageUri3 };
};


export default connect(mapStateToProps, { setProps, setOrder })(OrderLabelScreen);
