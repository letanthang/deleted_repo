import _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity, SectionList } from 'react-native';
// import Accordion from 'react-native-collapsible/Accordion';
import { 
  Content, Text, Badge
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Utils from '../../libs/Utils';
import { toggleGroupActive } from '../../actions';
import { Styles, DeliverGroupStyles, Colors } from '../../Styles';
import StatusText from '../StatusText';
import { get3Type } from '../../selectors';

class DeliveryByGroup extends Component {
  state = { activeGroup: 0, keyword: '' };
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { keyword } = nextProps;
    this.setState({ keyword });
  }

  onDeliveryOrderPressOnce = _.debounce(this.onDeliveryOrderPress, 300, { leading: true, trailing: false });

  onDeliveryOrderPress(OrderID) {
    this.props.navigation.navigate('DeliveryOrder', { OrderID });
  }

  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }

  render() {
    const groups = _.clone(this.props.groups);

    const datas = _.groupBy(this.props.DeliveryItems, (item) => {
      if (Utils.checkDeliveryComplete(item.CurrentStatus)) return 'Đã xong';
      return item.group;
    });

    const sections = _.map(datas, (item, key) => {
      return { data: item, title: groups[key].groupName, groupIndex: key, activeSection: groups[key].isActive };
    });

    return (
      <Content style={{ backgroundColor: Colors.background }}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.OrderID }
        renderItem={({ item, index, section }) => {
          if (!section.activeSection) return null;

          const order = item;
          const { DeliveryAddress, OrderCode, OrderID, DisplayOrder, ServiceName } = order;
          const wrapperStyle = index === 0 ? DeliverGroupStyles.orderWrapperFirstStyle : DeliverGroupStyles.orderWrapperStyle;
          
          return (
            <TouchableOpacity
              onPress={this.onDeliveryOrderPressOnce.bind(this, OrderID)}
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
                  {this.renderStatusText(order)}
                </View>
              </View>
            </TouchableOpacity>
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
                this.props.toggleGroupActive(section.groupIndex);
              }}
            >
              <IC name={iconName} size={20} color='#808080' />
              <Text style={DeliverGroupStyles.headerText}>{section.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      </Content>
    );
  }
}


const mapStateToProps = (state) => {
  const { pd } = state;
  const { groups } = pd;
  const { DeliveryItems } = get3Type(state);
  return { DeliveryItems, groups };
};

export default connect(mapStateToProps, { toggleGroupActive })(DeliveryByGroup);
