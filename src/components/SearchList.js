import React, { Component } from 'react';
import _ from 'lodash';
import { FlatList, View, TouchableOpacity } from 'react-native';
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
    const { code, clientHubId, clientId, pickDeliveryType } = order;
    const navigate = this.props.navigation.navigate;
    switch (pickDeliveryType) {
      case 1:
        navigate('PickOrder', { code, order, clientId, clientHubId });
        break;
      case 2:
        navigate('DeliveryOrder', { code });
        break;
      case 3:
        navigate('ReturnOrder', { code, order, clientId, clientHubId });
        break;
      default:
        break;
    }
    this.props.cancelSearch();
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
  
  checkKeywork({ code, ExternalCode, clientName, contactName, recipientName, address }) {
    const keyword = this.props.keyword.toUpperCase();
    return !this.props.keyword || this.props.keyword === '' 
    || code.toUpperCase().includes(keyword)
    || (ExternalCode && ExternalCode.toUpperCase().includes(keyword))
    || (clientName && clientName.toUpperCase().includes(keyword))
    || contactName.toUpperCase().includes(keyword)
    || recipientName.toUpperCase().includes(keyword)
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
        <Content style={{ backgroundColor: Colors.row }}>
          <DataEmptyCheck
            data={items}
            message="Không có dữ liệu"
          >
            <FlatList
              data={items}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) =>
              <TouchableOpacity
              onPress={this.onDeliveryOrderPress.bind(this, item)}
              >
                <View style={Styles.rowStyle}>
                  <View style={[DeliverGroupStyles.col1Style]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 150 }}>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                        {item.code}
                      </Text>
                      {this.renderStatusText(item)}
                    </View>
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                      {item.clientName} - {item.contactName} - {item.recipientName} 
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
