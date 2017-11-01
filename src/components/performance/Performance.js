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
    console.log('Performance cwm');
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
    console.log(this.props.stats);
    console.log('Performance render!');
    if (!this.props.stats) return this.renderNullData();
    const { pickRate, returnRate, deliveryRate, pick_total, pick_succeed, deliver_total, deliver_succeed, return_total, return_succeed } = this.props.stats;
    //const monthCurrent = _.defaultTo(this.props.monthCurrent, { pick: 0, delivery: 0, return: 0 });
    console.log('Performance render, stats =');
    //console.log(stats);
    return (
      <Content>
        <PDStatsCard 
          type='pick'
          upNumber={pick_succeed}
          downNumber={pick_total}
          percentage={pickRate}
        />
        <PDStatsCard 
          type='delivery'
          upNumber={deliver_succeed}
          downNumber={deliver_total}
          percentage={deliveryRate}
        />
        <PDStatsCard 
          type='return'
          upNumber={return_succeed}
          downNumber={return_total}
          percentage={returnRate}
        />
      </Content>
    );
  }
}

export default connect(null, { getUserPerformance })(Performance);
