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
import LoadingSpinner from '../components/LoadingSpinner';
import { calculateServiceFee, updateWeightSize } from '../actions';
import { Colors } from '../Styles';

let ClientID = null;
let waitToSave = false;
class POUpdateWeightSizeScreen extends Component {
  state = { Weight: null, Height: null, Length: null, Width: null, CalculateWeight: null }

  componentWillMount() {
    const OrderID = this.props.navigation.state.params.OrderID;
    console.log('====================================');
    console.log(`PickOrderScreen: cwm called with
    OrderID = ${OrderID}`);
    console.log('====================================');
  }

  componentDidUpdate() {
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = Utils.getOrder(this.props.pds, OrderID);
    console.log('====================================');
    console.log(`PickOrderScreen: cdu, OrderId = ${OrderID}, order = `);
    console.log(order);
    if (waitToSave) {
      console.log('wait to save ...');
      waitToSave = false;
      Alert.alert(
        'Really want to update?',
        `Do you really want o update, with new fee: ${this.props.ServiceFee}`,
        [
          { text: 'Đồng ý', onPress: () => this.onSaveWeightSize(order) },
          { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' }
        ],
        { cancelable: false }
      );
    }
    console.log('====================================');
  }

// 
// 
// 
// 
  onInputChange(prop, value) {
    this.state[prop] = value;

    const CW = this.state.Length * this.state.Width * this.state.Height * 0.2;

    this.setState({ [prop]: value, CalculateWeight: CW });
  }
  onSaveWeightSizePress(order) {
    if (!this.isInfoChanged(order)) return;
    waitToSave = true;
    this.onCalculateFeePress(order);
  }
  onSaveWeightSize(order) {
    const { Length, Weight, Width, Height } = this.state;
    const { OrderID } = order;
    const { pdsId, ServiceFee } = this.props;
    const params = {
      Length, 
      Width,
      Height,
      Weight,
      ClientID,
      OrderID,
      PDSID: pdsId,
      ServiceFee
    };
    this.props.updateWeightSize(params);
  } 
  onCalculateFeePress(order) {
    if (!this.isInfoChanged(order)) return;

    const { Length, Weight, Width, Height } = this.state;
    const { OrderID, ServiceID, FromDistrictID, ToDistrictID } = order;
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
    console.log(params);
    this.props.calculateServiceFee(params);
  }
  
  isInfoChanged(order) {
    console.log('vao check changed info');
    const { Length, Weight, Width, Height } = this.state;
    console.log({ Length, Weight, Width, Height });
    console.log({ Length: order.Length, Weight: order.Weight, Width: order.Width, Height: order.Height });
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

  render() {
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = Utils.getOrder(this.props.pds, OrderID);
    ClientID = this.props.navigation.state.params.ClientID;
    console.log('Render called, order = ');
    console.log(order);
    const { OrderCode, ServiceCost, Weight, Length, Width, Height } = order;
    
    if (this.state.Weight === null) {
      this.state.Weight = Weight;
      this.state.Height = Height;
      this.state.Length = Length;
      this.state.Width = Width; 
      this.state.CalculateWeight = Length * Width * Height * 0.2;
    }

    const ServiceFee = this.props.ServiceFee || ServiceCost;

    const { goBack } = this.props.navigation;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>{OrderCode}</Title>
          </Body>
          <Right />
        </Header>
      
        <Content
          keyboardShouldPersistTaps='handled' 
        >
          <View style={styles.rowStyle}>
            <Text>Khối lượng </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={this.state.Weight.toString()}
            />
            <Text> g</Text>
          </View>
          
          <View style={styles.rowStyle}>
            <Text>Kích thước </Text>  
          </View>
          <View style={styles.rowStyle}>
          
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={this.state.Length.toString()}
              onChangeText={value => this.onInputChange('Length', value)}
            />
            <Text> x </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={this.state.Width.toString()}
              onChangeText={value => this.onInputChange('Width', value)}
            />
            <Text> x </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={this.state.Height.toString()}
              onChangeText={value => this.onInputChange('Height', value)}
            />
            <Text> cm3</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Khối lượng quy đổi: </Text><Text style={{ color: 'blue' }}>{this.state.CalculateWeight} g</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Phí vận chuyển: </Text><Text style={{ color: 'red' }}>{accounting.formatNumber(ServiceFee)} đ</Text>
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
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const mapStateToProps = ({ pd, auth, other }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  const { ServiceFee } = other;

  return { pds, sessionToken, ServiceFee, pdsId, loading };
};


export default connect(
  mapStateToProps, 
  { calculateServiceFee, updateWeightSize }
)(POUpdateWeightSizeScreen);
