import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container, Content, List, ListItem,
  Input, Header, Body, Left, Right,
  Title
}

class PickGroupDetailScreen extends Component {
  componentWillMount() {
    console.log('PickGroupDetailScreen mount');
    console.log(this.props.pickGroup);
  }
  renderOrder(order) {
    const { OrderCode, RecipientName, RecipientPhone, Height, Width, Weight, Length } = order;
    return (
      <ListItem>
        <Text>{OrderCode}</Text>
        <Text>{RecipientName} - {RecipientPhone}</Text>
        <Text>{Weight} g|{Length}-{Width}-{Height}(cm3)</Text>
        <Text>Tiền thu:{ServiceCost}đ</Text>
      </ListItem>
    );
  }

  render() {
    const { navigation, pickGroup } = this.props;
    
    return (
      
      <Container>
        <Header>
          <Button
            transparent
            onPress={() => navigation.navigate('DrawerOpen') }
          >
            <Icon name="menu"/>
          </Button>

          <Button
            transparent
            onPress={() => navigation.back() }
          >
            <Icon name="back"/>
          </Button>
          <Title>[{pickGroup.DisplayOrder}] {pickGroup.ClientName}</Title>
          <Button>
            <Icon name="info" />
          </Button>
        </Header>
      
        <Content>
          <List
            dataArray={pickGroup.PickReturnSOs}
            renderRow={this.renderOrder.bind(this)}
          />
        </Content>
      
        
      </Container>
      
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { sessionToken } = auth;
  return { sessionToken };
};


export default connect(mapStateToProps, {})(PickGroupDetailScreen)