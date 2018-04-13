import React, { Component } from 'react';
import { 
  Container, Right, Left, Body, 
  Icon, Button, Title, Header
} from 'native-base';
import DeliveryGroupCreate from './DeliveryGroupCreate';
import { Colors, Styles } from '../../Styles';

class DeliveryGroupCreateScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  renderHeader() {
    const { goBack } = this.props.navigation;

    return (
      <Header>
        <Left style={Styles.leftStyle}>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>Tạo Nhóm Giao</Title>
        </Body>
        <Right style={Styles.rightStyle} />
      </Header>
    );
  }

  render() {
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <DeliveryGroupCreate />
      </Container>
    );
  }

}

// const mapStateToProps = ({ pd }) => {
//   const { pds, deliveryTotal, deliveryComplete } = pd;
//   return { pds, deliveryTotal, deliveryComplete };
// };

// export default connect(mapStateToProps, {})(DeliveryGroupCreateScreen);
export default DeliveryGroupCreateScreen;
