import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const MyMenu = ({ show, onBlur, onPress }) => {
  console.log(`MyMenu ${show}`);
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
              <Text style={styles.item}>Lay</Text>
            </TouchableOpacity>
            <Text style={styles.item}>Giao</Text>
            <Text style={styles.item}>Tra</Text>
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
