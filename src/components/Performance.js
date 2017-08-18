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

import Utils from '../libs/Utils';
import { Styles } from '../Styles';
import { getUserPerformance } from '../actions';
import PDStatsCard from './home/PDStatsCard';

class Performance extends Component {
  componentWillMount() {
    console.log('Performance cwm');
    this.props.getUserPerformance();
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  
  render() {

    const { stats } = this.props;
    const monthCurrent = _.defaultTo(this.props.monthCurrent, { pick: 0, delivery: 0, return: 0 });
    console.log('Performance render, stats =');
    console.log(stats);
    return (
      <Content style={{ backgroundColor: '#eee' }}>
        <PDStatsCard 
          type='pick'
          upNumber={5}
          downNumber={12}
          percentage={monthCurrent.pick || 0}
        />
        <PDStatsCard 
          type='delivery'
          upNumber={5}
          downNumber={12}
          percentage={monthCurrent.delivery || 0}
        />
        <PDStatsCard 
          type='return'
          upNumber={5}
          downNumber={12}
          percentage={monthCurrent.return || 0}
        />
        <Text style={[Styles.normalColorStyle, Styles.bigTextStyle]}>Không có dữ liệu</Text>
      </Content>
    );
  }
}
const mapStateToProps = ({ other }) => {
  const { stats, yesterday, week, monthCurrent, monthPrevious } = other;
  return { stats, yesterday, week, monthCurrent, monthPrevious };
};

export default connect(mapStateToProps, { getUserPerformance })(Performance);
