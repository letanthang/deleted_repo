import _ from 'lodash';
import React, { Component } from 'react';
import { SectionList, TouchableOpacity, LayoutAnimation, UIManager, RefreshControl } from 'react-native';
import { 
  Container, Right, Left, Body, Content,
  Icon, Button, Text,
  Header
} from 'native-base';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AppHeader from './AppHeader';
import AppFooter from '../../components/AppFooter';
import Utils from '../../libs/Utils';
import { get3Type, getNumbers } from '../../selectors';
import { toggleLayout, pdListFetch } from '../../actions';

import DataEmptyCheck from '../../components/DataEmptyCheck';
import ProgressBar from '../../components/ProgressBar';
import TripItem from './TripItem';
import { DeliverGroupStyles, Colors } from '../../Styles';

class TripListScreen extends Component {
  state = { done: false, showSearch: false, keyword: '' };
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  shouldComponentUpdate({ pickOrderComplete, loading, progress, layoutMode }, nextState) {
    // console.log(this.state)
    if (pickOrderComplete === this.props.pickOrderComplete
      && JSON.stringify(this.state) === JSON.stringify(nextState)
      && loading === this.props.loading
      && progress === this.props.progress
      && layoutMode === this.props.layoutMode
    ) return false;
    return true;
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  onToggleLayoutPress() {
    const text = this.props.layoutMode === true ? 'Nhóm dữ liệu tự động' : 'Hãy tự tạo nhóm!'; 
    _.delay(() => Utils.showToast(text, 'warning'), 100);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.props.toggleLayout();
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
  
  checkKeywork({ clientName, senderName, senderAddress }) {
    const keyword = this.state.keyword.toUpperCase();
    return this.state.keyword === '' 
      || (clientName && clientName.toUpperCase().includes(keyword))
      || senderName.toUpperCase().includes(keyword)
      || senderAddress.toUpperCase().includes(keyword);
  }

  checkTripDone(trip) {
    const ordersNum = trip.ShopOrders.length;
    const completedNum = trip.ShopOrders.filter(o => o.done).length;
    return (ordersNum === completedNum);
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
  
  

  groupData() {
    const { PickItems } = this.props;
    if (!PickItems) return this.renderNullData();

    const key = this.props.layoutMode ? 'shopGroupName' : 'clientId';
    let items = null;
    let datas = null;
    
    if (this.props.layoutMode) {
      items = PickItems.filter(trip => this.checkKeywork(trip));
    } else {
      items = PickItems.filter(trip => this.state.done === trip.done && this.checkKeywork(trip));
    }
    
    datas = _.groupBy(items, key);
    let first = true;
    const sections = _.map(datas, (item) => {
      const clientId = item[0][key];
      const title = `${this.props.layoutMode ? item[0].shopGroupName : item[0].clientName} (${item.length})`;
      const activeSection = first && this.state[clientId] === undefined ? true : this.state[clientId];
      const position = item[0].position;
      first = false;
      return { data: item, title, clientId, activeSection, position };
    });
    if (this.props.layoutMode) {
      sections.sort((a, b) => a.position - b.position);
    }
    return sections;
  }

  reloadData() {
    this.props.pdListFetch({});
  }

  render() {
    console.log('TripListScreen render');
    const emptyMessage = this.state.done ? 'Chưa có chuyến hoàn tất' : 'Tất cả chuyến đã hoàn tất';
    const sections = this.groupData();

    return (
      <Container style={{ backgroundColor: Colors.background }}>
        <AppHeader
          done={this.state.done}
          keyword={this.state.keyword}
          showSearch={this.state.showSearch}
          layoutMode={this.props.layoutMode}
          onGroup={() => this.props.navigation.navigate('GroupPick')}
          onChange={props => this.setState(props)}
          onGoBack={this.goBack.bind(this)}
          onToggleLayoutPress={() => this.onToggleLayoutPress()}
        />
        <ProgressBar
          progress={this.props.progress}
          loading={this.props.loading}
        />
        <Content 
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this.reloadData.bind(this)}
              // title={progressTitle}
            />
          }
        >
          <DataEmptyCheck
            data={sections}
            message={emptyMessage}
          >
            <SectionList
              onPressItem
              renderItem={({ item, index, section }) => {
                const { activeSection } = section;
                const { senderAddress, senderName, senderPhone, estimateTotalServiceCost, type, senderHubId } = item;
                const ordersNum = item.ShopOrders.length;
                const completedNum = item.ShopOrders.filter(o => o.done).length;
                return (
                  <TripItem 
                    index={index}
                    activeSection={activeSection}
                    senderAddress={senderAddress}
                    senderName={senderName}
                    senderPhone={senderPhone}
                    estimateTotalServiceCost={estimateTotalServiceCost}
                    ordersNum={ordersNum}
                    completedNum={completedNum}
                    type={type}
                    senderHubId={senderHubId}
                    ReturnItems={this.props.ReturnItems}
                    navigation={this.props.navigation}
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
                      const key = section.clientId;
                      this.setState({ [key]: !active });
                    }}
                  >
                    <IC name={iconName} size={20} color='#808080' />
                    <Text style={DeliverGroupStyles.headerText}>{section.title}</Text>
                  </TouchableOpacity>
                );
              }}
              sections={sections}
            /> 
          </DataEmptyCheck>
        </Content>
        <AppFooter navigation={this.props.navigation} />
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  const { timeServer } = state.pd;
  const { loading, progress } = state.other;
  const { layoutMode } = state.config;
  const { PickItems, ReturnItems } = get3Type(state);
  const stats = getNumbers(state);
  const { pickOrderComplete } = stats;
  return { PickItems, ReturnItems, layoutMode, pickOrderComplete, loading, progress, timeServer };
};

export default connect(mapStateToProps, { toggleLayout, pdListFetch })(TripListScreen);
