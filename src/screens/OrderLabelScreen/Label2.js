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
      setTimeout(this.onCaptureAll.bind(this), 70);
    }
  }
  componentDidUpdate() {
    if (this.props.order.imageUri == null) {
      console.log(this.props.order.imageUri)
      setTimeout(this.onCaptureAll.bind(this), 70);
    }
  }

  async onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        console.log(uri)
        const { code } = this.props.order;
        this.props.setOrder(code, { imageUri: uri });
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } },
          u => { this.props.setOrder(code, { imageUri1: u }); console.log(u); },
          error => console.log(error));
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 250 } }, 
          (u) => {
            this.props.setOrder(code, { imageUri2: u })
            setTimeout(this.props.nextOrder, 20)
          }, 
          error => console.log(error));
        
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
      await BluetoothSerial.write('\n\n\n\n');
      
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
          options={{ format: "png", quality: 1, width: 362 / PixelRatio.get(), height: 500 / PixelRatio.get() }}
          style={{
            width: 362,
            height: 500,
            alignSelf: 'center',
            backgroundColor: 'white'
          }}
        >
          <View
            style={{
              width: 362,
              height: 375,
              paddingLeft: 8,
              paddingRight: 8,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 200, height: 77 }}>
                <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black' }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA NAM HAI QUANG NINH</Text>
              </View>
              
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Image source={logo} style = {{ resizeMode: 'contain', height: 30 }} />
              </View>
            </View>
            
            <View style={{ width: 260 }} >
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black' }}>{receiverName.toUpperCase()}</Text>
              <Text style={{ fontSize: 19, color: 'black' }}>{receiverPhone.toUpperCase()}</Text>
            </View>
            <View style={{height: 77}}>
              <Text style={{ fontSize: 19, color: 'black' }} numberOfLines={3}>{receiverAddress.toUpperCase()} 11/3A TAN HOA TAN HIEP HOC MON, LU GIA, p15, Q11,LU GIA, p15, Q11, HCM HCM HCM</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', height: 50 }}>
              <Text style={{ fontSize: 19, color: 'black' }}  numberOfLines={3}>CHO XEM HANG KHONG CHO THU, KHONG CHO XE</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', paddingLeft: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black'}}>EXT: </Text>
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black'}}>82398472938472734UVD1</Text>
            </View>
            
            <View style={{ flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3  }}>
              <Text style={{ fontWeight: 'bold', fontSize: 31, marginLeft: 8, marginRight: 8, color: 'black'  }}>44-44-44</Text>
              <View style={{ width: 0, borderWidth: 2, marginLeft: 2, marginRight: 2}} />
              <Text style={{ fontWeight: 'bold', fontSize: 31, marginLeft: 8, color: 'black' }}>24 </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'black' }}>CUNG KHO</Text>
            </View>
            
          </View>
                
          <View style={{ height: 125, marginTop: 4, flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{code}</Text>
            <Barcode
              value={code}
              format="CODE128"
              height={70}
              width={2}
              color='black'
            />
            {/* <Text style={{ marginTop: -100, backgroundColor: 'white' }}>{code}</Text> */}
          </View>
        </ViewShot>
        : 
        <View 
          style={{
            width: 380,
            height: 440,
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
