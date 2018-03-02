import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { 
  Content,
  List
} from 'native-base';
import {
  Card 
} from 'react-native-elements';

import Utils from '../../libs/Utils';
import { Styles } from '../../Styles';
import { getUserPerformance } from '../../actions';
import PDStatsCard from '.././home/PDStatsCard';

class Performance extends Component {
  componentWillMount() {
    this.props.getUserPerformance(this.props.statType);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.statType !== nextProps.statType) {
      this.props.getUserPerformance(nextProps.statType);
    }
  }

  renderNullData() {
    return (
      <Content>
        <Text style={[Styles.normalColorStyle, Styles.bigTextStyle]}>Không có dữ liệu</Text>
      </Content>
    );
  }
  
  render() {
    if (!this.props.stats) return this.renderNullData();
    const { pickRate, returnRate, deliveryRate, pickTotal, pickSucceed, deliverTotal, deliverSucceed, returnTotal, returnSucceed } = this.props.stats;
    //const monthCurrent = _.defaultTo(this.props.monthCurrent, { pick: 0, delivery: 0, return: 0 });
    return (
      <Content>
        <PDStatsCard 
          type='pick'
          upNumber={pickSucceed}
          downNumber={pickTotal}
          percentage={pickRate}
        />
        <PDStatsCard 
          type='delivery'
          upNumber={deliverSucceed}
          downNumber={deliverTotal}
          percentage={deliveryRate}
        />
        <PDStatsCard 
          type='return'
          upNumber={returnSucceed}
          downNumber={returnTotal}
          percentage={returnRate}
        />
      </Content>
    );
  }
}

export default connect(null, { getUserPerformance })(Performance);
