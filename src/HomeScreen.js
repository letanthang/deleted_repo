import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { 
  Container, Header, Title, Left, Body, 
  Right, Content, Text, Button, Icon,
  Card, CardItem, Item, Thumbnail 
} from 'native-base';
import { connect } from 'react-redux';
import { pdListFetch } from './actions';

const efficiencyIcon = require('../resources/ic_summary.png');

class HomeScreen extends Component {
  componentWillMount() {
    console.log(this.props.user);
    if (!this.props.user) return;
    const sessionToken = this.props.user.SessionToken;
    this.props.pdListFetch(sessionToken);
  }
  onPickPress() {
    console.log('PickList pressed!');
    const { navigate } = this.props.navigation;
    navigate('PickList');
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
            <Title>MPDS</Title>
          </Body>
          <Right>
        
            <Button
              transparent
            >
              <Icon name="notifications" />
            </Button>
            
          </Right>
        </Header>
        <Content style={{ padding: 10 }}>
          <TouchableOpacity 
            onPress={this.onPickPress.bind(this)}
          >
            <Card>
              <CardItem>
                <View style={styles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#12cd72' }}>
                      Lấy hàng
                    </Text>
                    <Text>
                      Hoàn thành
                    </Text>
                    <Text>
                      Tổng số
                    </Text>
                  </View>
                </View>
                <View style={styles.cardItemRight}>
                  <Item rounded style={{ height: 55, width: 55 }}>
                    <View style={{ marginTop: -10, marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>0</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 12 }}>/{this.props.pickTotal}</Text>
                    </View>
                  </Item>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
          

          <Card>
            <CardItem>
              <View style={styles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#ff6e40' }}>
                    Giao hàng
                  </Text>
                  <Text>
                    Hoàn thành
                  </Text>
                  <Text>
                    Tổng số
                  </Text>
                </View>
              </View>
              <View style={styles.cardItemRight}>
                <Item rounded style={{ height: 55, width: 55 }}>
                  <View style={{ marginTop: -10, marginLeft: 5 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>0</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 12 }}>/{this.props.deliveryTotal}</Text>
                  </View>
                </Item>
              </View>
            </CardItem>
          </Card>


          <Card>
            <CardItem>
              <View style={styles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>
                    Năng suất làm việc
                  </Text>
                  
                </View>
              </View>
              <View style={styles.cardItemRight}>
                <Image source={efficiencyIcon} />
              </View>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = ({ auth, pd }) => {
  const { pdList, loading, error, pickTotal, deliveryTotal } = pd;
  const { user } = auth;
  return { pdList, loading, error, user, pickTotal, deliveryTotal };
};

export default connect(mapStateToProps, { pdListFetch })(HomeScreen);
