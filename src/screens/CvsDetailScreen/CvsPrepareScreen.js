import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, TextInput, Platform } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar } from 'react-native-progress';
import { NavigationActions } from 'react-navigation';
import { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd, startCvsSession } from '../../actions';
import { get3Type } from '../../selectors';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import { scanResponse } from '../../apis/mock';
import Detail from './Detail';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import LogoButton from '../../components/LogoButton';
import BarcodeReader from '../../components/BarcodeReader';

class CvsPrepareScreen extends Component {
  constructor() {
    super();
    this.state = { showScan: false, isSimulator: true };
  }

  componentWillReceiveProps({ CvsItems }) {
    
    
    const { type, senderHubId } = this.props.navigation.state.params;
    const Items = CvsItems;
    const pickGroup = Items.find(trip => trip.senderHubId === senderHubId);
    if (pickGroup == null) {
      return null;
    }
    const totalNum = pickGroup.ShopOrders.length;
    if (totalNum > 0) {
      this.goToDetail();
    }

  }
  
  renderScannerHeader() {
    return (
    <Header style={{ backgroundColor: 'black' }}>
      <Left style={Styles.leftStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          transparent
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name="arrow-back" color='white' />
        </Button>
        <LogoButton dispatch={this.props.navigation.dispatch} />
      </View>
      </Left>
      <Body style={Styles.bodyStyle}>
        <Title style={{ color: 'white' }}>Scanner</Title>
      </Body>
      <Right style={Styles.rightStyle}>
        <Button
          transparent
          onPress={() => this.setState({ showSearch: !this.state.showSearch })}
        >
          <Icon name="search" />
        </Button>
      </Right>
    </Header>
    );
  }

  renderHeader(pickGroup) {
    const { goBack, navigate } = this.props.navigation;

    return (
      <Header>
        <Left style={Styles.leftStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            transparent
            onPress={() => goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <LogoButton dispatch={this.props.navigation.dispatch} />
        </View>
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>{pickGroup.clientName} - {pickGroup.senderName}</Title>
        </Body>
        <Right style={Styles.rightStyle}>
          <Button
            transparent
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Icon name="search" />
          </Button>
        </Right>
      </Header>
    );
  }

  onBarCodeReadOnce = _.debounce(this.onBarCodeRead, 300, { leading: true, trailing: false });

  goToDetail() {
    
    const dispatch = this.props.navigation.dispatch;
    const { type, senderHubId, pointId } = this.props.navigation.state.params;

    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ 
          routeName: 'CvsDetail', 
          params: { type, senderHubId, pointId },
          // action: NavigationActions.navigate({ routeName: 'Home' }) 
        })
      ]
    });
    dispatch(resetAction);
  }

  onBarCodeRead(data) {
    console.log(data)
    if (data !== this.state.data) {
      this.setState(data);
      const { pointId } = this.props.navigation.state.params;
      const { tripCode } = this.props;
      this.props.startCvsSession(data, pointId, tripCode);
    }    
  }


  renderScanner() {
    return (
      <Container style={{ backgroundColor: 'black' }}>
        {this.renderScannerHeader()}
        <BarcodeReader onBarCodeRead={this.onBarCodeReadOnce.bind(this, data)}  />
      </Container>
    );
  }

  onScanTapped(senderHubId, type) {
    if (this.state.isSimulator) {
      this.onBarCodeRead(scanResponse);
    } else {
      navigate('CvsDetail', { type, senderHubId })
    }
    
  }

  render() {
    console.log('CvsPrepareScreen render');

    if (this.state.showScan) {
      return this.renderScanner();
    }
    const { navigate, popToTop } = this.props.navigation;
    const { senderHubId, type } = this.props.navigation.state.params;
    const { addOrderLoading, CvsItems } = this.props;
    const { width } = Dimensions.get('window');
  
    const Items = CvsItems;
    const pickGroup = Items.find(trip => trip.senderHubId === senderHubId);
    if (pickGroup == null) {
      popToTop();
      return null;
    }
    
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <View style={{ alignItems: 'center', marginTop: 50, marginBottom: 30 }}>
          <IC name='qrcode' size={120} color='grey' />
        </View>
        <TouchableOpacity
          style={styles.buttonStyle1}
          onPress={this.onScanTapped.bind(this, senderHubId, type)}
        >
          <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Quét mã QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle2}
          onPress={() => {}}
        >
          <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>Từ chối lấy</Text>
        </TouchableOpacity>
      </Container>
      
    );
  }
}

const styles = {
  buttonStyle1: {
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonStyle2: {
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderColor: '#2ECC71',
    borderWidth: 1,
    borderRadius: 5,
  },
};

const mapStateToProps = (state) => {
  const { auth, pd, pickGroup, other } = state;
  const { progress, loading } = other;
  const { sessionToken } = auth;
  const { tripCode, addOrderLoading } = pd;
  const { OrderInfos, done, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems, CvsItems: PickItems, sessionToken, tripCode, loading, progress, addOrderLoading, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd, startCvsSession })(CvsPrepareScreen);
