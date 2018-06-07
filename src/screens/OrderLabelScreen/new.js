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
    console.log('new edit')
    setTimeout(this.onCaptureAll.bind(this), 500);
  }
  onCaptureAll() {
    this.refs.viewShot.capture()
      .then(uri => {
        this.props.setProps({ imageUri: uri });
        this.props.setProps({ imageUri1: uri });
        this.setState({ fullUri: uri });
        console.log('Full Image is save to', uri);
      });
  }

  async printOrder() {
    try {
      // await BluetoothSerial.write('\n');
      let uri = this.props.imageUri1.substring(7);
      
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
            style={{
             
              padding: 2,
              width: 300,
              height: 250,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View
              style={{
                width: 300,
                height: 250,
                padding: 8,
                alignSelf: 'center',
                backgroundColor: 'white',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <QRCode 
                    value={code}
                    size={50}
                  />
                </View>
                
                <View style={{ paddingLeft: 15, width:  220 }}>
                  <View style={{ flexDirection: 'row', borderWidth: 4, borderColor: 'black', padding: 8, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>24 | </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>CUNG KHO</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA QUANG NINH</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', width: 60 }} numberOfLines={2}>NGUOI NHAN:</Text>
                <View style={{ paddingLeft: 8 }} >
                  <Text style={{ fontSize: 13, fontWeight: 'bold' }}>NGUYEN HAI</Text>
                  <Text style={{ fontSize: 13 }}>0909090909</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', width: 300 }} numberOfLines={3}>SO 56 THON NAM, XA PHU HAI, , HUYEN HAI HA - QUANG NINH</Text>
                </View>
              </View>
              <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
              <View style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>GHI CHU: </Text>
                <Text style={{ fontSize: 13 }}>CHO XEM HANG KHONG CHO THU</Text>
              </View>
              <View style={{ marginTop: 2, height: 50, alignItems: 'center' }}>
                <Barcode
                  value={code}
                  format="CODE128"
                  height={35}
                  width={2}
                  color='black'
                />
              </View>
            </View>
          </ViewShot>
          : null}
  
          
          { this.state.fullUri && this.props.imageUri ?
          <View 
            style={{
              width: 380,
              height: 350,
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
              style={{ width: 300 * 0.8, height: 250 * 0.8 }}
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
