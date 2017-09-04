import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Text,
  Header, Tab, Tabs, Input, Item 
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import DeliveryGroupList from '../components/delivery/DeliveryGroupList';
import DeliveryByGroup from '../components/delivery/DeliveryByGroup';
import DeliveryGroupCreate from '../components/delivery/DeliveryGroupCreate';
import Utils from '../libs/Utils';
import { Colors } from '../Styles';

class DeliveryGroupCreateScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  renderHeader() {
    const { navigate, goBack } = this.props.navigation;

    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={{ flex: 3 }}>
          <Title>Tạo Nhóm Giao</Title>
        </Body>
        <Right />
      </Header>
    );
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const deliveryList = this.props.pds.DeliveryItems;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <DeliveryGroupCreate deliveryList={deliveryList} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryGroupCreateScreen);
