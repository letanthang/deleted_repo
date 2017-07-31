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
    console.log('ReturnListScreen: CWM called!');
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
            <Title>C đi trả ({this.props.returnComplete}/{this.props.returnTotal})</Title>
          </Body>
          <Right />
        </Header>
        <PickGroupList {...this.props} pdType={3} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, returnTotal, returnComplete } = pd;
  return { pds, returnTotal, returnComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
