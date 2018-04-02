import React, { Component } from 'react';
import { View, TouchableOpacity, CameraRoll } from 'react-native';
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import ViewShot from 'react-native-view-shot';
import { 
  Container, Header, Left, Body, Title,
  Content, Text, Button, Icon
} from 'native-base';
import { connect } from 'react-redux';
import { Styles } from '../../Styles';
import { setProps } from '../../actions';
import { getOrders } from '../../selectors';
import Utils from '../../libs/Utils';


class OrderLabelScreen extends Component {
  componentWillMount() {
  }

  onCapture = uri => {
    this.props.setProps({ imageUri: uri });
    CameraRoll.saveToCameraRoll(uri, 'photo')
      .then(result => console.log('save succeeded', result))
      .catch(error => console.log('error', error));

    console.log('Image is save to', uri);
  }

  render() {
    const orderCode = this.props.navigation.state.params.orderCode;
    const order = Utils.getOrder(this.props.db, orderCode, 1);
    console.log('OrderLabel render');
    const { navigate, goBack } = this.props.navigation;
    const { recipientName, deliveryAddress, recipientPhone } = order;
    console.log(order);
    
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
            <Title>{orderCode}</Title>
          </Body>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ padding: 10 }}
        >
          <ViewShot
            // onCapture={this.onCapture}
            // captureMode="mount"
            ref="viewShot"
            style={{
              borderWidth: 2,
              padding: 2,
              width: 360,
              height: 300,
              alignSelf: 'center',
              marginTop: 50,
              backgroundColor: 'white'
            }}
          >
            <View 
              style={{ height: 120, padding: 14 }}
            >
              <Text style={{ fontWeight: 'bold' }}>{recipientName.toUpperCase()}</Text>
              <Text style={{ }}>{recipientPhone}</Text>
              <Text style={{ }}>{deliveryAddress}</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
            <View
              style={{
                flexDirection: 'row',
                flex: 1
              }}
            >
              <View style={{ width: 100, borderRightWidth: 2 }}>
                <View
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, transform: [{ translateX: -90 }, { translateY: 120 }, { rotate: '90deg' }] }}
                >
                  <Barcode 
                    value={orderCode}
                    format="CODE128"
                    height={110}
                    // background='blue'
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ height: 80, padding: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>PHƯỜNG 15 QUẬN 11 HỒ CHÍ MINH</Text>
                </View>
                <View style={{ height: 0, marginBottom: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
                <View style={{ height: 70, padding: 8 }}>
                  <Text>CHO XEM HÀNG KHÔNG CHO THỬ</Text>
                </View>
                <View style={{ height: 65, backgroundColor: 'black', marginBottom: 2 }}>
                  <Text style={{ color: 'white', fontSize: 44, textAlign: 'center' }}>44-44-44</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  <View style={{ width: 45, backgroundColor: 'black' }}>
                    <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>24</Text>
                  </View>
                  <View style={{ padding: 2, justifyContent: 'flex-end' }}>
                    <QRCode
                      style={{ alignSelf: 'center' }}
                      value={orderCode}
                      size={120}
                      bgColor='black'
                      fgColor='white'
                    />
                  </View>
                  
                </View>
                
                
              </View>
            </View>
            
          </ViewShot>
          <TouchableOpacity
            onPress={() => {
              this.refs.viewShot.capture().then(this.onCapture.bind(this));
            }}
          >
            <Text>Capture</Text>
          </TouchableOpacity>
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const db = getOrders(state);
  return { db };
};


export default connect(mapStateToProps, { setProps })(OrderLabelScreen);
