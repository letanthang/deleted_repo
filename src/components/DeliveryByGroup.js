import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import { 
  Content, Card, CardItem, Text,
  List, ListItem, Item, Right, Badge 
} from 'native-base';
import { connect } from 'react-redux';
import Utils from '../libs/Utils';
import LocalGroup from '../libs/LocalGroup';

class DeliveryByGroup extends Component {
  componentWillMount() {
    console.log('====================================');
    console.log('DeliveryGroupList CWM');
    console.log('====================================');
    this.state = { activeGroup: 0 };
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate(prevProps, prevState) {

  }
  onDeliveryOrderPress(OrderID) {
    console.log('onDeliveryOrderPress called with OrderID =');
    console.log(OrderID);
    this.props.navigation.navigate('DeliveryOrder', { OrderID });
  }

  renderStatusText(status) {
    const displayStatus = Utils.getDisplayStatus(status);
    let textColor = '#65BD68';
    if (displayStatus === 'Đã giao') {
      textColor = 'grey';
    } else if (displayStatus === 'Giao lỗi') {
      textColor = '#E82027';
    }
    return (
      <Text style={{ color: textColor }}>
        {displayStatus}
      </Text>
    );
  }

  renderOrder(order) {
    const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount, DisplayOrder } = order;
    return (
      <TouchableOpacity
        onPress={this.onDeliveryOrderPress.bind(this, OrderID)}
      >
        <Card>
          <CardItem header>
            <Text>
              [{DisplayOrder}] {OrderCode}
            </Text>
            <Right>
              <Badge>
                <Text>6h</Text>
              </Badge>
            </Right>
          </CardItem>
          <CardItem>
            <View style={{ flex: 1 }}>          
            <Text>
              {Address}
            </Text>
            <Item style={{ }} />
            {this.renderStatusText(CurrentStatus)}
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
      
    );
  }

  _renderHeader(Group) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{ Group || 'Mac dinh'}</Text>
      </View>
    );
  }

  _renderContent(Group) {
    return (
      <View style={styles.content}>
        {this.renderGroup(Group)}
      </View>
    );
  }

  
  renderGroup(Group) {
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const deliveryList = this.props.deliveryList.filter(order => order.Group === Group);
    //console.log(`renderGroup ${Group}`);
    //console.log(deliveryList);
    return (
      
      <List
        dataArray={deliveryList}
        renderRow={this.renderOrder.bind(this)}
      />
      
    );
  }
  render() {
    
    //const { Address, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount }
    const deliveryList = this.props.deliveryList;
    console.log(`DeliveryByGroup render, activeGroup = ${this.state.activeGroup}`);
    console.log(deliveryList);
    const groups = _.clone(LocalGroup.getGroups());
    groups.unshift(null);
    // console.log('render, groups =');
    // console.log(groups);
    return (
      <Content style={{ backgroundColor: '#eee' }}>
      <SearchBar
        round
        lightTheme
        onChangeText={(text) => console.log(text)}
        placeholder='Type here...'
      />
      <Accordion
        activeSection={this.state.activeGroup}
        sections={groups}
        renderHeader={this._renderHeader.bind(this)}
        renderContent={this._renderContent.bind(this)}
        onChange={this.onAccordionChange.bind(this)}
      />
      
      </Content>
    );
  }
  onAccordionChange(index) {
    this.setState({ activeGroup: index });
    console.log(`active group change to ${index}`);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
});

const mapStateToProps = ({ pd }) => {
  const { pds } = pd;
  return { pds };
};

export default connect(mapStateToProps)(DeliveryByGroup);
