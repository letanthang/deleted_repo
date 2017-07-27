import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title,
  Header 
} from 'native-base';
import { connect } from 'react-redux';
import PickGroupList from './components/PickGroupList';

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
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <Body>
            <Title>C đi lấy ({this.props.pickComplete}/{this.props.pickTotal})</Title>
          </Body>
          <Right />
        </Header>
        <PickGroupList {...this.props} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, pickTotal, pickComplete } = pd;
  return { pds, pickTotal, pickComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
