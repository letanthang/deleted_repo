import React, { Component } from 'react';
import { View, Image, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { 
  Container, Header, Left,
  Right, Content, Text, Button, Icon,
  Card, CardItem, Input, Item, ActionSheet
} from 'native-base';
import moment from 'moment';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import SearchList from '../../components/SearchList';
import { pdListFetch, setLoaded, stopLoading } from '../../actions';
import { getNumbers } from '../../selectors';
import PDCard from './PDCard';
// import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import { HomeStyles, Colors, Theme } from '../../Styles';
import { navigateOnce } from '../../libs/Common';
import AppFooter from '../../components/AppFooter';
import Utils from '../../libs/Utils';
// import MyMenu from '../components/MyMenu';
// import LogoButton from '../components/LogoButton';
import BarcodeReader from '../../components/BarcodeReader';

const efficiencyIcon = require('../../../resources/ic_summary.png');

class HomeScreen extends Component {
  state = { showSearch: false, keyword: '', showScanner: false }
  componentWillMount() {
    const { pdsItems, loading } = this.props;
    console.log(this.props.stats);
    if (loading) {
      //this.props.stopLoading();
    }
    if (!pdsItems) {
      this.reloadData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error && nextProps.error !== '') {
      Utils.showToast(nextProps.error, 'warning');
    }
  }
  
  shouldComponentUpdate({ user, loading, loaded, stats, progress }, nextState) {
    if (user === null) return false;
    if (loading === this.props.loading && loaded === this.props.loaded && progress === this.props.progress
      && JSON.stringify(stats) === JSON.stringify(this.props.stats)
      && JSON.stringify(nextState) === JSON.stringify(this.state)) {
      return false;
    }
    return true;
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    //console.log('HomeScreen unmount!');
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

  onSearchPress() {
    if (this.state.showSearch === false && this.props.pdsItems === null) return;
    this.setState({ showSearch: !this.state.showSearch });
  }
  reloadData() {
    this.props.pdListFetch({ all: false, timeServer: this.props.timeServer });
        // .then(result => {
        //   if (result) {
        //     this.props.setLoaded(); 
        //     Utils.showToast('Cập nhật chuyến đi thành công.', 'success');
        //   }
        // });
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
            style={{ paddingRight: 12 }}
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
    const marginLeft = Platform.OS === 'ios' ? 0 : 10;
    const marginRight = Platform.OS === 'ios' ? 0 : -10;
    const paddingTop = Platform.OS === 'ios' ? 4 : 8;
    const { pdsItems, timeServer } = this.props;
    const showTime = timeServer ? moment(timeServer).format('LT DD/MM ') : '';
    const ordersNum = pdsItems ? Object.keys(pdsItems).length : 0;

    // const progressTitle = `Đã tải ${this.props.progress}% Vui lòng chờ!`;
    return (
      <Content 
        style={{ padding: 10, flex: 1, marginLeft, marginRight, position: 'relative' }}
        refreshControl={
          <RefreshControl
            refreshing={this.props.loading}
            onRefresh={this.reloadData.bind(this)}
            // title={progressTitle}
          />
        }
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 4, paddingTop }} >
          <View style={{ }}>
            <Text style={{ fontWeight: 'bold' }}>
              Tổng số đơn {ordersNum}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontWeight: '400', fontSize: 16 }}>{showTime} </Text>
            <IC name='update' size={16} />
          </View>
        </View>
        
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
        
        <TouchableOpacity
          onPress={() => navigate('BluetoothExample')}
        >
          <Card>
            <CardItem style={{ backgroundColor: Colors.row }}>
              <View style={HomeStyles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: Colors.theme }}>
                    In đơn hàng
                  </Text>
                </View>
              </View>
              <View style={HomeStyles.cardItemRight}>
                <IC name='printer' size={29} /><IC name='printer' size={29} /><IC name='printer' size={29} />
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('OrderLabel', { orderCode: '23ABCN9' })}
        >
          <Card>
            <CardItem style={{ backgroundColor: Colors.row }}>
              <View style={HomeStyles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: Colors.theme }}>
                    Xuất label
                  </Text>
                </View>
              </View>
              <View style={HomeStyles.cardItemRight}>
                <IC name='drawing-box' size={28} /><IC name='drawing-box' size={28} /><IC name='drawing-box' size={28} />
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
    console.log('HomeScreen render');
    return (
        <Container style={{ backgroundColor: Colors.background, position: 'relative' }}>
          <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
          {this.renderHeader()}
          <ProgressBar
            progress={this.props.progress}
            loading={this.props.loading}
          />
          {this.renderContent()}
          {this.renderFooter()}
          {/* <LoadingSpinner loading={this.props.loading} /> */}
        </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, pdsItems, timeServer } = state.pd;
  const { loaded, progress, loading } = state.other;
  const { user } = state.auth;
  
  const stats = getNumbers(state); //pickTotal, pickComplete, deliveryTotal, deliveryComplete, returnTotal, returnComplete
  return { loading, loaded, error, user, stats, pdsItems, progress, timeServer };
};

export default connect(mapStateToProps, { pdListFetch, setLoaded, stopLoading })(HomeScreen);
