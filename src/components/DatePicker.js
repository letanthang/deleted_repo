import React, { Component } from 'react';
import { View, DatePickerAndroid, DatePickerIOS, Platform } from 'react-native';
import { Button, Text } from 'native-base';


const minimumDate = new Date();
const maximumDate = new Date();
maximumDate.setDate(maximumDate.getDate() + 5);
class DatePicker extends Component {
  
  componentWillMount() {
    console.log(`DatePicker: cwm ${Platform.OS}`);
    console.log(Platform.OS);
    if (Platform.OS === 'android') {
      //this.showAndroidDP();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('DatePicker: cwrp');
    if (Platform.OS === 'ios') return;
    const { androidDPShow } = nextProps;
    if (!this.props.androidDPShow && androidDPShow) {
      this.showAndroidDP();
    }
  }

  async showAndroidDP() {
    const { onDateChange, date } = this.props;
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({      
        date,
        maxDate: maximumDate,
        minDate: minimumDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        const stringDate = `${month}/${day}/${year}`;
        console.log(stringDate);
        const newDate = new Date(year, month, day);
        onDateChange(newDate);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  render() {
    const { date, onDateChange } = this.props;
    if (Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          date={date}
          mode='date'
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onDateChange={(newDate) => {
            onDateChange(newDate);
            }}
        />
      );
    }
    
    //string
    const stringDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    console.log(stringDate);

    return (
      <View style={{ alignSelf: 'center' }}>
        <Button onPress={() => this.showAndroidDP()}>
          <Text>{stringDate}</Text>
        </Button>
      </View>
    );
  }
}

export default DatePicker;
