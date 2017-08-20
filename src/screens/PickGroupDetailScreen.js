import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab,
  Title
} from 'native-base';
import { updateOrderStatus } from '../actions';

// import Utils from './libs/Utils';
import { Styles } from '../Styles';
import PickGroupDetail from '../components/pickReturn/PickGroupDetail';
import LoadingSpinner from '../components/LoadingSpinner';

class PickGroupDetailScreen extends Component {
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
      
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.goBack()}
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
            >
              <Icon name="information-circle" />
            </Button>
          </Right>
        </Header>
        <Tabs initialPage={0}>
          <Tab heading={pickGroup.PickDeliveryType === 1 ? 'Đang Lấy' : 'Đang Trả'}>
            <PickGroupDetail {...this.props} done={false} />
          </Tab>
          <Tab heading="Xong">
            <PickGroupDetail {...this.props} done />
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
