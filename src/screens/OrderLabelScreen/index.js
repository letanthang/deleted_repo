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
    const { recepientName } = order;
    
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
              borderWidth: 1,
              padding: 4,
              width: 360,
              height: 252,
              alignSelf: 'center',
              marginTop: 100,
              backgroundColor: 'white'
            }}
          >
            <Text style={{ alignSelf: 'center' }}>{orderCode}</Text>
            <QRCode
              style={{ alignSelf: 'center' }}
              value={orderCode}
              size={100}
              bgColor='black'
              fgColor='white'
            />
            <Barcode 
              value={orderCode}
              format="CODE128"
              height={100}
            />
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
