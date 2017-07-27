import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Content, List, ListItem,
  Input, Header, Body, Left, Right,
  Button, Icon, Item,
  Title, Text
} from 'native-base';
import ChkBox from 'react-native-check-box';
import { updateOrderStatus } from './actions';

class PickGroupDetailScreen extends Component {
  state = { pickGroup: this.props.navigation.state.params.pickGroup };

  componentWillMount() {
    
  }
  updateOrder(order, status) {
    const { sessionToken, pdsId } = this.props;
    console.log(`updateOrder to status : ${status} ${pdsId}`);
    console.log(order);
    this.props.updateOrderStatus({ sessionToken, pdsId, order, status });
  }
  renderOrder(order) {
    const { 
      OrderCode, RecipientName, RecipientPhone, ServiceCost, 
      Height, Width, Weight, Length, CurrentStatus
    } = order;
    return (
      <View style={{ padding: 5 }}>
        <Text>{OrderCode}</Text>
        <Text>{RecipientName} - {RecipientPhone}</Text>
        <Text>{Weight} g|{Length}-{Width}-{Height} (cm3)</Text>
        <Text>Tiền thu: {ServiceCost} đ</Text>
        <Item>
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => console.log('loi pressed')}
            isChecked={false}
            rightText="LOI" 
          /> 
          <ChkBox
            style={{ flex: 1, padding: 10 }}
            onClick={this.updateOrder.bind(this, order, 'Storing')}
            isChecked={CurrentStatus === 'Storing'}
            rightText="DA LAY" 
          /> 
        </Item>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { pickGroup } = this.state;
    
    return (
      
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.navigate('DrawerOpen')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Button
            transparent
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body>
            <Title>[{pickGroup.DisplayOrder}] {pickGroup.ClientName}</Title>
          </Body>
          <Right>
            <Button
              transparent
            >
              <Icon name="information-circle" />
            </Button>
          </Right>
        </Header>
      
        <Content>
          <List
            dataArray={pickGroup.PickReturnSOs}
            renderRow={this.renderOrder.bind(this)}
          />
        </Content>
      
        
      </Container>
      
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { sessionToken } = auth;
  const { pdsId } = pd;
  return { sessionToken, pdsId };
};


export default connect(mapStateToProps, { updateOrderStatus })(PickGroupDetailScreen);
