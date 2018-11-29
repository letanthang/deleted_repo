import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, TextInput, Platform,Button as RNButton , ScrollView,TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar } from 'react-native-progress';
import { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd } from '../../actions';
import { get3Type } from '../../selectors';
import Utils from '../../libs/Utils';
import { Styles, Colors } from '../../Styles';
import Detail from './Detail';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import LogoButton from '../../components/LogoButton';
import BarcodeReader from '../../components/BarcodeReader';


const ErrorList = ({orderErros})=>{
  // orderErros.push(orderErros[0])
  return (<ScrollView style={Styles.container} >
  <Text selectable={true} style={{paddingLeft:10}}>
    {orderErros.map((order, i) => {
      return (
                <Text><Text style={{ fontWeight: 'bold' }}>{order.orderCode} </Text> {` ${order.message}`} {"\n"}</Text>
      )
    })}
  </Text>
</ScrollView>)
};
class CvsDetailScreen extends Component {
  constructor() {
    super();
    this.state = { showSearch: false, keyword: '', showScan: true };
    this.searchDebounce = _.debounce(this.searchKeyword, 500, { leading: false, trailing: true });
  }
  

  componentWillMount() {
    const { senderHubId, type } = this.props.navigation.state.params;
    this.senderHubId = senderHubId;
    this.type = type;
  }

  componentWillReceiveProps(nextProps) {
    // console.log("CvsDetailScreen >> componentWillReceiveOProps Func >> netx Props ",nextProps);
    const {OrderErrors} = nextProps; 
    if(OrderErrors && OrderErrors.length > 0){
      if(this.props.OrderErrors && this.props.OrderErrors.length > 0 && this.props.OrderErrors.map(order => order.orderCode).join(" ") == OrderErrors.map(order => order.orderCode).join(" ") ){
      }else{
      this.popupDialog.dismiss();
      this.popupDialog.show();
      }
    } 
  }

  componentWillUnmount() {
    this.props.resetPickGroup();
  }

  checkComplete(order) {
    return Utils.checkCompleteForUnsync(order);
  }

  checkRealDone() {
    const completeNum = this.pickGroup.ShopOrders.filter(o => o.done).length;
    return completeNum === this.totalNum;
  }

  updateOrder() {
    const OrderInfos = this.pickGroup.ShopOrders.filter(o => o.willSucceeded !== undefined);
    this.props.updateOrderStatus({ OrderInfos });
  }

  addOrder(senderHubId) {
    // console.log("CvsDetailScreen >> index >> addOrder Func >> ",senderHubId)
    this.props.navigation.navigate('AddOrder', { senderHubId, isCvs:true });
  }

  confirmUpdateOrderOnce = _.debounce(this.confirmUpdateOrder, 400, { leading: true, trailing: false });

  confirmUpdateOrder() {
    // this.props.pdListFetch({})
    //   .then(() => this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId }));
    this.props.navigation.navigate('PickConfirm', { senderHubId: this.senderHubId, type: 'TRANSIT_IN', scanInfo: this.scanInfo });
  }

  hasUnsynced(pickGroup) {
    const found = pickGroup.ShopOrders.find(o => Utils.isCompletedUnsynced(o));
    if (found) return true;
    return false;
  }

  refresh() {
    if (this.myInput) {
      this.myInput.focus();
    }
  }

  searchKeyword(text) {
    this.props.changeKeyword(text);
  }

  onKeywordChange(text) {
    this.setState({ keyword: text });
    this.searchDebounce(text);
  }


