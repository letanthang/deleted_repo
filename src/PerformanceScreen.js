import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Tabs,
  Tab, Header 
} from 'native-base';
import { connect } from 'react-redux';
import Performance from './components/Performance';
import { Styles } from './Styles';

class PerformanceScreen extends Component {
  componentWillMount() {
    console.log('PerformanceScreen: CWM called!');
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
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 1.5 }}>
            <Title style={Styles.normalColorStyle}>MPDS</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading="Hôm Qua">
            <Performance {...this.props} />
          </Tab>
          <Tab heading="Tuần Này">
            <Performance {...this.props} />
          </Tab>
          <Tab heading="Tháng Này">
            <Performance {...this.props} />
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

export default connect(mapStateToProps, { })(PerformanceScreen);
