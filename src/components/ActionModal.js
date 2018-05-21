import React, { Component } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, Switch } from 'react-native';
import DatePicker from './DatePicker';

class ActionModal extends Component {
  state = { date: new Date(), androidDPShow: false, pmSwitch: false }
  onChooseDate() {
    const date = new Date(this.state.date);
    if (this.state.pmSwitch) {
      date.setHours(14);
    } else {
      date.setHours(1);
    }
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
            <View style={{ padding: 10 }}>
              <DatePicker
                date={this.state.date}
                androidDPShow={this.state.androidDPShow}
                mode='date'
                onDateChange={(date) => {
                  this.setState({ date });
                  }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <TouchableOpacity onPress={() => this.setState({ pmSwitch: false })}><Text>Sáng</Text></TouchableOpacity>
              <Switch
                value={this.state.pmSwitch} 
                onValueChange={value => this.setState({ pmSwitch: value })} 
              />
              <TouchableOpacity onPress={() => this.setState({ pmSwitch: true })}><Text>Chiều</Text></TouchableOpacity>
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
