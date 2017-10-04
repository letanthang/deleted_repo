import React from 'react';
import { View } from 'react-native';
import { Body, Text } from 'native-base';

const DataEmptyCheck = ({ children, data, message }) => {
  if (data === null || data === 0 || data.length === 0) {
    return (
      <Body style={{ padding: 16 }}>
        <Text>{message}</Text>
      </Body>      
    );
  }
  return (
    <View>
      {children}
    </View>
  );
};
export default DataEmptyCheck;
