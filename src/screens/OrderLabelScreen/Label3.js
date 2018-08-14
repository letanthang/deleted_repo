import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ImageEditor, CameraRoll, PixelRatio } from 'react-native';
// import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import ViewShot from 'react-native-view-shot';
import BluetoothSerial from 'react-native-bluetooth-serial';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../libs/Utils';
const logo = require('../../../resources/ghn_label_logo.jpg');
import { RequireNotes } from '../../components/Constant';

class Label3 extends Component {
  state = { bcUri: null, fullUri: null }
  componentWillMount() {
    const { imageUri, label, orderCode } = this.props.order;
    // console.log('Label3: mount', label, orderCode, imageUri);
    
  }
  
  componentWillReceiveProps(nextProps) {
    const { imageUri, label, orderCode } = nextProps.order;
    // console.log('Label3: props', label, orderCode);
    
  }
  isCapturing = false
  componentDidMount() {
    const { imageUri, label, orderCode } = this.props.order;
    if (imageUri == null && label && !this.isCapturing) {
      this.isCapturing = true;
      // console.log('did mount & begin capture')
      setTimeout(this.onCaptureAll.bind(this), 70);
    }
  }
  componentDidUpdate() {
    const { imageUri, label } = this.props.order;
    if (imageUri == null && label && !this.isCapturing) {
      this.isCapturing = true;
      // console.log('did update & begin capture')
      setTimeout(this.onCaptureAll.bind(this), 70);
    }
  }

  async onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        console.log(uri)
        const { orderCode } = this.props.order;
        this.props.setOrder(orderCode, { imageUri: uri });
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } },
          u => { 
            this.props.setOrder(orderCode, { imageUri1: u });
            this.isCapturing = false;
          },
          error => console.log(error));
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 250 } }, 
          (u) => {
            this.props.setOrder(orderCode, { imageUri2: u })
            
          }, 
          error => console.log(error));
        
        ImageEditor.cropImage(uri, { offset: { x: 0, y: 500 }, size: { width: 362, height: 20 } }, 
          (u) => {
            this.props.setOrder(orderCode, { imageUri3: u })
            setTimeout(this.props.nextOrder, 28)
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
      const { imageUri1, imageUri2, imageUri3 } = this.props.order;
      let uri = imageUri1.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = imageUri2.substring(7);   
      await BluetoothSerial.writeImage(uri);
      uri = imageUri3.substring(7);   
      await BluetoothSerial.writeImage(uri);
      await BluetoothSerial.write('\n\n');
      
    } catch (error) {
      console.log(error);
      // this.props.navigation.navigate('BluetoothExample');
    }
  }
  deleteOrderImage() {
    this.props.setOrder(this.props.order.orderCode, { imageUri: null, printed: false });
  }

  render() {
    const { receiverName, receiverAddress, receiverPhone, imageUri, 
      orderCode, requiredCode, externalCode, label1, label2, 
      toDistrictName, pickWarehouseId, deliverWarehouseId, printed } = this.props.order;

    const requiredNote = RequireNotes[requiredCode] || requiredCode;
    // console.log(order);
    
    const checkBoxIconName = printed ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline';

    return (
      <View>
        { imageUri == null ?
        <ViewShot
          ref="viewShot"
          options={{ format: "png", quality: 1, width: 362 / PixelRatio.get(), height: 520 / PixelRatio.get() }}
          style={{
            width: 362,
            height: 520,
            alignSelf: 'center',
            backgroundColor: 'white'
          }}
        >
          <View
            style={{
              width: 362,
              height: 397,
              paddingLeft: 8,
              paddingRight: 8,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 200, height: 70 }}>
                <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black' }} numberOfLines={2} >{toDistrictName ? toDistrictName.toUpperCase() : ''}</Text>
              </View>
              
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Image source={logo} style = {{ resizeMode: 'contain', height: 30 }} />
              </View>
            </View>
            
            <View style={{ width: 362 }} >
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black' }}>{receiverName.toUpperCase()}</Text>
              <Text style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>{receiverPhone.toUpperCase()}</Text>
            </View>
            <View style={{height: 77}}>
              <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }} numberOfLines={3}>{receiverAddress.toUpperCase()}</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', height: 68 }}>
              <Text style={{ fontSize: 17, fontWeight: '500', color: 'black' }}  numberOfLines={3}>{requiredNote ? requiredNote.toUpperCase() : ''}</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1, marginTop: 6, marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', paddingLeft: 4, marginBottom: 2 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black'}}>EXT: </Text>
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black'}}>{externalCode ? externalCode.toUpperCase(): ''}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', borderTopWidth: 3, borderBottomWidth: 3  }}>
              <Text style={{ fontWeight: 'bold', fontSize: 40, marginLeft: 4, marginRight: 6, color: 'black'  }}>{label1}</Text>
              <View style={{ width: 0, borderWidth: 2, marginLeft: 2, marginRight: 2}} />
              <Text style={{ fontWeight: 'bold', fontSize: 40, marginLeft: 6, color: 'black' }}>{label2}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black', width: 60, marginTop: 3, marginLeft: 10 }} numberOfLines={2}>{pickWarehouseId === deliverWarehouseId ? 'CÙNG KHO' : 'KHÁC KHO'}</Text>
            </View>
            
          </View>
                
          <View style={{ height: 123, marginTop: 4, flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{orderCode}</Text>
            <Barcode
              value={orderCode}
              format="CODE128"
              height={70}
              width={2}
              color='black'
            />
            {/* <Text style={{ marginTop: -100, backgroundColor: 'white' }}>{orderCode}</Text> */}
          </View>
        </ViewShot>
        : 
        <View 
          style={{
            width: 380,
            height: 440,
            alignSelf: 'center',
            alignItems: 'center',
            paddingTop: 8
          }}
        >
          <Image 
            style={{ width: 362, height: 362, resizeMode: 'contain' }}
            source={{ uri: imageUri }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', marginTop: 8, marginRight: 4 }}>
              <IC name={checkBoxIconName} size={32} color='#006FFF' /> 
            </View>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 4, marginRight: 4 }}
              onPress={this.printOrder.bind(this)}
            >
              <IC name="printer" size={32} color='#006FFF' />
              
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 4 }}
              onPress={this.deleteOrderImage.bind(this)}
            >
              <IC name="delete" size={32} color='#006FFF' />
              
            </TouchableOpacity>
          </View>
        </View>
        }
      </View>
    );
  }
}

export default Label3;
