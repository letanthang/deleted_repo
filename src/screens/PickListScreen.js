import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Tabs,
  Tab, Header 
} from 'native-base';
import { connect } from 'react-redux';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import PickGroupList from '../components/pickReturn/PickGroupList';
import AppFooter from '../components/AppFooter';
import { Styles, Colors } from '../Styles';

class PickListScreen extends Component {
  state = { done: false }
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
            <Title>Lấy ({this.props.pickComplete}/{this.props.pickTotal})</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.setState({ done: !this.state.done })}
            >
              <IC name="playlist-check" size={25} color={this.state.done ? Colors.headerActive : Colors.headerNormal} />
            </Button>
          </Right>
        </Header>
        <PickGroupList {...this.props} done={this.state.done} />
        <AppFooter navigation={this.props.navigation} />
      </Container>
    );
  }
}

const mapStateToProps = ({ pd }) => {
  const { pds, pickTotal, pickComplete } = pd;
  return { pds, pickTotal, pickComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
