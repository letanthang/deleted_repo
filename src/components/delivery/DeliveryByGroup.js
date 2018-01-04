import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { 
  Content, Text,
  List, Badge
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Utils from '../../libs/Utils';
import { navigateOnce } from '../../libs/Common';
import LocalGroup from '../../libs/LocalGroup';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import StatusText from '../StatusText';
import DataEmptyCheck from '../DataEmptyCheck';
import { get3Type } from '../../selectors';

class DeliveryByGroup extends Component {
  state = { activeGroup: 0, keyword: '' };
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { keyword } = nextProps;
    this.setState({ keyword });
  }

  onDeliveryOrderPressOnce = _.debounce(this.onDeliveryOrderPress, 500);

  onDeliveryOrderPress(OrderID) {
    navigateOnce(this, 'DeliveryOrder', { OrderID });
  }

  renderStatusText(status) {
    const DisplayStatus = Utils.getDisplayStatus(status);
    const StatusColor = Utils.getDisplayStatusColor(status);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }

  renderOrder(order, sectionID, rowID) {
    const { DeliveryAddress, OrderCode, OrderID, CurrentStatus, TotalCollectedAmount, DisplayOrder, ServiceName } = order;
    const wrapperStyle = rowID == 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
    
    return (
      <TouchableOpacity
        onPress={this.onDeliveryOrderPress.bind(this, OrderID)}
      >
        <View style={wrapperStyle}>
          <View style={Styles.item2Style}>
            <Text style={[Styles.bigTextStyle, Styles.normalColorStyle]}>
              [{DisplayOrder}] {OrderCode}
            </Text>
            <Badge>
              <Text>{ServiceName}</Text>
            </Badge>
          </View>
          <View style={Styles.itemStyle}>
            <Text style={[Styles.midTextStyle, Styles.weakColorStyle]}>
              {DeliveryAddress}
            </Text>
          </View>
          <View style={Styles.itemStyle}>
            {this.renderStatusText(CurrentStatus)}
          </View>
        </View>
      </TouchableOpacity>
      
    );
  }

  _renderHeader(Group, index, active) {
    const iconName = active ? 'minus-box-outline' : 'plus-box-outline';
    return (
      <View style={styles.header}>
        <IC name={iconName} size={20} color='#808080' />
        <Text style={styles.headerText}>{ Group || 'Mặc định'}</Text>
      </View>
    );
  }

  _renderContent(Group) {
    return (
      <View style={DeliverGroupStyles.content}>
        {this.renderGroup(Group)}
      </View>
    );
  }

  
  renderGroup(Group) {
    let deliveryList = {};
    if (Group === 'Đã xong') {
      deliveryList = this.props.DeliveryItems.filter(order => Utils.checkDeliveryComplete(order.CurrentStatus)
        && (this.state.keyword === '' || order.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase())));
    } else {
      deliveryList = this.props.DeliveryItems.filter(order => order.Group === Group
        && (this.state.keyword === '' || order.OrderCode.toUpperCase().includes(this.state.keyword.toUpperCase())));
    }

    console.log(deliveryList);
    
    return (
      <DataEmptyCheck
        data={deliveryList}
        message='Không có dữ liệu'
      >
        <List 
          dataArray={deliveryList}
          renderRow={this.renderOrder.bind(this)}
        />
      </DataEmptyCheck>
      
      
    );
  }
  render() {
    const groups = _.clone(LocalGroup.getGroups());
    groups.push('Đã xong');
    groups.unshift(undefined);
    return (
      <Content style={{ backgroundColor: Colors.background }}>
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
    backgroundColor: Colors.background,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#CFCFD1',
    flexDirection: 'row'
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#808080'
  },
  content: {
    paddingBottom: 5,
    // backgroundColor: '#fff',
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

const mapStateToProps = (state) => {
  const { DeliveryItems } = get3Type(state);
  return { DeliveryItems };
};

export default connect(mapStateToProps)(DeliveryByGroup);
