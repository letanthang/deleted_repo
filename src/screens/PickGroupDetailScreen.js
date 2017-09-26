import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab,
  Title, Input, Item, Text
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateOrderStatus } from '../actions';
// import Utils from './libs/Utils';
import { Styles, Colors } from '../Styles';
import PickGroupDetail from '../components/pickReturn/PickGroupDetail';
import LoadingSpinner from '../components/LoadingSpinner';

class PickGroupDetailScreen extends Component {
  state = { showSearch: false, keyword: '', done: false };

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
            onPress={() => this.setState({ showSearch: !this.state.showSearch, keyword: '' })}
          >
            <Text>Huỷ</Text>
          </Button>
        </Header>
        );
    } 

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
          <Title>{pickGroup.ClientName} - {pickGroup.ContactName}</Title>
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
            onPress={() => this.setState({ done: !this.state.done, keyword: '' })}
          >
            <IC name="playlist-check" size={25} color={this.state.done ? Colors.headerActive : Colors.headerNormal} />
          </Button>
        </Right>
      </Header>
    );
  }

  render() {
    const { pds } = this.props;
    const { PickItems, ReturnItems } = pds;
    const { PickDeliveryType } = this.pickGroup;

    const Items = PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(trip => trip.ClientHubID === this.ClientHubID); 
      
    console.log('====================================');
    console.log('PickGroupDetail render!');
    console.log(pickGroup);
    console.log('====================================');

    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <PickGroupDetail {...this.props} keyword={this.state.keyword} done={this.state.done} />
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
