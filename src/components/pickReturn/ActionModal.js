import React, { Component } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import DatePicker from '../DatePicker';

class ActionModal extends Component {
  state = { date: new Date(), androidDPShow: false }
  onChooseDate() {
    const date = this.state.date;
    //string
    //const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    //console.log(stringDate);
    //timestamp
    //const timestamp = this.state.date.getTime();
    //this.updateOrderToFail(this.order, this.state.buttonIndex, timestamp);
    this.props.onChooseDate(date);
    this.setState({ modalShow: !this.state.modalShow, buttonIndex: null, androidDPShow: false });
  }
  onCancelDate() {
    this.setState({ modalShow: !this.state.modalShow, date: new Date(), androidDPShow: false });
  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        visible={this.state.modalShow}
        onShow={() => this.setState({ androidDPShow: true })}
      >
        <View 
          style={{ 
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#000000aa'
          }}
        >
          <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 10 }} >
            <Text
              style={{ alignSelf: 'center', color: 'black', fontWeight: 'bold', margin: 20 }}
            >
              Chọn ngày
            </Text>
            <DatePicker
              date={this.state.date}
              androidDPShow={this.state.androidDPShow}
              mode='date'
              onDateChange={(date) => {
                this.setState({ date });
                console.log(`date changed to : ${date}`);
                }}
            />
            <View
                style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
            >
                <Button
                  onPress={this.onChooseDate.bind(this)}
                  title='ĐỒNG Ý'
                  color='#057AFF'
                />
            </View>
            <View
                style={{ flexDirection: 'row', justifyContent: 'center', borderTopColor: '#E7E8E9', borderTopWidth: 1 }}
            >
                <Button
                  onPress={this.onCancelDate.bind(this)}
                  title='HUỶ'
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
