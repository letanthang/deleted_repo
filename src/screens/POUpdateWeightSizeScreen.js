import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity, Button as RNButton } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Left, Body, Right, Button
} from 'native-base';
import accounting from 'accounting';
import PopupDialog, { DialogButton, DialogTitle } from 'react-native-popup-dialog';

import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateWeightSize } from '../actions';
import { Colors, Styles } from '../Styles';
import { CalculateServiceFee } from '../apis/MPDS';

let senderHubId = null;
let orderCode = null;
let clientId = null;
let waitToSave = false;
let calculated = false;
class POUpdateWeightSizeScreen extends Component {
  state = { weight: null, height: null, length: null, width: null, CalculateWeight: null, newCollectAmount: 0, newServiceFee: 0 }

  componentWillMount() {
    orderCode = this.props.navigation.state.params.orderCode;
    senderHubId = this.props.navigation.state.params.senderHubId;
    clientId = this.props.navigation.state.params.clientId;
  }

  componentDidUpdate() {
    if (waitToSave) {
      this.showSaveDialog();
      waitToSave = false;
    }
  }

  showSaveDialog() {
    const Fee = accounting.formatNumber(this.props.ServiceFee);
    Alert.alert(
      'Cập nhật kích thước?',
      `Bạn có chắc chắn muốn cập nhật kích thước, với mức phí mới: ${Fee}`,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.onSaveWeightSize() }
      ],
      { cancelable: false }
    );
  }
