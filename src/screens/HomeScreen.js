import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { 
  Container, Header, Left,
  Right, Content, Text, Button, Icon,
  Card, CardItem, Toast, Input, Item, ActionSheet
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import SearchList from '../components/SearchList';
import { pdListFetch, setLoaded } from '../actions';
import { getNumbers } from '../selectors';
import PDCard from '../components/home/PDCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HomeStyles, Colors, Theme } from '../Styles';
import LocalGroup from '../libs/LocalGroup';
import { navigateOnce } from '../libs/Common';
import AppFooter from '../components/AppFooter';
import Utils from '../libs/Utils';
import MyMenu from '../components/MyMenu';
import LogoButton from '../components/LogoButton';
import BarcodeReader from '../components/BarcodeReader';


const efficiencyIcon = require('../../resources/ic_summary.png');

class HomeScreen extends Component {
  state = { date: new Date(), showMenu: false, showSearch: false, keyword: '', showScanner: false }
  componentWillMount() {
    console.log('HomeScreen');
    const { loaded, pdsItems } = this.props;
    if (!loaded || !pdsItems) {
      this.props.pdListFetch()
        .then(result => {
          if (result) this.props.setLoaded();
          Utils.showToast('Cập nhật chuyến đi thành công.', 'success');
        });
    }
    this.listGroups();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error && nextProps.error !== '') {
      Utils.showToast(nextProps.error, 'warning');
    }
  }
  
  shouldComponentUpdate({ user }) {
    return user !== null;
  }
  componentDidUpdate() {
  }
  onTripListPress() {
    if (this.props.pickTotal === 0) return;
    
    navigateOnce(this, 'TripList');
  }
  onPickPress() {
    if (this.props.pickTotal === 0) return;
    
    navigateOnce(this, 'PickList');
  }
  onReturnPress() {
    if (this.props.returnTotal === 0) return;
    navigateOnce(this, 'ReturnList');
  }
  onDeliveryPress() {
    if (this.props.deliveryTotal === 0) return;
    navigateOnce(this, 'DeliveryList');
  }
  onUpdateDataPress() {
    const dispatch = this.props.navigation.dispatch;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ 
          routeName: 'Drawer', 
          action: NavigationActions.navigate({ routeName: 'Home', params: { needUpdateData: true } }) 
        })
      ]
    });
    dispatch(resetAction);
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
    } catch (error) {
      // log error
    }
  }

  onSearchPress() {
    if (this.state.showSearch === false && this.props.pdsItems === null) return;
    this.setState({ showSearch: !this.state.showSearch });
  }

  renderHeader() {
    const { navigate } = this.props.navigation;
    const iosBarStyle = Theme === 'dark' ? 'light-content' : 'default';

    if (this.state.showSearch) {
      return (
        <Header 
          searchBar
          iosBarStyle={iosBarStyle}
        >
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background, padding: 4 }} 
          >
            <IC name='magnify' size={25} color={Colors.normal} />
            <Input 
              placeholder="Tìm đơn hàng ..." value={this.state.keyword} 
              onChangeText={(keyword) => { 
                  this.setState({ keyword });
              }}
              autoFocus
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => this.setState({ keyword: '' })}
              style={{ padding: 4 }}
            >
              <IC 
                name="close-circle-outline" size={14} 
              />
            </TouchableOpacity>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 0 }}
              onPress={() => this.setState({ showSearch: !this.state.showSearch, keyword: '' })}
            >
              <Text uppercase={false}>Huỷ</Text>
            </Button>
          </Right>
        </Header>
      );
    }

    return (
      <Header
        iosBarStyle={iosBarStyle}
      >
        <Left style={{ flex: 0.75 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            transparent
            onPress={() => navigate('DrawerOpen')}
          >          
            <Icon name="menu" />
          </Button>
          {/* <LogoButton dispatch={this.props.navigation.dispatch} /> */}
          <Button
            transparent
            onPress={() => this.onSearchPress()}
          >
          <IC name='magnify' size={25} color={Colors.headerNormal} />
          </Button>
        </View>
        </Left>
        
        <Right style={{ flex: 0.25 }}>
          {/* <Button
              transparent
              onPress={() => {
                this.setState({ showScanner: !this.state.showScanner });
              }}
          >          
            <IC name='barcode-scan' size={25} color={Colors.headerNormal} />
          </Button> */}
        </Right>
      </Header>
    );
  }
  renderContent() {
    if (this.state.showSearch) {
      return (
        <SearchList 
          keyword={this.state.keyword} 
          navigation={this.props.navigation} 
          cancelSearch={() => this.setState({ showSearch: !this.state.showSearch, keyword: '' })} 
        />
      );
    }
    const { navigate } = this.props.navigation;
    const { pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete } = this.props.stats;
    return (
      <Content style={{ padding: 10 }}>
      <PDCard
        type='pick'
        onPress={this.onTripListPress.bind(this)}
        upNumber={pickComplete}
        downNumber={pickTotal}
        color='#12cd72'
        delay={false}
      />
      <PDCard
        type='delivery'
        onPress={this.onDeliveryPress.bind(this)}
        upNumber={deliveryComplete}
        downNumber={deliveryTotal}
        color='#ff6e40'
        delay={false}
      />
      <PDCard
        type='return'
        onPress={this.onReturnPress.bind(this)}
        upNumber={returnComplete}
        downNumber={returnTotal}
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
      <TouchableOpacity
        onPress={() => navigate('AddOrder')}
      >
        <Card>
          <CardItem style={{ backgroundColor: Colors.row }}>
            <View style={HomeStyles.cardItemLeft}>
              <View>
                <Text style={{ fontWeight: 'bold', color: Colors.theme }}>
                  Thêm đơn hàng lấy
                </Text>
              </View>
            </View>
            <View style={HomeStyles.cardItemRight}>
              <IC name='plus' size={30} /><IC name='plus' size={30} /><IC name='plus' size={30} />
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
      {this.state.showScanner ?
          <BarcodeReader 
            onBarCodeRead={({data, bounds}) => {
              //this.setState({ showScanner: false });
            }}
          />
          : null }
    </Content>
    );
  }
  renderFooter() {
    if (this.state.showSearch) return null;
    return (
      <AppFooter navigation={this.props.navigation} />
    );
  }
  render() {
    return (
        <Container style={{ backgroundColor: Colors.background }}>
          <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFooter()}
          
          <LoadingSpinner loading={this.props.loading} />
          
        </Container>
        
      
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, error, pdsItems } = state.pd;
  const { loaded } = state.other;
  const { user } = state.auth;
  
  const stats = getNumbers(state); //pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete
  return { loading, loaded, error, user, stats, pdsItems };
};

export default connect(mapStateToProps, { pdListFetch, setLoaded })(HomeScreen);
