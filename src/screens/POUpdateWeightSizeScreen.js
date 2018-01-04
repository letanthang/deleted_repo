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
import { calculateServiceFee, updateWeightSize } from '../actions';
import { Colors, Styles } from '../Styles';

let ClientHubID = null;
let OrderID = null;
let ClientID = null;
let waitToSave = false;
let calculated = false;
class POUpdateWeightSizeScreen extends Component {
  state = { Weight: null, Height: null, Length: null, Width: null, CalculateWeight: null }

  componentWillMount() {
    OrderID = this.props.navigation.state.params.OrderID;
    ClientHubID = this.props.navigation.state.params.ClientHubID;
    ClientID = this.props.navigation.state.params.ClientID;
  }

  componentDidUpdate() {
    const order = Utils.getOrder(this.props.db, OrderID, 1);
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

    const CW = this.state.Length * this.state.Width * this.state.Height * 0.2;
    calculated = false;
    this.setState({ [prop]: value, CalculateWeight: CW });
  }
  onSaveWeightSizePress(order) {
    if (!this.isInfoChanged(order)) return;
    if (calculated) {
      this.showSaveDialog();
    } else {
      waitToSave = true;
      this.onCalculateFeePress(order);
    }
  }
  onSaveWeightSize() {
    const { Length, Weight, Width, Height } = this.state;
    const { pdsId, ServiceFee } = this.props;
    const params = {
      Length, 
      Width,
      Height,
      Weight,
      ClientID,
      ClientHubID,
      OrderID,
      PDSID: pdsId,
      ServiceFee
    };
    this.props.updateWeightSize(params);
  } 
  onCalculateFeePress(order) {
    if (!this.isInfoChanged(order)) return;

    const { Length, Weight, Width, Height } = this.state;
    const { ServiceID, FromDistrictID, ToDistrictID } = order;
    const params = {
      Weight,
      Length,
      Width,
      Height,
      OrderID,
      ClientID,
      ServiceID,
      FromDistrictID,
      ToDistrictID
    };
    calculated = true;
    this.props.calculateServiceFee(params);
  }
  
  isInfoChanged(order) {
    const { Length, Weight, Width, Height } = this.state;
    if (order.Length == Length 
      && order.Weight == Weight 
      && order.Height == Height 
      && order.Width == Width) {
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
    if (ServiceFee == '0') {
      return (
        <Text style={{ color: 'red' }}>Chưa tính</Text>
      );
    } 

    return (
      <Text style={{ color: 'red' }}>{accounting.formatNumber(ServiceFee)} đ</Text>
    );
  }

  render() {
    const order = Utils.getOrder(this.props.db, OrderID, 1);
    const { OrderCode, ServiceCost, CODAmount, Weight, Length, Width, Height } = order;
    
    if (this.state.Weight === null) {
      this.state.Weight = Weight;
      this.state.Height = Height;
      this.state.Length = Length;
      this.state.Width = Width; 
      this.state.CalculateWeight = Length * Width * Height * 0.2;
    }

    const ServiceFee = this.props.ServiceFee || CODAmount;

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
            <Title>{OrderCode}</Title>
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
              value={this.state.Weight.toString()}
              onChangeText={value => this.onInputChange('Weight', value)}
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
              value={this.state.Length.toString()}
              onChangeText={value => this.onInputChange('Length', value)}
              keyboardType='numeric'
            />
            <Text> x </Text>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.Width.toString()}
              onChangeText={value => this.onInputChange('Width', value)}
              keyboardType='numeric'
            />
            <Text> x </Text>
            <TextInput 
              style={{ flex: 1, borderColor: 'gray' }}
              value={this.state.Height.toString()}
              onChangeText={value => this.onInputChange('Height', value)}
              keyboardType='numeric'
            />
            <Text> cm3</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Khối lượng quy đổi: </Text><Text style={{ color: 'blue' }}>{this.state.CalculateWeight} g</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Phí vận chuyển: </Text>
            {this.renderFee(ServiceFee)}
          </View>
          <View style={styles.rowStyle}>
            <Button 
              onPress={this.onCalculateFeePress.bind(this, order)}
              block 
              style={{ flex: 0.5, margin: 2 }}
            >
              <Text>Tính Phí</Text>
            </Button>
            <Button 
              onPress={this.onSaveWeightSizePress.bind(this, order)}
              block 
              style={{ flex: 0.5, margin: 2 }}
            >
              <Text>Lưu</Text>
            </Button>
          </View>
        </Content>
        <LoadingSpinner loading={this.props.loading} />
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
  const { pdsId, loading } = pd;
  const { ServiceFee } = other;
  const db = getOrders(state);
  return { db, sessionToken, ServiceFee, pdsId, loading };
};


export default connect(
  mapStateToProps, 
  { calculateServiceFee, updateWeightSize }
)(POUpdateWeightSizeScreen);
