import _ from 'lodash';
import React, { Component } from 'react';
import { SectionList, View, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Title, Text,
  Header, Item, Input
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import ICO from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import accounting from 'accounting';
import { NavigationActions } from 'react-navigation';
import AppFooter from '../components/AppFooter';
import LogoButton from '../components/LogoButton';
import Utils from '../libs/Utils';
import { get3Type, getNumbers } from '../selectors';
import StatusText from '../components/StatusText';
import DataEmptyCheck from '../components/DataEmptyCheck';
import { Styles, DeliverGroupStyles, Colors } from '../Styles';

class TripListScreen extends Component {
  state = { done: false, showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  shouldComponentUpdate({ returnOrderComplete }, nextState) {
    if (returnOrderComplete === this.props.returnOrderComplete
      && JSON.stringify(nextState) === JSON.stringify(this.state)) {
      return false;
    } 
    return true;
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  onTripPressOnce = _.debounce(this.onTripPress, 300, { leading: true, trailing: false });

  onTripPress(trip) {
    this.props.navigation.navigate('ReturnGroupDetail', { pickGroup: trip });
  }

  goBack() {
    this.props.navigation.goBack();
    // const dispatch = this.props.navigation.dispatch;
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ 
    //       routeName: 'Drawer', 
    //       action: NavigationActions.navigate({ routeName: 'Home' }) 
    //     })
    //   ]
    // });
    // dispatch(resetAction);
  }

  renderHeader() {
    const { navigate } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Lọc tên shop ..." value={this.state.keyword} 
              onChangeText={(text) => { 
                  this.setState({ keyword: text });
              }}
              autoFocus
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => this.setState({ keyword: '' })}
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
            onPress={() => this.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          <LogoButton dispatch={this.props.navigation.dispatch} />
          </View>
          
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>Trả</Title>
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
            onPress={() => this.setState({ done: !this.state.done, activeTrip: null, activeTripShow: true })}
          >
            <IC name="playlist-check" size={25} color={this.state.done ? Colors.headerActive : Colors.headerNormal} />
          </Button>
          {/* <Button
            transparent
            onPress={() => navigate('DeliveryGroupCreate')}
          >
            <IC name="group" size={22} color={Colors.headerActive} />
          </Button> */}
        </Right>
      </Header>
    );
  }
  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  
  checkKeywork({ clientName, senderName, senderAddress }) {
    const keyword = this.state.keyword.toUpperCase();
    return this.state.keyword === '' 
      || (clientName && clientName.toUpperCase().includes(keyword))
      || senderName.toUpperCase().includes(keyword)
      || senderAddress.toUpperCase().includes(keyword);
  }

  checkTripDone(trip) {
    const ordersNum = trip.ShopOrders.length;
    const completedNum = trip.ShopOrders.filter(o => o.done).length;
    return (ordersNum === completedNum);
  }
  renderNullData() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Right />
        </Header>
        <Content style={{ padding: 16 }}>
          <Body><Text>Không có dữ liệu</Text></Body>
        </Content>
      </Container>
    );
  }
  goToReturnGroup(returnGroup) {
    if (returnGroup) {
      this.props.navigation.navigate('PickGroupDetail', { pickGroup: returnGroup });
    }
  }
  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  
  render() {
    console.log('ReturnListScreen render');
    const { ReturnItems } = this.props;
    if (!ReturnItems) return this.renderNullData();

    const items = ReturnItems.filter(trip => this.state.done === this.checkTripDone(trip) && this.checkKeywork(trip));
    const datas = _.groupBy(items, 'clientId');
    let first = true;
    const sections = _.map(datas, (item) => {
      const clientId = item[0].clientId;
      const activeSection = first && this.state[clientId] === undefined ? true : this.state[clientId];
      first = false;
      return { data: item, title: item[0].clientName + ' (' + item.length + ')', clientId, activeSection };
    });
    
    const emptyMessage = this.state.done ? 'Chưa có chuyến hoàn tất' : 'Tất cả chuyến đã hoàn tất';
    
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <Content>
          <DataEmptyCheck
            data={items}
            message={emptyMessage}
          >
            <SectionList
              renderItem={({ item, index, section }) => {
                if (!section.activeSection) return null;
                const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
                const pickGroup = item;
                const { senderAddress, senderName, senderPhone, estimateTotalServiceCost } = pickGroup;
                const ordersNum = pickGroup.ShopOrders.length;
                const completedNum = pickGroup.ShopOrders.filter(o => o.done).length;
                return (
                  <View style={DeliverGroupStyles.content}>
                  <TouchableOpacity
                    onPress={this.onTripPressOnce.bind(this, pickGroup)}
                  >
                    <View style={wrapperStyle}>
                        <View style={[Styles.itemStyle, { justifyContent: 'space-between' }]}>
                          <Text 
                            style={[Styles.bigTextStyle, Styles.weakColorStyle]}
                            numberOfLines={1}
                          >
                            {senderName}
                          </Text>
                          {this.renderCheckedIcon(ordersNum, completedNum)}
                        </View>
                        <View style={styles.rowStyle}>
                          <Text
                            style={[Styles.weakColorStyle]}
                          >
                            {senderAddress}
                          </Text>
                        </View>
                        
                        <View style={[Styles.item2Style, { paddingTop: 5 }]}>
                          <Text style={[Styles.weakColorStyle]}>
                            Đơn hàng: {completedNum}/{ordersNum}
                          </Text>
                          <Text style={[Styles.normalColorStyle]}>
                          {accounting.formatNumber(estimateTotalServiceCost)} đ
                          </Text>
                        </View>
                        <View style={[Styles.item2Style]}>
                          <View></View>
                          <TouchableOpacity
                            onPress={() => Utils.phoneCall(senderPhone, true)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                          >
                            <ICO name='ios-call-outline' size={25} color='#006FFF' />
                            <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600', marginLeft: 8 }}>SHOP</Text>
                          </TouchableOpacity>
                          
                        </View>
                      </View>
                  </TouchableOpacity>
                  </View>
                );
              }}
              renderSectionHeader={({ section }) => {
                let active = false;
                if (section.activeSection) active = true;
                const iconName = active ? 'minus-box-outline' : 'plus-box-outline';
                return (
                  <TouchableOpacity 
                    style={DeliverGroupStyles.sectionHeader}
                    onPress={() => {
                      const key = section.clientId;
                      this.setState({ [key]: !active });
                    }}
                  >
                    <IC name={iconName} size={20} color='#808080' />
                    <Text style={DeliverGroupStyles.headerText}>{section.title}</Text>
                  </TouchableOpacity>
                );
              }}
              sections={sections}
            /> 
          </DataEmptyCheck>
        </Content>
        <AppFooter navigation={this.props.navigation} />      
      </Container>
    );
  }

}

const styles = {
  rowStyle: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2
  }
};


const mapStateToProps = (state) => {
  const { ReturnItems } = get3Type(state);
  const stats = getNumbers(state);
  const { returnOrderComplete } = stats;
  return { ReturnItems, returnOrderComplete };
};

export default connect(mapStateToProps, {})(TripListScreen);
