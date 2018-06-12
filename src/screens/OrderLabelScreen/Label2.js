import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ImageEditor, CameraRoll, PixelRatio } from 'react-native';
// import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import ViewShot from 'react-native-view-shot';
import BluetoothSerial from 'react-native-bluetooth-serial';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../libs/Utils';
const logo = require('../../../resources/ghn_label_logo.jpg');

class Label1 extends Component {
  state = { bcUri: null, fullUri: null }
  componentDidMount() {
    if (this.props.order.imageUri == null) {
      console.log(this.props.order.imageUri)
      // setTimeout(this.onCaptureAll.bind(this), 500);
    }
  }
  componentDidUpdate() {
    if (this.props.order.imageUri == null) {
      console.log(this.props.order.imageUri)
      // setTimeout(this.onCaptureAll.bind(this), 500);
    }
  }

  onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        console.log(uri)
        const { code } = this.props.order;
        this.props.setOrder(code, { imageUri: uri });
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } }
          , u => { this.props.setOrder(code, { imageUri1: u }); console.log(u); }
          , error => console.log(error));
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 120 } }, 
          u => this.props.setOrder(code, { imageUri2: u }), error => console.log(error));
        
        // CameraRoll.saveToCameraRoll(uri, 'photo')
        //   .then(u => {
        //     console.log('Perist Image is save to', u);
        //   });
      });
  }

  async printOrder() {
    try {
      const { imageUri1, imageUri2 } = this.props.order;
      let uri = imageUri1.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = imageUri2.substring(7);   
      await BluetoothSerial.writeImage(uri);
      await BluetoothSerial.write('\n\n');
      
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('BluetoothExample');
    }
}

  render() {
    const { receiverName, receiverAddress, receiverPhone, imageUri, code } = this.props.order;
    // console.log(order);
    
    return (
      <View>
        { imageUri == null ?
        <ViewShot
          ref="viewShot"
          options={{ format: "png", quality: 1, width: 362 / PixelRatio.get(), height: 370 / PixelRatio.get() }}
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
              height: 265,
              paddingLeft: 8,
              paddingRight: 8,
              alignSelf: 'center',
              backgroundColor: 'white',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 200, height: 80 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA NAM HAI QUANG NINH</Text>
              </View>
              
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Image source={logo} style = {{ resizeMode: 'contain', height: 30 }} />
                
              </View>
            </View>
            
                
            <View style={{ width: 260 }} >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{receiverName.toUpperCase()}</Text>
              <Text style={{ fontSize: 20 }}>{receiverPhone.toUpperCase()}</Text>
            </View>
            
            <Text style={{ fontSize: 20 }} numberOfLines={3}>{receiverAddress}</Text>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row'}}>
              <Text style={{ fontSize: 20 }}>CHO XEM HANG KHONG CHO THU</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', paddingLeft: 4 }}>
              <Text style={{ fontSize: 21, fontWeight: 'bold'}}>EXT: </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold'}}>82398472938472734UVD1</Text>
            </View>
            
            <View style={{ flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3  }}>
              <Text style={{ fontWeight: 'bold', fontSize: 26  }}>44-44-44</Text>
              <View style={{ width: 0, borderWidth: 2, marginLeft: 2, marginRight: 2}} />
              <Text style={{ fontWeight: 'bold', fontSize: 26 }}>24 </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>CUNG KHO</Text>
            </View>
            
          </View>
                
          <View style={{ marginTop: 6, flex: 1, alignItems: 'center' }}>
            <Barcode
              value={code}
              format="CODE128"
              height={80}
              width={2}
              color='black'
            />
          </View>
        </ViewShot>
        : 
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
            source={{ uri: imageUri }}
          />
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
            onPress={this.printOrder.bind(this)}
          >
            <IC name="printer" size={32} color='#006FFF' />
            <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}> Print</Text>
          </TouchableOpacity>
        </View>
        }
      </View>
    );
  }
}

export default Label1;
