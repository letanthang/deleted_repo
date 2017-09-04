import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { 
  Container, Header, Title, Left, Body, 
  Right, Content, Text, Button, Icon,
  Card, CardItem, Toast, Footer, FooterTab
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { pdListFetch } from '../actions';
import PDCard from '../components/home/PDCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';
import LocalGroup from '../libs/LocalGroup';
import AppFooter from '../components/AppFooter';

const efficiencyIcon = require('../../resources/ic_summary.png');

class HomeScreen extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('HomeScreen : CWM');
    const params = this.props.navigation.state.params;
    const needUpdateData = (params === undefined) ? false : params.needUpdateData;
    if (needUpdateData || !this.props.pds) {
      if (needUpdateData) params.needUpdateData = false;
      console.log('update pds data:');
      console.log(needUpdateData);
      console.log(this.props.pds);
      this.props.pdListFetch();
    }
    this.listGroups();
    this.state = { date: new Date() };
    console.log(this.state.date);
    console.log('===================================='); 
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error && nextProps.error !== '') {
      //ToastAndroid.show(nextProps.error, ToastAndroid.SHORT);
      Toast.show({
        text: nextProps.error,
        position: 'bottom',
        type: 'warning',
        duration: 1100
      });
    }
  }
  
  shouldComponentUpdate({ user }) {
    return user !== null;
  }
  componentDidUpdate() {
    console.log('====================================');
    console.log('HomeScreen : CDU');
    const params = this.props.navigation.state.params;
    const needUpdateData = (params === undefined) ? false : params.needUpdateData;
    if (needUpdateData) {
      if (needUpdateData) params.needUpdateData = false;
      console.log('update pds data:');
      console.log(needUpdateData);
      console.log(this.props.pds);
      this.props.pdListFetch();
    }
    console.log('====================================');
  }
  onPickPress() {
    if (this.props.pickTotal === 0) return;
    console.log('PickList pressed!');
    const { navigate } = this.props.navigation;
    navigate('PickList');
  }
  onReturnPress() {
    if (this.props.returnTotal === 0) return;
    console.log('ReturnList pressed!');
    const { navigate } = this.props.navigation;
    navigate('ReturnList');
  }
  onDeliveryPress() {
    if (this.props.deliveryTotal === 0) return;
    console.log('DeliveryList pressed!');
    const { navigate } = this.props.navigation;
    navigate('DeliveryList');
  }
  async listGroups() {
    try {
      //await LocalGroup.getLocalDB();
      //await LocalGroup.resetDB();
      let groups = LocalGroup.getGroups();
      if (groups.length === -1) {
        await LocalGroup.addGroup('nhom1');
        await LocalGroup.addGroup('nhom2');
      }
      // await LocalGroup.setGroups([]);
      
      groups = LocalGroup.getGroups();
      console.log('HomeScreen:  listGroups async');
      console.log(groups);
    } catch (error) {
      console.log('local group failed with error=');
      console.log(error);
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    const iosBarStyle = Theme === 'dark' ? 'light-content' : 'default';

    return (
      
        <Container style={{ backgroundColor: Colors.background }}>
          <Header
            iosBarStyle={iosBarStyle}
          >
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
            <Right />
          </Header>
          <Content style={{ padding: 10 }}>
            <PDCard
              type='pick'
              onPress={this.onPickPress.bind(this)}
              upNumber={this.props.pickComplete}
              downNumber={this.props.pickTotal}
              color='#12cd72'
              delay={false}
            />
            <PDCard
              type='delivery'
              onPress={this.onDeliveryPress.bind(this)}
              upNumber={this.props.deliveryComplete}
              downNumber={this.props.deliveryTotal}
              color='#ff6e40'
              delay={false}
            />
            <PDCard
              type='return'
              onPress={this.onReturnPress.bind(this)}
              upNumber={this.props.returnComplete}
              downNumber={this.props.returnTotal}
              color='#606060'
              delay={false}
            />
            <TouchableOpacity
              onPress={() => navigate('Performance')}
            >
              <Card>
                <CardItem style={{ backgroundColor: Colors.row }}>
                  <View style={HomeStyles.cardItemLeft}>
                    <View>
                      <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>
                        Năng suất làm việc
                      </Text>
                    </View>
                  </View>
                  <View style={HomeStyles.cardItemRight}>
                    <Image source={efficiencyIcon} />
                  </View>
                </CardItem>
              </Card>
            </TouchableOpacity>
          </Content>
          <AppFooter />
          <LoadingSpinner loading={this.props.loading} />
        </Container>
      
      
    );
  }
}

const mapStateToProps = ({ auth, pd }) => {
  const { 
    pds, loading, error, pickTotal, pickComplete, 
    deliveryTotal, deliveryComplete, returnTotal, returnComplete } = pd;
  const { user } = auth;
  return { 
    pds, 
    loading, 
    error, 
    user, 
    pickTotal,
    pickComplete, 
    deliveryTotal, 
    deliveryComplete, 
    returnTotal, 
    returnComplete 
  };
};

export default connect(mapStateToProps, { pdListFetch })(HomeScreen);
