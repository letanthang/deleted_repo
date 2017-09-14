import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title,
  Header 
} from 'native-base';
import { connect } from 'react-redux';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
import PickGroupList from '../components/pickReturn/PickGroupList';
import AppFooter from '../components/AppFooter';
import { Colors } from '../Styles';

class PickListScreen extends Component {
  state = { done: false }
  componentWillMount() {
    console.log('ReturnListScreen: CWM called!');
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  goBack() {
    const dispatch = this.props.navigation.dispatch;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ 
          routeName: 'Drawer', 
          action: NavigationActions.navigate({ routeName: 'Home' }) 
        })
      ]
    });
    dispatch(resetAction);
  }
  render() {
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>C đi trả ({this.props.returnComplete}/{this.props.returnTotal})</Title>
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
        <PickGroupList {...this.props} pdType={3} done={this.state.done} />
        <AppFooter navigation={this.props.navigation} />
      </Container>
    );
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, returnTotal, returnComplete } = pd;
  return { pds, returnTotal, returnComplete };
};

export default connect(mapStateToProps, { })(PickListScreen);
