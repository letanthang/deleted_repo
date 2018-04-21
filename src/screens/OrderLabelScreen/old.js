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
    const code = this.props.navigation.state.params.code;
    const order = Utils.getOrder(this.props.db, code, 1);
    console.log('OrderLabel render');
    const { navigate, goBack } = this.props.navigation;
    const { receiverName, deliveryAddress, receiverPhone } = order;
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
            <Title>{code}</Title>
          </Body>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ padding: 10 }}
        >
          <TouchableOpacity
            onPress={() => {
              this.refs.vsBC.capture().then(this.onCaptureBarCode.bind(this));
            }}
          >
            <ViewShot
              // onCapture={this.onCaptureBarCode}
              // captureMode="mount"
              ref="vsBC"
              style={{
                width: 360,
                height: 100,
                alignSelf: 'center',
                backgroundColor: 'white'
              }}
            >
              <Barcode 
                value="GHN0123456789"
                format="CODE128"
                height={50}
                // background='blue'
              />
            </ViewShot>
          </TouchableOpacity>
          
          <ViewShot
            // onCapture={this.onCapture}
            // captureMode="update"
            ref="viewShot"
            style={{
              // borderWidth: 2,
              padding: 2,
              width: 362,
              height: 500,
              alignSelf: 'center',
              backgroundColor: 'white'
            }}
          >
            <View 
              style={{ height: 120, padding: 14 }}
            >
              <Text style={{ fontWeight: 'bold' }}>{receiverName.toUpperCase()}</Text>
              <Text style={{ }}>{receiverPhone}</Text>
              <Text style={{ }}>{deliveryAddress}</Text>
            </View>
            <View style={{ height: 0, borderStyle: 'dashed', borderWidth: 1, borderRadius: 1 }} />
            <View
              style={{
                flexDirection: 'row',
                flex: 1
              }}
            >
              <View style={{ position: 'relative', width: 110, borderRightWidth: 2 }}>
                <View
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, transform: [{ translateX: -160 }, { translateY: 100 }, { rotate: '90deg' }] }}
                >
                  {this.state.bcUri ?
                  <Image 
                    style={{ width: 360, height: 100 }}
                    source={{ uri: this.state.bcUri }}
                  />
                  : null}
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
                  <View style={{ padding: 2, paddingBottom: 16, paddingRight: 16, justifyContent: 'flex-end' }}>
                    <QRCode
                      style={{ alignSelf: 'center' }}
                      value={code}
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
