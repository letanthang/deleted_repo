import React, { Component } from 'react';
import { View, InputGroup } from 'react-native';
import { 
  Content, Card, CardItem, Text, 
  Input, Button, Item, Badge,
  Body, Left, Right, List, ListItem 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import CheckBox from 'react-native-check-box';

class DeliveryGroupCreate extends Component {
  componentWillMount() {
    console.log('DeliveryGroupCreate: cwm !');
    console.log(this.props.deliveryList);
  }

  renderOrder(order) {
    console.log('renderOrder is called!');
    console.log(order);
    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount } = order;
    return (
      <Card>
          <CardItem>
            <View>
              <Text>
                {OrderCode}
              </Text>
              <Text>
                {Address}
              </Text>
            </View>
            <Right>
              <CheckBox 
                onClick={() => console.log('CB checked!')}
              />
            </Right>
          </CardItem>
        </Card>
    );
  }

  render() {
    return (
      <Content>
        <Grid>
          <Row>
            <Col>
              <Item>
                <Input placeholder='Nhom1' />
              </Item>
            </Col>
            <Col>
              <Right>
                <Button light>
                  <Text>TẠO NHÓM</Text>
                </Button>
              </Right>
            </Col>
          </Row>
          <Row>
            <List
              dataArray={this.props.deliveryList}
              renderRow={this.renderOrder.bind(this)}
            />
          </Row>
        </Grid>
      </Content>
    );
  }
}

export default DeliveryGroupCreate;
