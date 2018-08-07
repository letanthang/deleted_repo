import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Input, Item, Left,
  Body, Right
} from 'native-base';
import accounting from 'accounting';

import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateWeightSize } from '../actions';
import { Colors, Styles } from '../Styles';

let senderHubId = null;
let orderCode = null;
let clientId = null;
let waitToSave = false;
let calculated = false;
class POUpdateWeightSizeScreen extends Component {
  state = { weight: null, height: null, length: null, width: null, CalculateWeight: null }

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
// 
// 
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
    const { tripCode, ServiceFee } = this.props;
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
  } 
  onCalculateFeePress(order) {
    if (!this.isInfoChanged(order)) return;

    const { length, weight, width, height } = this.state;
    const { serviceId, fromDistrictId, toDistrictId } = order;
    const params = {  weight, length, width, height, orderCode, clientId, serviceId, fromDistrictId, toDistrictId };
    calculated = true;
    this.props.calculateServiceFee(params);
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
    return true;
  }

  renderFee(ServiceFee) {
    
    return (
      <Text style={{ color: 'red' }}>{accounting.formatNumber(ServiceFee)} đ</Text>
    );
  }

  render() {
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
            <Text>Khối lượng </Text>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.weight.toString()}
              onChangeText={value => this.onInputChange('weight', value)}
              keyboardType='numeric'
            />
            <Text> g</Text>
          </View>
          
          <View style={styles.rowStyle}>
            <Text>Kích thước </Text>  
          </View>
          <View style={styles.rowStyle}>
          
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
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
            <Text> cm3</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Khối lượng quy đổi: </Text><Text style={{ color: 'blue' }}>{this.state.CalculateWeight} g</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Phí phải thu: </Text>
            {this.renderFee(collectAmount)}
          </View>
          <View style={styles.rowStyle}>
            <Button 
              onPress={this.onSaveWeightSizePress.bind(this, order)}
              block 
              style={{ flex: 0.5, margin: 2 }}
            >
              <Text>Lưu</Text>
            </Button>
          </View>
        </Content>
        <LoadingSpinner loading={false && this.props.loading} />
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
