import _ from 'lodash';
import React, { Component } from 'react';
import { SectionList, View, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Title, Text,
  Header, Item, Input
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import accounting from 'accounting';
import { NavigationActions } from 'react-navigation';
import AppFooter from '../components/AppFooter';
import LogoButton from '../components/LogoButton';
import Utils from '../libs/Utils';
import { get3Type } from '../selectors';
import { navigateOnce } from '../libs/Common';
import StatusText from '../components/StatusText';
import DataEmptyCheck from '../components/DataEmptyCheck';
import { Styles, DeliverGroupStyles, Colors } from '../Styles';

class TripListScreen extends Component {
  state = { done: false, showSearch: false, keyword: '', mode: false };
  componentWillMount() {
    console.log('here');
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  onTripPressOnce = _.debounce(this.onTripPress, 300, { leading: true, trailing: false });
  onTripPress(trip) {
    this.props.navigation.navigate('PickGroupDetail', { pickGroup: trip });
  }

  goBack() {
    const dispatch = this.props.navigation.dispatch;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ 
          routeName: 'Drawer', 
          action: NavigationActions.navigate({ routeName: 'Home' }) 
        })
      ]
    });
    dispatch(resetAction);
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
          <Title>Lấy</Title>
        </Body>
        <Right style={Styles.rightStyle}>
          <Button
            transparent
            onPress={() => this.setState({ showSearch: !this.state.showSearch })}
          >
            <Icon name="search" />
          </Button>
          { this.state.mode === false ?
          <Button
            transparent
            onPress={() => this.setState({ done: !this.state.done })}
          >
            <IC name="playlist-check" size={25} color={this.state.done ? Colors.headerActive : Colors.headerNormal} />
          </Button>
          : null}
          { this.state.mode ?
          <Button 
            transparent
            onPress={() => navigate('GroupPick')}
          >
            <IC name="group" size={22} color={Colors.headerNormal} />
          </Button>
          : null}
          <Button 
            transparent
            onPress={() => this.setState({ mode: !this.state.mode })}
          >
            <IC name="apple-keyboard-option" size={22} color={Colors.headerNormal} />
          </Button>
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
  
  checkKeywork({ ClientName, ContactName, Address }) {
    const keyword = this.state.keyword.toUpperCase();
    return this.state.keyword === '' 
      || ClientName.toUpperCase().includes(keyword)
      || ContactName.toUpperCase().includes(keyword)
      || Address.toUpperCase().includes(keyword);
  }

  checkTripDone(trip) {
    const ordersNum = trip.ShopOrders.length;
    const completedNum = trip.ShopOrders.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
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
      navigateOnce(this, 'ReturnGroupDetail', { pickGroup: returnGroup });
    }
  }
  renderCheckedIcon(orderNum, completedNum) {
    if (orderNum === completedNum) {
      return <IC name='check-circle-outline' size={25} color='green' />;
    }
    return null;
  }
  renderHasReturnWarning(pickGroup) {
    if (pickGroup.PickDeliveryType != '1') return null;
    const returnGroup = Utils.getReturnGroupFromPG(this.props.ReturnItems, pickGroup);
    if (!returnGroup) return null;
    return (
      <Button
        warning
        small
        transparent
        style={{ paddingLeft: 0 }}
        onPress={() => this.goToReturnGroup(returnGroup)}
      >
        <Text style={{ color: '#F3BD71', fontSize: 13, fontWeight: '600' }}>ĐƠN TRẢ</Text>
        <IC name='arrow-right' size={20} />
      </Button>
    );
  }

  groupData() {
    const { PickItems } = this.props;
    if (!PickItems) return this.renderNullData();

    const key = this.state.mode ? 'shopGroupName' : 'ClientID';
    let items = null;
    let datas = null;
    
    if (this.state.mode) {
      items = PickItems.filter(trip => this.checkKeywork(trip));
    } else {
      items = PickItems.filter(trip => this.state.done === trip.done && this.checkKeywork(trip));
    }
    
    datas = _.groupBy(items, key);
    let first = true;
    const sections = _.map(datas, (item) => {
      const ClientID = item[0][key];
      const title = `${this.state.mode ? item[0].shopGroupName : item[0].ClientName} (${item.length})`;
      const activeSection = first && this.state[ClientID] === undefined ? true : this.state[ClientID];
      const position = item[0].position;
      first = false;
      return { data: item, title, ClientID, activeSection, position };
    });
    if (this.state.mode) {
      sections.sort((a, b) => a.position - b.position);
    }
    return sections;
  }

  render() {
    
    const emptyMessage = this.state.done ? 'Chưa có chuyến hoàn tất' : 'Tất cả chuyến đã hoàn tất';
    const sections = this.groupData();

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        <Content>
          <DataEmptyCheck
            data={sections}
            message={emptyMessage}
          >
            <SectionList
              renderItem={({ item, index, section }) => {
                if (!section.activeSection) return null;
                const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
                const pickGroup = item;
                const { Address, ContactName, ContactPhone, TotalServiceCost } = pickGroup;
                const ordersNum = pickGroup.ShopOrders.length;
                const completedNum = pickGroup.ShopOrders.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
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
                            {ContactName}
                          </Text>
                          {this.renderCheckedIcon(ordersNum, completedNum)}
                        </View>
                        <View style={styles.rowStyle}>
                          <Text
                            style={[Styles.weakColorStyle]}
                          >
                            {Address}
                          </Text>
                        </View>
                        
                        <View style={[Styles.item2Style, { paddingTop: 5 }]}>
                          <Text style={[Styles.weakColorStyle]}>
                            Đơn hàng: {completedNum}/{ordersNum}
                          </Text>
                          <Text style={[Styles.normalColorStyle]}>
                          {accounting.formatNumber(TotalServiceCost)} đ
                          </Text>
                        </View>
                        <View style={[Styles.item2Style]}>
                          <View>
                            {this.renderHasReturnWarning(pickGroup)}
                          </View>
                          <Button
                            small
                            transparent
                            onPress={() => Utils.phoneCall(ContactPhone, true)}
                            style={{ paddingRight: 0 }}
                          >
                            <Icon name='call' />
                            <Text style={{ color: '#00b0ff', fontSize: 13, fontWeight: '600' }}>SHOP</Text>
                          </Button>
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
                      const key = section.ClientID;
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
  const { PickItems, ReturnItems } = get3Type(state);
  return { PickItems, ReturnItems };
};

export default connect(mapStateToProps, {})(TripListScreen);