  renderHeader(pickGroup) {
    const { goBack, navigate } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <TextInput
              style={{ flex: 1, fontSize: 16 }}
              underlineColorAndroid='transparent'
              placeholder="Tìm đơn hàng ..." value={this.state.keyword} 
              onChangeText={this.onKeywordChange.bind(this)}
              autoFocus
              selectTextOnFocus
              autoCorrect={false}
              ref={input => this.myInput = input}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ keyword: '' });
                this.props.changeKeyword('');
              }}
              style={{ padding: 8 }}
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
              onPress={() => {
                this.setState({ showSearch: !this.state.showSearch, keyword: '' });
                this.props.changeKeyword('');
              }}
            >
              <Text uppercase={false}>Huỷ</Text>
            </Button>
          </Right>
        </Header>
        );
    } 

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
          <Button
            transparent
            onPress={() => this.addOrder(this.senderHubId) }
          >
            <Icon name="add" />
          </Button>
          {Platform.OS === 'android' ?
          <Button
            transparent
            onPress={() => navigate('OrderLabels', { senderHubId: this.senderHubId})}
          >
            <Icon name="print" />
          </Button>
          : null}
        </Right>
      </Header>
    );
  }

  

  render() {
    // console.log('CvsDetailScreen render');
    // console.log("CvsDetailScreen >> index >> render Func >> this",this);
    
    const { addOrderLoading, CvsItems, OrderErrors } = this.props;
    const { width } = Dimensions.get('window');
    const type = this.type;
    const Items = CvsItems;
    const pickGroup = Items.find(trip => trip.senderHubId === this.senderHubId);
    if (pickGroup == null) {
      this.props.navigation.popToTop();
      return null;
    }
    this.pickGroup = pickGroup;
    this.totalNum = this.pickGroup.ShopOrders.length;
    this.doneNum = this.pickGroup.ShopOrders.filter(o => this.checkComplete(o)).length;
    this.scanInfo = this.pickGroup.scanInfo;

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ProgressBar
          progress={this.props.progress}
          loading={this.props.loading}
        />
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <Detail navigation={this.props.navigation} pickGroup={pickGroup} refresh={this.refresh.bind(this)} />
        <LoadingSpinner loading={addOrderLoading} />
        
        
        <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2, height: 13 }}>
          <Bar 
            color='blue'
            unfilledColor='#ccc'
            borderRadius={2}
            progress={this.doneNum / this.totalNum}
            height={9}
            width={width - 4}
            indeterminate={false}
            style={{ marginLeft: 2, marginRight: 2 }}
          />
        </View>
        {!this.checkRealDone() && this.hasUnsynced(pickGroup) ?
        <Footer style={{ backgroundColor: Colors.background, borderTopWidth: 0 }}>
        <FooterTab style={{ backgroundColor: Colors.background }}>
          <TouchableOpacity 
            style={Styles.updateButtonStyle}
            onPress={this.confirmUpdateOrderOnce.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Cập Nhật</Text>
          </TouchableOpacity>
        </FooterTab>
        </Footer>
        : null}

           <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            containerStyle={{ zIndex: 10, elevation: 20 }}
            width={0.94}
            height={364}
            dialogTitle={<DialogTitle title="Thông báo" titleTextStyle={{fontWeight: 'bold',fontSize: 20}} />}
          >
          { OrderErrors ? 
          <ScrollView>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <View style={{ padding: 10 }}>
                <Text>Có <Text style={{ color: 'red', fontSize: 20,fontWeight: 'bold'}}>{OrderErrors.length}</Text> đơn hàng <Text style={{ color: 'red',fontWeight: 'bold'}}>không thể</Text> cập nhập đã lấy</Text>
              </View>
                <ErrorList
                  selectable={true}
                  orderErros={OrderErrors}
                />
            </View>
            </ScrollView> 
            : null}
            <View style={{ padding: 10 }}>
                <Text >Hệ thống đã tự động cập nhập <Text style={{fontWeight: 'bold'}}>Lấy thất bại</Text> các đơn trên.</Text>
              </View>
            <View
                style={{ flexDirection: 'row', borderTopColor: '#E7E8E9', borderTopWidth: 1, marginBottom: 2,alignItems:'center' }}
              >
                <View style={{flex:1, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30,alignItems:'center'}}>
                  <RNButton
                    onPress={() => this.popupDialog.dismiss()}
                    title='Đóng'
                    // color='#057AFF'
                    style={{ flex: 1, margin: 2 }}
                  />
                </View>
              </View>
          </PopupDialog>
      </Container>
      
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("CvsDetailScreen >> mapStateToProps Func >> ")
  const { auth, pd, pickGroup, other} = state;
  const { progress, loading } = other;
  const { sessionToken } = auth;
  const { tripCode, addOrderLoading , OrderErrors} = pd;
  const { OrderInfos, done, keyword } = pickGroup;
  const { PickItems, ReturnItems } = get3Type(state);

  return { OrderErrors , PickItems, ReturnItems, CvsItems: PickItems, sessionToken, tripCode, loading, progress, addOrderLoading, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, resetPickGroup, changeKeyword, changeDone, pdListFetch, getNewOrdersForAdd })(CvsDetailScreen);
