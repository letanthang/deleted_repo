import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Body, Left, Right,
  Button, Icon, Tabs, Tab, Footer, FooterTab,
  Title, Input, Item, Text, ActionSheet
} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateOrderStatus, resetReturnGroup, changeDone1, changeKeyword1 } from '../actions';
// import Utils from './libs/Utils';
import { Styles, Colors } from '../Styles';
import ReturnGroupDetail from '../components/pickReturn/ReturnGroupDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import LogoButton from '../components/LogoButton';

class PickGroupDetailScreen extends Component {
  state = { showSearch: false };

  componentWillMount() {
    this.pickGroup = this.props.navigation.state.params.pickGroup;
    this.ClientHubID = this.pickGroup.ClientHubID;
    this.PickDeliveryType = this.pickGroup.PickDeliveryType;
  }

  componentWillReceiveProps(nextProps) {
  }
  
  componentWillUnmount() {
    this.props.resetReturnGroup();
  }

  updateOrder() {
    const OrderInfos = _.filter(this.props.OrderInfos, item => item !== undefined);
    this.props.updateOrderStatus({ OrderInfos });
    this.props.resetReturnGroup();
  }

  confirmUpdateOrder() {
    const OrderInfos = _.filter(this.props.OrderInfos, item => item !== undefined);
    const OrderNum = OrderInfos.length;
    if (OrderNum === 0) return;
    
    const message = `Bạn có chắc chắn muốn cập nhật ${OrderNum} đơn hàng trên ?`;
    const title = 'Cập nhật đơn hàng ?';
  
    Alert.alert(
      title,
      message,
      [
        { text: 'Huỷ', onPress: () => console.log('Huy pressed'), style: 'cancel' },
        { text: 'Đồng ý', onPress: () => this.updateOrder() }
      ],
      { cancelable: false }
    );
  }

  renderHeader(pickGroup) {
    const { done, keyword } = this.props;
    const { goBack } = this.props.navigation;
    if (this.state.showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Tìm đơn hàng ..." value={keyword} 
              onChangeText={(text) => { 
                  this.props.changeKeyword1(text);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.changeKeyword1('');
              }}
              style={{ padding: 8 }}
            >
              <IconFA 
                name="times-circle" size={14} 
              />
            </TouchableOpacity>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 0 }}
              onPress={() => {
                this.setState({ showSearch: !this.state.showSearch });
                this.props.changeKeyword1('');
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
          <Title>{pickGroup.ClientName} - {pickGroup.ContactName}</Title>
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
            onPress={() => {
              this.props.changeDone1(!done);
            }}
          >
            <IC name="playlist-check" size={25} color={done ? Colors.headerActive : Colors.headerNormal} />
          </Button>
        </Right>
      </Header>
    );
  }

  render() {
    const { pds, done } = this.props;
    const { PickItems, ReturnItems } = pds;
    const { PickDeliveryType } = this.pickGroup;
    const Items = PickDeliveryType === 1 ? PickItems : ReturnItems;
    const pickGroup = Items.find(trip => trip.ClientHubID === this.ClientHubID); 
    return (
      
      <Container style={{ backgroundColor: Colors.background }}>
        {this.renderHeader(pickGroup)}
        <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
        <ReturnGroupDetail navigation={this.props.navigation} />
        <LoadingSpinner loading={this.props.loading} />
        {!done ?
        <Footer style={{ backgroundColor: Colors.background, borderTopWidth: 0 }}>
        <FooterTab style={{ backgroundColor: Colors.background }}>
          <TouchableOpacity 
            style={Styles.updateButtonStyle}
            onPress={this.confirmUpdateOrder.bind(this)}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Cập Nhật</Text>
          </TouchableOpacity>
        </FooterTab>
        </Footer>
        : null}
      </Container>
      
    );
  }
}

const mapStateToProps = ({ auth, pd, returnGroup }) => {
  const { sessionToken } = auth;
  const { pdsId, pds, loading } = pd;
  const { OrderInfos, done, keyword } = returnGroup;
  return { sessionToken, pdsId, pds, loading, OrderInfos, done, keyword };
};

export default connect(mapStateToProps, { updateOrderStatus, resetReturnGroup, changeDone1, changeKeyword1 })(PickGroupDetailScreen);
