import _ from 'lodash';
import React, { Component } from 'react';
import { SectionList, View, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Title, Text, Card,
  Header
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import accounting from 'accounting';
import * as Communications from 'react-native-communications';
import { NavigationActions } from 'react-navigation';
import AppFooter from '../components/AppFooter';
import Utils from '../libs/Utils';
import StatusText from '../components/StatusText';
import DataEmptyCheck from '../components/DataEmptyCheck';
import { Styles, DeliverGroupStyles, Colors } from '../Styles';

class TripListScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

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
    
    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => this.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={{ flex: 3 }}>
          <Title>Lấy</Title>
        </Body>
        <Right>
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
    const { CurrentStatus, PickDeliveryType } = order;
    const DisplayStatus = Utils.getDisplayStatus(CurrentStatus, PickDeliveryType);
    const StatusColor = Utils.getDisplayStatusColor(CurrentStatus, PickDeliveryType);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  
  checkKeywork({ OrderCode }) {
    return this.state.keyword === '' || OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase());
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
      return <Icon name='check-circle-o' size={25} color='green' />;
    }
    return null;
  }
  renderHasReturnWarning(pickGroup) {
    console.log('renderHasReturnWarning called!');
    if (pickGroup.PickDeliveryType != '1') return null;
    const returnGroup = Utils.getReturnGroupFromPG(this.props.pds, pickGroup);
    console.log(returnGroup);
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
        <IC name='arrow-dropright' />
      </Button>
    );
  }
  render() {
    const { pds } = this.props;
    if (!pds || !pds.PickItems) return this.renderNullData();

    const items = pds.PickItems;
    const datas = _.groupBy(items, 'ClientID');
    const sections = _.map(datas, (item) => {
      return { data: item, title: item[0].ClientName + ' (' + item.length + ')' };
    });
    console.log('TripListScreen: render, sections =');
    console.log(sections);
    
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        {/* <FlatList
          data={pds.PDSItems}
          renderItem={({ item }) => <View><Text>{item.OrderCode}</Text></View>}
        /> */}
        <DataEmptyCheck
          data={items}
          message="Không có dữ liệu"
        >
          <SectionList
            renderItem={({ item, index }) => {
              const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
               
              const pickGroup = item;
              console.log('pickGroup =');
              console.log(pickGroup);
              const { Address, ClientName, DisplayOrder, ContactName, ContactPhone } = pickGroup;
              
              let TotalServiceCost = 0; 
              pickGroup.PickReturnSOs.forEach(order => { TotalServiceCost += order.CODAmount; });
              const ordersNum = pickGroup.PickReturnSOs.length;
              const completedNum = pickGroup.PickReturnSOs.filter(o => Utils.checkPickComplete(o.CurrentStatus)).length;
              return (
                <View style={DeliverGroupStyles.content}>
                <TouchableOpacity
                  onPress={this.onTripPress.bind(this, pickGroup)}
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
                          onPress={() => Communications.phonecall(ContactPhone, true)}
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
            renderSectionHeader={({ section }) => (
              <View style={DeliverGroupStyles.sectionHeader}>
                <Text style={DeliverGroupStyles.headerText}>{section.title}</Text>
              </View>
            )}
            sections={sections}
          /> 
        </DataEmptyCheck>
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


const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(TripListScreen);
