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
    const { code, senderHubId, clientId, type } = order;
    const navigate = this.props.navigation.navigate;
    Keyboard.dismiss();
    switch (type) {
      case 'PICK':
        navigate('PickOrder', { code, order, clientId, senderHubId, refresh: this.props.refresh });
        break;
      case 'DELIVER':
        navigate('DeliveryOrder', { code, refresh: this.props.refresh });
        break;
      case 'RETURN':
        navigate('ReturnOrder', { code, order, clientId, senderHubId, refresh: this.props.refresh });
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
  
  checkKeywork({ code, externalCode, clientName, senderName, receiverName, address, senderPhone, receiverPhone }) {
    const keyword = this.props.keyword.toUpperCase();
    return !this.props.keyword || this.props.keyword === '' 
    || code.toUpperCase().includes(keyword)
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
              <TouchableOpacity
              onPress={this.onDeliveryOrderPress.bind(this, item)}
              >
                <View style={Styles.rowStyle}>
                  <View style={[DeliverGroupStyles.col1Style]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 150 }}>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                        {item.orderCode}
                      </Text>
                      {this.renderStatusText(item)}
                    </View>
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                      {item.clientName} - {item.senderName} - {item.receiverName} 
                    </Text>
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                      {item.address}
                    </Text>
                  </View>
                  <View
                    style={DeliverGroupStyles.col2Style}
                  >
                    <Icon name="arrow-forward" size={20} color='#8F8E93' />
                  </View>
                </View>
              </TouchableOpacity> 
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
