import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import { Bar } from 'react-native-progress';

class ProgressBar extends PureComponent {
  state = { show: false };
  componentWillReceiveProps({ loading }) {
    if (loading !== this.props.loading) {
      if (loading && !this.state.show) this.setState({ show: true });
      if (!loading && this.state.show) setTimeout(() => this.setState({ show: false }), 100);
    }
  }
  render() {
    const { width } = Dimensions.get('window');
    const { progress } = this.props;
    return (
      <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2, height: 10 }}>
        {this.state.show ?
        <Bar
          color='blue'
          unfilledColor='#ccc'
          borderRadius={2}
          progress={progress / 100}
          height={10}
          width={width - 20}
          indeterminate={false}
          style={{ marginLeft: 10, marginRight: 10 }}
        />
        : null}
      </View>
    );
  }
}
export default ProgressBar;
