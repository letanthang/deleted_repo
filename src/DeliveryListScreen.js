import React, { Component } from 'react';
import { 
  Container, Content, Right, Left, Body, 
  Icon, Button, Title, Card, CardItem,
  Text, Header 
} from 'native-base';
import { connect } from 'react-redux';

class DeliveryListScreen extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('DeliveryListScreen: CWM called!');
    console.log('====================================');
    this.props.pdPickList();
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('====================================');
    console.log('DeliveryListScreen: CDU called');
    console.log(this.props.pickList);
    console.log('====================================');
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigate('DrawerOpen')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Chuyến đi giao ({this.props.deliveryComplete}/{this.props.deliveryTotal})</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Card>
            <CardItem header>
              <Text>
                Thuong QC24
              </Text>
            </CardItem>
            
            <CardItem>
              <Text>
                Address - 1 Thanh Thai, HCM, VietNam, abc street
              </Text>              
            </CardItem>
            <CardItem>
              <Text>
                Tong thu: 0 d
              </Text>
            </CardItem>
            <CardItem footer>
              <Text>
                Don hang: {this.props.deliveryComplete}/{this.props.deliveryTotal}
              </Text>
            </CardItem>
            <CardItem>
              <Right>
                <Text style={{ color: '#00b0ff' }}>GHNGHNGHNGHNGHNGHN</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { deliveryList, deliveryTotal, deliveryComplete } = pd;
  return { deliveryList, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(DeliveryListScreen);
