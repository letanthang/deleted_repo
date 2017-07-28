import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingSpinner = ({ loading }) => {
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  }
});

export default LoadingSpinner;
