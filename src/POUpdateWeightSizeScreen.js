import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Input, Item, Left,
  Body, Right
} from 'native-base';
import accounting from 'accounting';

import Utils from './libs/Utils';
import LoadingSpinner from './components/LoadingSpinner';

class POUpdateWeightSizeScreen extends Component {

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
    console.log('====================================');
  }
  
  render() {
    const OrderID = this.props.navigation.state.params.OrderID;
    const order = Utils.getOrder(this.props.pds, OrderID);
    console.log('Render called, order = ');
    console.log(order);
    const { OrderCode, Weight, Length, Width, Height, ServiceCost } = order;
    console.log(Weight);
    const testvalue = 'abc123';

    const { goBack } = this.props.navigation;
    return (
      <Container>
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
      
        <Content>
          <View style={styles.rowStyle}>
            <Text>Khối lượng </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={Weight.toString()}
            />
            <Text> g</Text>
          </View>
          
          <View style={styles.rowStyle}>
            <Text>Kích thước </Text>  
          </View>
          <View style={styles.rowStyle}>
          
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={Length.toString()}
            />
            <Text> x </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={Width.toString()}
            />
            <Text> x </Text>
            <TextInput 
              style={{ height: 30, flex: 1, borderColor: 'gray', borderBottomWidth: 1 }}
              value={Height.toString()}
            />
            <Text> cm3</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Khối lượng quy đổi: </Text><Text style={{ color: 'blue' }}>{Length * Width * Height * 0.2} g</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text>Phí vận chuyển: </Text><Text style={{ color: 'red' }}>{accounting.formatNumber(ServiceCost)} đ</Text>
          </View>
          <View style={styles.rowStyle}>
            <Button block style={{ flex: 0.5, margin: 2 }}>
              <Text>Tính Phí</Text>
            </Button>
            <Button block style={{ flex: 0.5, margin: 2 }}>
              <Text>Lưu</Text>
            </Button>
          </View>
        </Content>

        <LoadingSpinner />
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

const mapStateToProps = ({ pd, auth }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  return { pds, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { }
)(POUpdateWeightSizeScreen);
