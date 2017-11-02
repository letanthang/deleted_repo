import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Picker, View } from 'react-native';
import { 
  Content
} from 'native-base';

import Performance from './Performance';
import { Styles } from '../../Styles';


class All extends Component {
  state = { statType: 'lastWeek' }
  componentWillMount() {
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  renderNullData() {
    return (
      <Content>
        <Text style={[Styles.normalColorStyle, Styles.bigTextStyle]}>Không có dữ liệu</Text>
      </Content>
    );
  }
  
  render() {

    return (
      <Content>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Picker
            selectedValue={this.state.statType}
            onValueChange={(value) => {
              this.setState({ statType: value });
            }}
            style={{ flex: 0.3 }}
          >
            <Picker.Item label="Tuần trước" value="lastWeek" />
            <Picker.Item label="Tháng trước" value="lastMonth" />
            <Picker.Item label="Quý này" value="quarter" />
            <Picker.Item label="Quý trước" value="lastQuarter" />
          </Picker>
        </View>
        
        <Performance stats={this.props[this.state.statType]} statType={this.state.statType} />
      </Content>
    );
  }
}
const mapStateToProps = ({ other }) => {
  const { yesterday, week, month, lastWeek, lastMonth, quarter, lastQuarter } = other;
  return { yesterday, week, month, lastWeek, lastMonth, quarter, lastQuarter };
};

export default connect(mapStateToProps, { })(All);
