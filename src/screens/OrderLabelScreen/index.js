import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ImageEditor } from 'react-native';
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
  state = { bcUri: null }
  componentWillMount() {
  }

  onCapture = uri => {
    this.props.setProps({ imageUri: uri });
    ImageEditor.cropImage(uri, { offset: { x: 0, y: 0 }, size: { width: 362, height: 250 } }
    , u => { this.props.setProps({ imageUri1: u }); console.log(u); }
    , error => console.log(error));

    ImageEditor.cropImage(uri, { offset: { x: 0, y: 250 }, size: { width: 362, height: 250 } }, 
      u => this.props.setProps({ imageUri2: u }), error => console.log(error));

    console.log('Image is save to', uri);
  }

  onCaptureBarCode = uri => {
    this.setState({ bcUri: uri });
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
          style={{ paddingTop: 20 }}
        >
          <TouchableOpacity
            onPress={() => {
              this.refs.vsUpper.capture().then(this.onCaptureBarCode.bind(this));
            }}
          >
            <ViewShot
              // onCapture={this.onCaptureBarCode}
              // captureMode="mount"
              ref="vsUpper"
              style={{
                width: 440,
                height: 360,
                alignSelf: 'center',
                backgroundColor: 'white'
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <QRCode 
                  value={orderCode}
                  size={165}
                />
                <View style={{ paddingLeft: 15 }}>
                  <View style={{ flexDirection: 'row', borderWidth: 4, borderColor: 'black', padding: 10, marginBottom: 10, width: 220 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 26 }}>24 | </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>CUNG KHO</Text>
                  </View>
                  <Text style={{ width: 220, fontSize: 22, fontWeight: 'bold' }} numberOfLines={3} >XA PHU HAI, HUYEN HAI HA QUANG NINH</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', width: 100 }} numberOfLines={2}>NGUOI NHAN:</Text>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>NGUYEN HAI</Text>
                  <Text>0909090909</Text>
                  <Text style={{ width: 300 }} numberOfLines={3}>SO 56 THON NAM, XA PHU HAI, , HUYEN HAI HA - QUANG NINH</Text>
                </View>
              </View>
              <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>GHI CHU: </Text>
                <Text style={{ fontSize: 21 }}>CHO XEM HANG KHONG CHO THU</Text>
              </View>
              
            </ViewShot>
          </TouchableOpacity>
          {/* <View style={{ marginBottom: 40, transform: [{ translateY: 120 }, { rotate: '90deg' }] }} >
          {this.state.bcUri ?
                <Image 
                  style={{ width: 420, height: 360 }}
                  source={{ uri: this.state.bcUri }}
                />
                : null}
          </View> */}
          
          
          <ViewShot
            // onCapture={this.onCapture}
            // captureMode="update"
            ref="viewShot"
            style={{
             
              padding: 2,
              width: 362,
              height: 600,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View style={{ position: 'relative', height: 450 }}>
              <View
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, transform: [{ translateX: -32 }, { translateY: 40 }, { rotate: '-90deg' }] }}
              >
                {this.state.bcUri ?
                <Image 
                  style={{ width: 440, height: 360 }}
                  source={{ uri: this.state.bcUri }}
                />
                : null}
              </View>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
            <View style={{ backgroundColor: 'green', padding: 0, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 34 }}>44-44-44</Text>
            </View>
            <View style={{ marginTop: 15, height: 130 }}>
              <Barcode 
                value='GHNMP0000018085VN'
                format="CODE128"
                height={130}
                width={1.86}
                // background='blue'
              />
            </View>
            
          </ViewShot>
          <TouchableOpacity
            onPress={() => {
              this.refs.viewShot.capture().then(this.onCapture.bind(this));
            }}
          >
            <Text>Capture</Text>
          </TouchableOpacity>
          {this.props.imageUri ?
          <View 
            style={{
              width: 362,
              height: 500,
              alignSelf: 'center'
            }}
          >
            <Image 
              style={{ width: 362, height: 500 }}
              source={{ uri: this.props.imageUri }}
            />
          </View>
          : null }
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const db = getOrders(state);
  const { imageUri } = state.other;
  return { db, imageUri };
};


export default connect(mapStateToProps, { setProps })(OrderLabelScreen);
