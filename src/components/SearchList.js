import React, { Component } from 'react';
import _ from 'lodash';
import { FlatList, View, TouchableOpacity, Keyboard } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Text,
  Header
} from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import StatusText from '../components/StatusText';
import DataEmptyCheck from '../components/DataEmptyCheck';
import { Styles, HomeSearchStyles, Colors } from '../Styles';

class OrderListScreen extends Component {
  state = { showSearch: false, keyword: '' };
  componentWillMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  onOrderPress(order) {
    const { orderCode, senderHubId, clientId, type } = order;
    const navigate = this.props.navigation.navigate;
    Keyboard.dismiss();
    switch (type) {
      case 'PICK':
        navigate('PickOrder', { orderCode, type, order, clientId, senderHubId, refresh: this.props.refresh });
        break;
      case 'DELIVER':
        navigate('DeliveryOrder', { orderCode, refresh: this.props.refresh });
        break;
      case 'RETURN':
        navigate('ReturnOrder', { orderCode, type, order, clientId, senderHubId, refresh: this.props.refresh });
        break;
      default:
        break;
    }
    //this.props.cancelSearch();
  }

  onShopPressOnce = _.debounce(this.onShopPress, 300, { leading: true, trailing: false });


  onShopPress(order) {
    const { keyword } = this.props;
    const { orderCode, senderHubId, clientId, type } = order;
    const navigate = this.props.navigation.navigate;
    Keyboard.dismiss();
    switch (type) {
      case 'PICK':
        this.props.navigation.navigate('PickGroupDetail', { type, senderHubId, keyword });
        break;
      case 'DELIVER':
        break;
      case 'RETURN':
        this.props.navigation.navigate('ReturnGroupDetail', { type, senderHubId, keyword });
        break;
      case 'TRANSIT_IN':
        this.props.navigation.navigate('CvsDetail', { type, senderHubId, keyword });
        break;
      default:
        break;
    }
    //this.props.cancelSearch();
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

  
  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  
  checkKeywork({ orderCode, externalCode, clientName, senderName, receiverName, address, senderPhone, receiverPhone }) {
    const keyword = this.props.keyword.toUpperCase();
    return !this.props.keyword || this.props.keyword === '' 
    || orderCode.toUpperCase().includes(keyword)
    || (externalCode && externalCode.toUpperCase().includes(keyword))
    || (clientName && clientName.toUpperCase().includes(keyword))
    || (senderPhone && senderPhone.toUpperCase().includes(keyword))
    || (receiverPhone && receiverPhone.toUpperCase().includes(keyword))
    || senderName.toUpperCase().includes(keyword)
    || receiverName.toUpperCase().includes(keyword)
    || address.toUpperCase().includes(keyword);
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
    const { db } = this.props;
    let i = 0;
    const limit = 5;
    const items = _.filter(db, o => {
      if (i < limit && this.checkKeywork(o)) {
        i++;
        return true;
      }
      return false;
    });
    if (!db || !items) return this.renderNullData();

    return (
        <Content 
          style={{ backgroundColor: Colors.row }}
          keyboardShouldPersistTaps='handled'
        >
          <DataEmptyCheck
            data={items}
            message="Không có dữ liệu"
          >
            <FlatList
              keyboardShouldPersistTaps='handled'
              data={items}
              keyExtractor={(item, index) =>  item.orderCode + index}
              renderItem={({ item }) =>
              <View>
                <View style={Styles.rowStyle}>
                  <TouchableOpacity 
                    style={[HomeSearchStyles.col1Style]}
                    onPress={this.onOrderPress.bind(this, item)}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40 }}>
                      <Text style={[HomeSearchStyles.bigTextStyle, Styles.normalColorStyle]}>
                        {item.orderCode}
                      </Text>
                      {this.renderStatusText(item)}
                    </View>
                    
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={HomeSearchStyles.col2Style}
                  >
                    {item.type !== 'DELIVER' ?
                    <TouchableOpacity
                      onPress={this.onShopPressOnce.bind(this, item)}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon name="arrow-forward" size={20} color='#8F8E93' />
                        <Text style={[HomeSearchStyles.bigTextStyle, { color: '#00b0ff' }]}>
                          Shop: {item.senderName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    : null}  
                  </View>
                </View>
              </View> 
              }
            /> 
          </DataEmptyCheck>
        </Content>
        
    );
  }

}

const mapStateToProps = (state) => {
  const db = getOrders(state);
  return { db };
};

export default connect(mapStateToProps, {})(OrderListScreen);
