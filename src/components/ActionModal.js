import React, { Component } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import DatePicker from './DatePicker';

class ActionModal extends Component {
  state = { date: new Date(), androidDPShow: false }
  onChooseDate() {
    const date = this.state.date;
    this.props.onChooseDate(date);
    this.setState({ buttonIndex: null, androidDPShow: false });
  }
  onCancelDate() {
    this.setState({ date: new Date(), androidDPShow: false });
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
            <View
                style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1, padding: 10 }}
            >
                <Button
                  onPress={this.onCancelDate.bind(this)}
                  title='HUỶ'
                  color='#057AFF'
                />
                <View style={{ width: 20 }} />
                <Button
                  onPress={this.onChooseDate.bind(this)}
                  title='ĐỒNG Ý'
                  color='#057AFF'
                />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ActionModal;