// 
  onInputChange(prop, value) {
    this.state[prop] = value;

    const CW = this.state.length * this.state.width * this.state.height * 0.2;
    calculated = false;
    this.setState({ [prop]: value, CalculateWeight: CW });
  }
  onSaveWeightSizePress(order) {
    if (!this.isInfoChanged(order)) return;
    this.onSaveWeightSize();
    
    // if (calculated) {
    //   this.showSaveDialog();
    // } else {
    //   waitToSave = true;
    //   this.onCalculateFeePress(order);
    // }
  }
  onSaveWeightSize() {
    const { length, weight, width, height } = this.state;
    const { tripCode } = this.props;
    const params = {
      length: parseInt(length), 
      width: parseInt(width),
      height: parseInt(height),
      weight: parseInt(weight),
      tripCode,
      orderCode: orderCode,
      reason: 'Hang to bat thuong'
    };
    console.log('onSaveWeightSize');
    this.props.updateWeightSize(params);
    this.popupDialog.dismiss();
  } 
  async onCalculateFeePress(order) {
    if (!this.isInfoChanged(order)) return;
    
  

    const { length, weight, width, height } = this.state;
    const { orderCode, type } = order;
    const { tripCode } = this.props;
    const params = {  length, width, height, weight, orderCode, type, tripCode, reason: 'Hang to bat thuong' };
    try {
      const response = await CalculateServiceFee(params)

      const json = response.data;
      if (json.status === 'OK') {
        const { newCollectAmount, newServiceFee } = json.data[0];
        this.setState({ newCollectAmount, newServiceFee });
        this.popupDialog.show();
      } else {
        Alert.alert(
          'Thông báo',
          'Đã có lỗi không thể tín toán phí mới ' + json.message,
          [
            
            { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
          ],
          { cancelable: false }
        );  
      }
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Đã có lỗi không thể tín toán phí mới ' + error.message,
        [
          
          { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      );
    }
    
  }
  
  isInfoChanged(order) {
    const { length, weight, width, height } = this.state;
    if (order.length == length 
      && order.weight == weight 
      && order.height == height 
      && order.width == width) {
      Alert.alert(
        'Thông báo',
        'Các giá trị khối lượng hoặc kích thước không thay đổi. Vui lòng kiểm tra và thử lại.',
        [
          
          { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      );  
      return false;
    }
    return this.isInfoValidated();
  }
  isInfoValidated() {
    // DxRxC (cm): 10x10x10 - 50x30x50
    const { length, weight, width, height } = this.state;
    if (length >= 10 && length <=50
      && width >= 10 && width <=30
      && height >=10 && width <=50
      && weight >=1 && weight <= 50000) {
        return true;
    }

    Alert.alert(
      'Thông báo',
      'Thông tin kích thước khối lượng vượt quá mức cho phép. Vui lòng kiểm tra lại.',
      [
        
        { text: 'Đóng', onPress: () => console.log('Đóng pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    );  
    return false;
  }

  renderFee(ServiceFee) {
    
    return (
      <Text style={{ color: 'red' }}>{accounting.formatNumber(ServiceFee)} đ</Text>
    );
  }

  render() {
    orderCode = this.props.navigation.state.params.orderCode;
    const order = Utils.getOrder(this.props.db, orderCode, 'PICK');
    const { collectAmount, weight, length, width, height } = order;
    // console.log(collectAmount, weight, length, width, height);
    // return null;
    
    if (this.state.weight === null) {
      this.state.weight = weight || 0;
      this.state.height = height || 0;
      this.state.length = length || 0;
      this.state.width = width || 0; 
      this.state.CalculateWeight = length * width * height * 0.2;
    }

    const { goBack } = this.props.navigation;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left style={Styles.leftStyle}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={Styles.bodyStyle}>
            <Title>{orderCode}</Title>
          </Body>
          <Right style={Styles.rightStyle} />
        </Header>
      
        <Content
          keyboardShouldPersistTaps='handled' 
        >
          <View style={styles.rowStyle}>
            <Text style={[Styles.midTextStyle, { color: 'red' }]}>Chỉ có thể cập nhật 1 lần, kiểm tra kĩ thông tin trước khi bấm cập nhật</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>Khối lượng (g)</Text> 
          </View>
          <View style={styles.rowStyle}>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.weight.toString()}
              onChangeText={value => this.onInputChange('weight', value)}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.rowStyle}>
            <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>Kích thước DxRxC (cm)</Text>  
          </View>
          <View style={styles.rowStyle}>
            <TextInput 
              style={[{ flex: 1, borderColor: 'gray' }, Styles.weakColorStyle]}
              value={this.state.length.toString()}
              onChangeText={value => this.onInputChange('length', value)}
              keyboardType='numeric'
            />
            <Text> x </Text>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.width.toString()}
              onChangeText={value => this.onInputChange('width', value)}
              keyboardType='numeric'
            />
            <Text> x </Text>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.height.toString()}
              onChangeText={value => this.onInputChange('height', value)}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.rowStyle}>
            <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>Khối lượng quy đổi: </Text><Text style={{ color: 'blue' }}>{this.state.CalculateWeight} g</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>Phí phải thu: </Text>
            {this.renderFee(collectAmount)}
          </View>
          <View
            style={{ flexDirection: 'row', borderTopColor: '#E7E8E9', borderTopWidth: 1, marginTop: 32 }}
          >
            <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRightWidth: 1, borderRightColor: '#E7E8E9' }}>
              <RNButton
                title="Huỷ"
                onPress={() => this.props.navigation.goBack()}
                color='#057AFF'
                style={{ flex: 0.5, margin: 2 }}
              />
            </View>
            <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
              <RNButton
                title="Cập nhật"
                onPress={this.onCalculateFeePress.bind(this, order)}
                color='#057AFF'
                style={{ flex: 0.5, margin: 2 }}
              />
            </View>
          
            
          </View>
        </Content>
        <LoadingSpinner loading={false && this.props.loading} />
        <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            containerStyle={{ zIndex: 10, elevation: 10 }}
            width={0.94}
            height={264}
            dialogTitle={<DialogTitle title="Xác nhận" />}
            // actions={[
            //   <View style={{ flexDirection: 'row', borderWidth: 1 }}>
            //     <DialogButton text="Huỷ" align="left" onPress={() => this.popupDialog.dismiss()}/>
            //     <DialogButton text="Cập nhật" align="right" onPress={() => this.popupDialog.dismiss()}/>
            //   </View>
            // ]}
          >
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <View style={{ padding: 16 }}>
                <Text style={{ color: 'red' }}>Bấm xác nhận nếu khách hàng đồng ý cước phí mới</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: 150 }}>Cước phí mới</Text>
                  <Text>{accounting.formatNumber(this.state.newServiceFee)} VNĐ</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: 150 }}>Phải thu</Text>
                  <Text>{accounting.formatNumber(this.state.newCollectAmount)} VNĐ</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: 150 }}>Khối lượng</Text>
                  <Text>{accounting.formatNumber(this.state.weight)} (gr)</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: 150 }}>Kích thước (DxRxC)</Text>
                  <Text>{this.state.length}x{this.state.width}x{this.state.height} (cm3)</Text>
                </View>
              </View>
              
              <View
                style={{ flexDirection: 'row', borderTopColor: '#E7E8E9', borderTopWidth: 1, marginBottom: 2 }}
              >
                <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRightWidth: 1, borderRightColor: '#E7E8E9' }}>
                  <RNButton
                    onPress={() => this.popupDialog.dismiss()}
                    title='Huỷ'
                    color='#057AFF'
                  />
                </View>
                <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
                  <RNButton
                    onPress={() => this.onSaveWeightSize()}
                    title='Xác nhận'
                    color='#057AFF'
                  />
                </View>
              </View>
            </View>
          </PopupDialog>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  rowStyle: {
    paddingTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  const { pd, auth, other } = state;
  const { sessionToken } = auth;
  const { tripCode, loading } = pd;
  const { ServiceFee } = other;
  const db = getOrders(state);
  return { db, sessionToken, ServiceFee, tripCode, loading };
};


export default connect(
  mapStateToProps, 
  { updateWeightSize }
)(POUpdateWeightSizeScreen);
