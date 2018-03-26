import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Tabs,
  Tab, Header 
} from 'native-base';
import { connect } from 'react-redux';
import Performance from '../components/performance/Performance';
import All from '../components/performance/All';
import { Styles, Colors } from '../Styles';

class PerformanceScreen extends Component {
  componentWillMount() {
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  render() {
    const { goBack } = this.props.navigation;
    const { yesterday, week, month } = this.props;
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
          <Body style={{ flex: 1.5 }}>
            <Title>MPDS</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="Hôm Qua">
            <Performance stats={yesterday} statType='yesterday' />
          </Tab>
          <Tab heading="Tuần Này">
            <Performance stats={week} statType='week' />
          </Tab>
          <Tab heading="Tháng Này">
            <Performance stats={month} statType='month' />
          </Tab>
          <Tab heading="Tất cả">
            <All />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = ({ other }) => {
  const { yesterday, week, month } = other;
  return { yesterday, week, month };
};

export default connect(mapStateToProps, { })(PerformanceScreen);
