import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ImageEditor } from 'react-native';
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import ViewShot from 'react-native-view-shot';
import { 
  Container, Header, Left, Body, Title,
  Content, Text, Button, Icon
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import BluetoothSerial from 'react-native-bluetooth-serial';
import { connect } from 'react-redux';
import { Styles } from '../../Styles';
import { setProps } from '../../actions';
import { getOrders } from '../../selectors';
import Utils from '../../libs/Utils';


class OrderLabelScreen extends Component {
  state = { bcUri: null, fullUri: null }
  componentDidMount() {
    setTimeout(this.onCaptureUpper.bind(this), 500);
  }
  onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        this.props.setProps({ imageUri: uri });
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } }
        , u => { this.props.setProps({ imageUri1: u }); console.log(u); }
        , error => console.log(error));

        ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 250 } }, 
          u => this.props.setProps({ imageUri2: u }), error => console.log(error));

        ImageEditor.cropImage(uri, { offset: { x: 0, y: 500 }, size: { width: 362, height: 250 } }, 
          u => this.props.setProps({ imageUri3: u }), error => console.log(error));
        this.setState({ fullUri: uri });
        console.log('Full Image is save to', uri);
      });
  }

  onCaptureUpper = () => {
    this.refs.vsUpper.capture()
      .then(uri => {
        console.log('Upper Image is save to', uri);
        this.setState({ bcUri: uri });
        setTimeout(this.onCaptureAll.bind(this), 400);
      });
  }
  async printOrder() {
    try {
      let uri = this.props.imageUri1.substring(7);
      console.log(uri);
      await BluetoothSerial.writeImage(uri);
      uri = this.props.imageUri2.substring(7);
      await BluetoothSerial.writeImage(uri);
      uri = this.props.imageUri3.substring(7);
      await BluetoothSerial.writeImage(uri);
      await BluetoothSerial.write('\n');
      console.log(uri);
    } catch (error) {
      this.props.navigation.navigate('BluetoothExample');
    }
}

  render() {
    const code = this.props.navigation.state.params.orderCode;
    const order = Utils.getOrder(this.props.db, code, 'PICK');
    // console.log('OrderLabel render');
    const { navigate, goBack } = this.props.navigation;
    const { receiverName, receiverAddress, receiverPhone } = order;
    // console.log(order);
    
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
            <Title>{code}</Title>
          </Body>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ paddingTop: 20 }}
        >
          {this.state.bcUri === null ?
          <ViewShot
            // onCapture={this.onCaptureBarCode}
            // captureMode="mount"
            ref="vsUpper"
            style={{
              width: 550,
              height: 362,
              alignSelf: 'center',
              backgroundColor: 'white',
              paddingLeft: 16,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <QRCode 
                value={code}
                size={120}
              />
              <View style={{ paddingLeft: 15 }}>
                <View style={{ flexDirection: 'row', borderWidth: 4, borderColor: 'black', padding: 10, marginBottom: 10, width: 220 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 23 }}>24 | </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 21 }}>CUNG KHO</Text>
                </View>
                <Text style={{ width: 220, fontSize: 19, fontWeight: 'bold' }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA QUANG NINH</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', width: 100 }} numberOfLines={2}>NGUOI NHAN:</Text>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>NGUYEN HAI</Text>
                <Text style={{ fontSize: 16 }}>0909090909</Text>
                <Text style={{ width: 300, fontSize: 16 }} numberOfLines={3}>SO 56 THON NAM, XA PHU HAI, , HUYEN HAI HA - QUANG NINH</Text>
              </View>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>GHI CHU: </Text>
              <Text style={{ fontSize: 16 }}>CHO XEM HANG KHONG CHO THU</Text>
            </View>
            <View>
              <View style={{ height: 35 }}>
              <Barcode 
                value={code}
                format="CODE128"
                height={25}
                width={2}
                // background='blue'
              />
              </View>
              <View style={{ marginTop: -9 }}>
              <Barcode 
                value={code}
                format="CODE128"
                height={25}
                width={2}
                //background='blue'
              />
              </View>
            </View>
          </ViewShot>
          : null}
          {/* <View style={{ marginBottom: 40, transform: [{ translateY: 120 }, { rotate: '90deg' }] }} >
          {this.state.bcUri ?
                <Image 
                  style={{ width: 420, height: 360 }}
                  source={{ uri: this.state.bcUri }}
                />
                : null}
          </View> */}
          
          {this.state.fullUri === null ?
          <ViewShot
            // onCapture={this.onCapture}
            // captureMode="update"
            ref="viewShot"
            style={{
             
              padding: 2,
              width: 362,
              height: 750,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View style={{ position: 'relative', height: 555 }}>
              <View
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, transform: [{ translateX: -80 }, { translateY: 100 }, { rotate: '-90deg' }] }}
              >
                {this.state.bcUri ?
                <Image 
                  style={{ width: 550, height: 362 }}
                  source={{ uri: this.state.bcUri }}
                />
                : null}
              </View>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
            <View style={{ borderWidth: 2, padding: 0, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 34, color: 'white', backgroundColor: 'black' }}>44-44-44</Text>
            </View>
            <View style={{ marginTop: 4, height: 135 }}>
              <Barcode 
                value={code}
                format="CODE128"
                height={82}
                width={2}
              />
            </View>
          </ViewShot>
          : null}
          {/* <TouchableOpacity
            style={{ alignSelf: 'center', alignItems: 'center', padding: 8, backgroundColor: 'blue', width: 362 }}
            onPress={this.onCaptureAll.bind(this)}
          >
            <Text>Capture</Text>
          </TouchableOpacity> */}
          { this.state.fullUri && this.props.imageUri ?
          <View 
            style={{
              width: 362,
              height: 780,
              alignSelf: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
              onPress={this.printOrder.bind(this)}
            >
              <IC name="printer" size={32} color='#006FFF' />
              <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}> Print</Text>
            </TouchableOpacity>
            <Image 
              style={{ width: 362 * 0.8, height: 750 * 0.8 }}
              source={{ uri: this.props.imageUri }}
            />
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
              onPress={this.printOrder.bind(this)}
            >
              <IC name="printer" size={32} color='#006FFF' />
              <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}> Print</Text>
            </TouchableOpacity>
          </View>
          : null }
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


export default connect(mapStateToProps, { setProps })(OrderLabelScreen);
