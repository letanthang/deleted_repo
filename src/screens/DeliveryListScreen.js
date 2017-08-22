import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Text,
  Header, Tab, Tabs, Input, Item 
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import DeliveryGroupList from '../components/delivery/DeliveryGroupList';
import DeliveryByGroup from '../components/delivery/DeliveryByGroup';
import DeliveryGroupCreate from '../components/delivery/DeliveryGroupCreate';
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
          <Button
            transparent
            style={{ marginLeft: 8 }}
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Text>Huỷ</Text>
          </Button>
        </Header>
        );
    } 

    return (
      <Header hasTabs>
        <Left>
          <Button
            transparent
            onPress={() => goBack()}
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
        </Right>
      </Header>
    );
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const deliveryList = this.props.pds.DeliveryItems;
    const deliveryListRun = this.props.pds.DeliveryItems.filter(o => !Utils.checkDeliveryComplete(o.CurrentStatus));
    const deliveryListDone = this.props.pds.DeliveryItems.filter(o => Utils.checkDeliveryComplete(o.CurrentStatus));
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <Tabs initialPage={0}>
          <Tab heading="Nhóm">
            <DeliveryByGroup deliveryList={deliveryListRun} navigation={this.props.navigation} keyword={this.state.keyword} />
          </Tab>
          <Tab heading="Tạo Nhóm">
            <DeliveryGroupCreate deliveryList={deliveryList} />
          </Tab>
          <Tab heading="Đã giao">
            <DeliveryGroupList deliveryList={deliveryListDone} navigation={this.props.navigation} keyword={this.state.keyword} />
          </Tab>
        </Tabs>
        
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryListScreen);
