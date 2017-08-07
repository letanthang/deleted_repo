import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, Text, Title, Icon,
  Header, Button, Left, Right, Body,
  List, ListItem 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { phonecall } from 'react-native-communications';
import { updateOrderStatus } from './actions';
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
    const { OrderCode, Weight, Length, Width, Height } = order;
    return (
      <Container>
        <Header>
          <Button>
            <Icon name="back" />
          </Button>
          <Title>{OrderCode}</Title>
        </Header>
      
        <Content>
          <View>
            <Text>Hello</Text>
          </View>
        </Content>
        <LoadingSpinner />
      </Container>
    );
  }
}

const mapStateToProps = ({ pd, auth }) => {
  //const OrderID = ownProps.navigation.state.params.OrderID;
  const { sessionToken } = auth;
  const { pds, pdsId, loading } = pd;
  return { pds, pdsId, sessionToken, loading };
};


export default connect(
  mapStateToProps, 
  { updateOrderStatus }
)(POUpdateWeightSizeScreen);
