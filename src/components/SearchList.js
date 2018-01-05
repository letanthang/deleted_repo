import React, { Component } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Text,
  Header
} from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
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
    const { OrderID, ClientHubID, ClientID, PickDeliveryType } = order;
    const navigate = this.props.navigation.navigate;
    switch (PickDeliveryType) {
      case 1:
        navigate('PickOrder', { OrderID, order, ClientID, ClientHubID });
        break;
      case 2:
        navigate('DeliveryOrder', { OrderID });
        break;
      case 3:
        navigate('ReturnOrder', { OrderID, order, ClientID, ClientHubID });
        break;
      default:
        break;
    }
    this.props.cancelSearch();
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

  
  renderStatusText(order) {
    const { CurrentStatus, PickDeliveryType } = order;
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  
  checkKeywork({ OrderCode, ExternalCode, ClientName, ContactName, RecipientName, Address }) {
    const keyword = this.props.keyword.toUpperCase();
    return !this.props.keyword || this.props.keyword === '' 
    || OrderCode.toUpperCase().includes(keyword)
    || (ExternalCode && ExternalCode.toUpperCase().includes(keyword))
    || ClientName.toUpperCase().includes(keyword)
    || ContactName.toUpperCase().includes(keyword)
    || RecipientName.toUpperCase().includes(keyword)
    || Address.toUpperCase().includes(keyword);
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
    const { PDSItems } = this.props;
    let i = 0;
    const limit = 5;
    const items = PDSItems.filter(o => {
      if (i < limit && this.checkKeywork(o)) {
        i++;
        return true;
      }
      return false;
    });
    if (!PDSItems || !items) return this.renderNullData();

    return (
        <Content style={{ backgroundColor: Colors.row }}>
          <DataEmptyCheck
            data={items}
            message="Không có dữ liệu"
          >
            <FlatList
              data={items}
              renderItem={({ item }) =>
              <TouchableOpacity
              onPress={this.onDeliveryOrderPress.bind(this, item)}
              >
                <View style={Styles.rowStyle}>
                  <View style={[DeliverGroupStyles.col1Style]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 150 }}>
                      <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
                        {item.OrderCode}
                      </Text>
                      {this.renderStatusText(item)}
                    </View>
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                      {item.ClientName} - {item.ContactName} - {item.RecipientName} 
                    </Text>
                    <Text style={[Styles.smallTextStyle, Styles.weakColorStyle]}>
                      {item.Address}
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

const mapStateToProps = ({ pd }) => {
  const { PDSItems } = pd;
  return { PDSItems };
};

export default connect(mapStateToProps, {})(OrderListScreen);
