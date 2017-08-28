import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab,
  Title, Input, Item, Text
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { updateOrderStatus } from '../actions';
// import Utils from './libs/Utils';
import { Styles, Colors } from '../Styles';
import PickGroupDetail from '../components/pickReturn/PickGroupDetail';
import LoadingSpinner from '../components/LoadingSpinner';

class PickGroupDetailScreen extends Component {
  state = { showSearch: false, keyword: '' };

  componentWillMount() {
    //state = { pickGroup: this.props.navigation.state.params.pickGroup };
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    console.log('====================================');
    console.log('PickGroupDetailScreen: cwm is called. pickgroup = ');
    console.log(this.props.navigation.state.params.pickGroup);
    console.log('====================================');
        
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
  }

  renderHeader(pickGroup) {
    const { goBack } = this.props.navigation;
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
                  console.log('keyword changed!');
                  this.setState({ keyword: keyword.trim() });
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
          <Title>[{pickGroup.DisplayOrder}] {pickGroup.ClientName}</Title>
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
    const { DisplayOrder } = this.pickGroup;

    this.pickGroup = this.props.pds.PickReturnItems.find(pg => pg.ClientHubID === this.ClientHubID 
      && pg.PickDeliveryType === this.PickDeliveryType && pg.DisplayOrder === DisplayOrder);
      
    const { navigation } = this.props;
    const { pickGroup } = this;
    

    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log(pickGroup);
    console.log('====================================');

    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <Tabs initialPage={0}>
          <Tab heading={pickGroup.PickDeliveryType !== 3 ? 'Đang Lấy' : 'Đang Trả'}>
            <PickGroupDetail {...this.props} keyword={this.state.keyword} done={false} />
          </Tab>
          <Tab heading="Xong">
            <PickGroupDetail {...this.props} done keyword={this.state.keyword} />
          </Tab>
        </Tabs>
        <LoadingSpinner loading={this.props.loading} />
      </Container>
      
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  return { sessionToken, pdsId, pds, loading };
};

export default connect(mapStateToProps, { updateOrderStatus })(PickGroupDetailScreen);
