import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Text,
  Header, Input, Item 
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import DeliveryByGroup from '../components/delivery/DeliveryByGroup';
import AppFooter from '../components/AppFooter';
import Utils from '../libs/Utils';
import { Colors } from '../Styles';

class DeliveryListScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  goBack() {
    const dispatch = this.props.navigation.dispatch;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ 
          routeName: 'Drawer', 
          action: NavigationActions.navigate({ routeName: 'Home' }) 
        })
      ]
    });
    dispatch(resetAction);
  }

  renderHeader() {
    const { navigate, goBack } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Tìm đơn hàng ..." value={this.state.keyword} 
              onChangeText={(keyword) => { 
                if (keyword !== undefined) {
                  console.log('keyword changed!');
                  this.setState({ keyword: keyword.trim() });
                }
              }}
            />
            <Button
              transparent
              small
              onPress={() => this.setState({ keyword: '' })}
            >
              <IconFA 
                name="times-circle" size={14} 
              />
            </Button>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 8 }}
              onPress={() => this.setState({ showSearch: !this.state.showSearch })}
            >
              <Text>Huỷ</Text>
            </Button>
          </Right>
        </Header>
        );
    } 
    
    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => this.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={{ flex: 3 }}>
          <Title>Giao ({this.props.deliveryComplete}/{this.props.deliveryTotal})</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Icon name="search" />
          </Button>
          <Button
            transparent
            onPress={() => navigate('DeliveryGroupCreate')}
          >
            <IC name="group" size={22} color={Colors.headerActive} />
          </Button>
        </Right>
      </Header>
    );
  }

  render() {
    const deliveryListRun = this.props.pds.DeliveryItems.filter(o => !Utils.checkDeliveryComplete(o.CurrentStatus));
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <DeliveryByGroup deliveryList={deliveryListRun} navigation={this.props.navigation} keyword={this.state.keyword} />
        <AppFooter navigation={this.props.navigation} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryListScreen);
