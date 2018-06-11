import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ImageEditor, CameraRoll, PixelRatio } from 'react-native';
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
    console.log('new edit')
    setTimeout(this.onCaptureAll.bind(this), 500);
  }
  onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        console.log(uri)
        this.setState({ fullUri: uri })
        this.props.setProps({ imageUri: uri });
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } }
          , u => { this.props.setProps({ imageUri1: u }); console.log(u); }
          , error => console.log(error));
  
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 120 } }, 
          u => this.props.setProps({ imageUri2: u }), error => console.log(error));
        
        
        // CameraRoll.saveToCameraRoll(uri, 'photo')
        //   .then(u => {
        //     console.log('Perist Image is save to', u);
        //   });
      });
      
  }

  async printOrder() {
    try {
      // await BluetoothSerial.write('\n');
      let uri = this.props.imageUri1.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = this.props.imageUri2.substring(7);   
      await BluetoothSerial.writeImage(uri);
      await BluetoothSerial.write('\n');
      
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
          
          
          {this.state.fullUri === null ?
          <ViewShot
            ref="viewShot"
            options={{ format: "jpg", quality: 0.9, width: 362 / PixelRatio.get(), height: 370 / PixelRatio.get() }}
            style={{
              width: 362,
              height: 370,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View
              style={{
                width: 362,
                height: 250,
                padding: 2,
                alignSelf: 'center',
                backgroundColor: 'white',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 95, height: 95, paddingLeft: 4, paddingTop: 4 }}>
                  <QRCode 
                    value={code}
                    size={90}
                  />
                </View>
                
                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: 'row', borderWidth: 3, borderColor: 'black', padding: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>24 | </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>CUNG KHO</Text>
                  </View>
                  <Text style={{ fontSize: 17 }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA NAM HAI QUANG NINH</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', width: 95 }} numberOfLines={2}>NGUOI NHAN:</Text>
                  <View style={{ paddingLeft: 8, width: 260 }} >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>NGUYEN HAI</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>0909090909</Text>
                  </View>
              </View>
              <Text style={{ fontSize: 17 }} numberOfLines={3}>SO 56 THON NAM, XA PHU HAI, ABCD , HUYEN HAI HA - QUANG NINH</Text>
              <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
              <View style={{ flexDirection: 'row'}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>GHI CHU: </Text>
                <Text style={{ fontSize: 17 }}>CHO XEM HANG KHONG CHO THU</Text>
              </View>
            </View>
            <View style={{ marginTop: 6, height: 100, alignItems: 'center' }}>
              <Barcode
                value={code}
                format="CODE128"
                height={80}
                width={2}
                color='black'
              />
            </View>
          </ViewShot>
          
          : null}
  
          
          { this.state.fullUri && this.props.imageUri ?
          <View 
            style={{
              width: 380,
              height: 370,
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
              style={{ width: 362, height: 362, resizeMode: 'contain' }}
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
