import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Tabs,
  Tab, Header 
} from 'native-base';
import { connect } from 'react-redux';
import PickGroupList from '../components/pickReturn/PickGroupList';
import { Styles, Colors } from '../Styles';

class PickListScreen extends Component {
  componentWillMount() {
    console.log('PickListScreen: CWM called!');
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 2 }}>
            <Title>Chuyến đi lấy ({this.props.pickComplete}/{this.props.pickTotal})</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="Đang Lấy">
            <PickGroupList {...this.props} done={false} />
          </Tab>
          <Tab heading="Xong">
            <PickGroupList {...this.props} done />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = ({ pd }) => {
  const { pds, pickTotal, pickComplete } = pd;
  return { pds, pickTotal, pickComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
