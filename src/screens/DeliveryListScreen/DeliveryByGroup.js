import _ from 'lodash';
import React, { Component } from 'react';
import { TouchableOpacity, SectionList, RefreshControl } from 'react-native';
// import Accordion from 'react-native-collapsible/Accordion';
import { 
  Content, Text
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import DeliveryItem from './DeliveryItem';
import Utils from '../../libs/Utils';
import { toggleGroupActive, pdListFetch } from '../../actions';
import { DeliverGroupStyles, Colors } from '../../Styles';
import StatusText from '../../components/StatusText';
import { get3Type } from '../../selectors';

class DeliveryByGroup extends Component {
  state = { activeGroup: 0, keyword: '' };
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { keyword } = nextProps;
    console.log(keyword);
    this.setState({ keyword });
  }

  onDeliveryOrderPressOnce = _.debounce(this.onDeliveryOrderPress, 300, { leading: true, trailing: false });

  onDeliveryOrderPress(code) {
    this.props.navigation.navigate('DeliveryOrder', { code });
  }

  renderStatusText(order) {
    const DisplayStatus = Utils.getDisplayStatus(order);
    const StatusColor = Utils.getDisplayStatusColor(order);
    return (
      <StatusText text={DisplayStatus} colorTheme={StatusColor} />
    );
  }
  checkKeywork({ clientName, senderName, receiverAddress, senderPhone, receiverPhone }) {
    const keyword = this.state.keyword.toUpperCase();
    return this.state.keyword === '' 
      || (clientName && clientName.toUpperCase().includes(keyword))
      || (senderPhone && senderPhone.toUpperCase().includes(keyword))
      || (receiverPhone && receiverPhone.toUpperCase().includes(keyword))
      || senderName.toUpperCase().includes(keyword)
      || receiverAddress.toUpperCase().includes(keyword);
  }
  reloadData() {
    this.props.pdListFetch({});
  }

  render() {
    const groups = _.clone(this.props.groups);
    const orders = _.filter(this.props.DeliveryItems, o => this.checkKeywork(o));
    const datas = _.groupBy(orders, (item) => {
      if (item.done) return 'Đã xong';
      return item.group;
    });

    const sections = _.map(datas, (item, key) => {
      return { data: item, title: groups[key].groupName, groupIndex: key, activeSection: groups[key].isActive };
    });

    sections.sort((a, b) => groups[a.groupIndex].position - groups[b.groupIndex].position);

    return (
      <Content 
        refreshControl={
          <RefreshControl
            refreshing={this.props.loading}
            onRefresh={this.reloadData.bind(this)}
            // title={progressTitle}
          />
        }
        style={{ backgroundColor: Colors.background }}
      >
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.code }
        renderItem={({ item, index, section }) => {
          if (!section.activeSection) return null;
          return (
            <DeliveryItem 
              index={index}
              order={item}
              renderStatusText={this.renderStatusText.bind(this)}
              onDeliveryOrderPressOnce={this.onDeliveryOrderPressOnce.bind(this)}
            />
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
  const { pd, other } = state;
  const { groups, timeServer } = pd;
  const { loading } = other;
  const { DeliveryItems } = get3Type(state);
  return { DeliveryItems, groups, loading, timeServer };
};

export default connect(mapStateToProps, { toggleGroupActive, pdListFetch })(DeliveryByGroup);
