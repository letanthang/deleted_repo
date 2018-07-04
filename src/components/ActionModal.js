import React, { Component } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, Switch } from 'react-native';
import { CheckBox } from 'react-native-elements';
import DatePicker from './DatePicker';
import moment from 'moment';

class ActionModal extends Component {
  state = { date: new Date(), androidDPShow: false, pmSwitch: false }
  componentWillMount() {
  }
  componentWillReceiveProps() {
    const date = new Date();
    if (date.getHours() >= 14) {
      date.setDate(date.getDate() + 1);
      this.setState({ date });
    }
  }
  getNextDate() {
    const date = new Date(this.state.date);
    if (this.state.pmSwitch || date.getDay() == new Date().getDay()) {
      date.setHours(14);
    } else {
      date.setHours(2);
    }
    date.setMinutes(0);
    return date;
  }
  getDisplayDateString() {
    const date = this.getNextDate()
    date.setHours(date.getHours() - 2);
    return moment(date).format('DD/MM H:mm')
  }
  onChooseDate() {
    const date = this.getNextDate();
    // console.log(date);
    this.props.onChooseDate(date);
    this.setState({ buttonIndex: null, androidDPShow: false, pmSwitch: false });
  }
  onCancelDate() {
    this.setState({ date: new Date(), androidDPShow: false, pmSwitch: false });
    this.props.onCancelDate();
  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        visible={this.props.visible}
        onShow={() => this.setState({ androidDPShow: true })}
        onRequestClose={() => {
              alert("Modal has been closed.");
            }}
      >
        <View 
          style={{ 
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#000000aa'
          }}
        >
          <View style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }} >
            <Text
              style={{ alignSelf: 'center', color: 'black', fontWeight: 'bold', marginTop: 10 }}
            >
              Chọn ngày
            </Text>
            <View style={{ padding: 8 }}>
              <DatePicker
                date={this.state.date}
                androidDPShow={this.state.androidDPShow}
                mode='date'
                onDateChange={(date) => {
                  this.setState({ date });
                  }}
              />
            </View>
            {new Date(this.state.date).getDay() != new Date().getDay() ?
            <View style={{ alignItems: 'center', padding: 2 }}>
              <View style={{ borderWidth: 1, borderRadius: 2, borderColor: '#ededed' }}>
                <CheckBox
                  containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                  center
                  title='Sáng'
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={!this.state.pmSwitch}
                  onPress={() => this.setState({ pmSwitch: false })}
                />
                <CheckBox
                  containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                  center
                  title='Chiều'
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={this.state.pmSwitch}
                  onPress={() => this.setState({ pmSwitch: true })}
                />
              </View>
              
            </View>
            : <View style={{ alignItems: 'center' }}><View style={{ padding: 10, borderWidth: 1, borderRadius: 2, borderColor: '#ededed' }}><Text style={{ fontWeight: 'bold' }}>Chiều</Text></View></View>}
            <View style={{alignItems: 'center', padding: 10 }}>
              <Text style={{ color: '#FF7F9C', fontWeight: 'bold' }}>Đơn hàng sẽ lên lại vào {this.getDisplayDateString()} </Text>
            </View>
            <View
                style={{ flexDirection: 'row', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
            >
                <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRightWidth: 1, borderRightColor: '#E7E8E9' }}>
                  <Button
                    onPress={this.onCancelDate.bind(this)}
                    title='HUỶ'
                    color='#057AFF'
                  />
                </View>
                <View style={{ flex: 0.5, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
                  <Button
                    onPress={this.onChooseDate.bind(this)}
                    title='ĐỒNG Ý'
                    color='#057AFF'
                  />
                </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ActionModal;
