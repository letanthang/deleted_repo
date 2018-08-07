import _ from 'lodash';
import React, { Component } from 'react';
import { SectionList, FlatList, View, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Title, Text,
  Header, Input, Item, Badge 
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AppFooter from '../components/AppFooter';
import Utils from '../libs/Utils';
import StatusText from '../components/StatusText';
import DataEmptyCheck from '../components/DataEmptyCheck';
import { Styles, DeliverGroupStyles, Colors } from '../Styles';

class OrderListScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  onDeliveryOrderPress(order) {
    const { orderCode, senderHubId, clientId, type } = order;
    const navigate = this.props.navigation.navigate;
    switch (type) {
      case 1:
        navigate('PickOrder', { orderCode, order, clientId, senderHubId });
        break;
      case 2:
        navigate('DeliveryOrder', { orderCode });
        break;
      case 3:
        navigate('ReturnOrder', { orderCode, order, clientId, senderHubId });
        break;
      default:
        break;
    }
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
              placeholder="Tìm đơn hàng ..." value={this.state.keyword} 
              onChangeText={(keyword) => { 
                if (keyword !== undefined) {
                  this.setState({ keyword: keyword.trim() });
                }
              }}
            />
            <Button
              transparent
              small
              onPress={() => this.setState({ keyword: '' })}
            >
              <IconFA 
                name="times-circle" size={14} 
              />
            </Button>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 8 }}
              onPress={() => this.setState({ showSearch: !this.state.showSearch })}
            >
              <Text>Huỷ</Text>
            </Button>
          </Right>
        </Header>
        );
    } 
    
    return (
      <Header>
        <Left style={Styles.leftStyle}>
          <Button
            transparent
            onPress={() => this.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>Tất cả: lấy|giao|trả</Title>
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
  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  
  checkKeywork({ orderCode, externalCode }) {
    const keyword = this.state.keyword.toUpperCase();
    return this.state.keyword === '' 
      || orderCode.toUpperCase().includes(keyword)
      || (externalCode && externalCode.toUpperCase().includes(keyword));
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

  render() {
    const { pds } = this.props;
    if (!pds || !pds.pdsItems) return this.renderNullData();

    const items = pds.pdsItems.filter(o => this.checkKeywork(o));
    const datas = _.groupBy(items, 'address');
    const sections = _.map(datas, (item) => {
      return { data: item, title: item[0].address };
    });
    
    return (
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader()}
        {/* <FlatList
          data={pds.pdsItems}
          renderItem={({ item }) => <View><Text>{item.orderCode}</Text></View>}
        /> */}
        <Content>
        <DataEmptyCheck
          data={items}
          message="Không có dữ liệu"
        >
          <SectionList
            renderItem={({ item, index }) => { 
              const { address, orderCode, serviceName, status, TotalCollectedAmount, inTripIndex } = item;
              const wrapperStyle = index == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
              return (
                <View style={DeliverGroupStyles.content}>
                  <TouchableOpacity
                    onPress={this.onDeliveryOrderPress.bind(this, item)}
                  >
                    <View style={wrapperStyle}>
                      <View style={Styles.item2Style}>
                        <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                          {this.getDO(inTripIndex)}{orderCode}
                        </Text>
                        <Badge>
                          <Text>{serviceName}</Text>
                        </Badge>
                      </View>
                      
                      <View style={Styles.itemStyle}>
                        {this.renderStatusText(item)}
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
            keyExtractor={(item, index) => `${item.orderCode}_${item.type}`}
          /> 
        </DataEmptyCheck>
        </Content>
        <AppFooter navigation={this.props.navigation} />
      </Container>
    );
  }
  getDO(inTripIndex) {
    if (inTripIndex) {
      return `[${inTripIndex}] `;
    }
    return '';
  }

}

const mapStateToProps = ({ pd }) => {
  const { pds, deliveryTotal, deliveryComplete } = pd;
  return { pds, deliveryTotal, deliveryComplete };
};

export default connect(mapStateToProps, {})(OrderListScreen);
