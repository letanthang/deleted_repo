import React, { Component } from 'react';
import { 
  Container, Content, Right, Left, Body, 
  Icon, Button, Title, Card, CardItem,
  Text, Header 
} from 'native-base';
import { connect } from 'react-redux';
import { pdPickList } from './actions';

class PickListScreen extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('PickListScreen: CWM called!');
    console.log('====================================');
    this.props.pdPickList();
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('====================================');
    console.log('PickListScreen: CDU called');
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
            <Title>Chuyến đi lấy ({this.props.pickComplete}/{this.props.pickTotal})</Title>
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
                Don hang: {this.props.pickComplete}/{this.props.pickTotal}
              </Text>
            </CardItem>
            <CardItem>
              <Right>
                <Text style={{ color: '#00b0ff' }}>GỌI ĐIỆN CHO SHOP</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pickList, pickTotal, pickComplete } = pd;
  return { pickList, pickTotal, pickComplete };
};

export default connect(mapStateToProps, { pdPickList })(PickListScreen);
