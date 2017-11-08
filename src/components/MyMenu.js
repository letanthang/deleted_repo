import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const MyMenu = ({ show, onBlur, onPress }) => {
  if (!show) return null;

  return (
      <TouchableOpacity 
        onPress={onBlur}
        style={styles.wrapper}
      >
        <View>
          <View style={{ backgroundColor: 'white', width: 100, padding: 8, justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={onPress}
            >
              <Text style={styles.item}>Cập nhật DL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPress}
            >
              <Text style={styles.item}>Lấy</Text>
            </TouchableOpacity>
            <Text style={styles.item}>Giao</Text>
            <Text style={styles.item}>Trả</Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 0,
    top: 66,
    left: 0,
    bottom: 0,
    
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#dddddd44',
    shadowOffset: { width: 4, height: 5 },
    shadowRadius: 7,
    shadowColor: '#555',
    shadowOpacity: 0.6,
    elevation: 5,
  },
  item: {
    paddingTop: 3,
    paddingBottom: 3
  }
});

export default MyMenu;
