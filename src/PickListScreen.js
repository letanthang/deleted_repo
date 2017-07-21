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
    console.log('PickListScreen: CDU called');
    console.log(this.props.pickList);
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
            <Title>C đi lấy ({this.props.pickComplete}/{this.props.pickTotal})</Title>
          </Body>
          <Right />
        </Header>
        <PickGroupList pickList={this.props.pickList} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pickList, pickTotal, pickComplete } = pd;
  return { pickList, pickTotal, pickComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
