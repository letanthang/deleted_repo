import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Orientation from 'react-native-orientation';
import SignatureCapture from 'react-native-signature-capture';

class SignatureScreen extends Component {

  componentWillMount() {
    Orientation.lockToLandscape();
  }
  componentWillUnmount() {
    Orientation.lockToPortrait();
  }
  onSaveEvent(result) {
      //result.encoded - for the base64 encoded png
      //result.pathName - for the file path name
      console.log(result);
      const pcScreen = this.props.navigation.state.params.pcScreen;
      pcScreen.setState({ signature: result });
      this.props.navigation.goBack();
  }
  onDragEvent() {
      // This callback will be called when the user enters signature
      console.log('dragged');
      this.signed = true;
  }

  saveSign() {
    this.refs['sign'].saveImage();
  }

  resetSign() {
      this.refs['sign'].resetImage();
      this.signed = false;
  }

  render() {
    console.log('SignatureScreen render!');
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <SignatureCapture
            style={StyleSheet.absoluteFill}
            ref='sign'
            onSaveEvent={this.onSaveEvent.bind(this)}
            onDragEvent={this.onDragEvent.bind(this)}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode='landscape'
        />
          <TouchableOpacity 
            style={[styles.buttonStyle, { position: 'absolute', top: 20, right: 16, width: 80 }]}
            onPress={() => { this.resetSign(); }} 
          >
            <Text>Xoá</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.buttonStyle, { position: 'absolute', bottom: 20, left: 16, width: 80 }]}
            onPress={() => this.props.navigation.goBack()} 
          >
            <Text>Trở về</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.buttonStyle, { position: 'absolute', bottom: 20, right: 16, width: 80 }]}
            onPress={() => { this.saveSign(); }} 
          >
            <Text>Lưu</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signature: {
      flex: 1,
      borderColor: '#000033',
      borderWidth: 1,
  },
  buttonStyle: {
      flex: 0.2, 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 40,
      backgroundColor: '#eeeeee',
      margin: 5
  }
});

export default SignatureScreen;
