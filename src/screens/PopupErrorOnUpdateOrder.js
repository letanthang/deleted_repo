
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, Platform, Keyboard, Button as RNButton, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import accounting from 'accounting';
import Utils from '../libs/Utils';
import { getOrders } from '../selectors';
import { updateWeightSize } from '../actions';
import { Colors, Styles } from '../Styles';


class PopupErrorOnUpdateOrder extends Component {
  constructor() {
    super();
    this.state = {actionEnabled: false};
  }
  componentWillMount() {
  }

  componentDidMount() {
    this.props.myFunc(this);
  }

  render() {
    console.log("PopupErrorOnUpdateOrder >> render ")
    const { orderCode } = this.props;
  
    return (
      <TouchableWithoutFeedback
        onPress={()=> Keyboard.dismiss()}
      >
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}
        >
          <View>
            <View style={styles.rowStyle}>
              <Text style={[Styles.midTextStyle, { color: 'red' }]}>xxx</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={[Styles.midTextStyle, Styles.normalColorStyle]}>xxx</Text> 
            </View>
            
          </View>
         
        </View>
      </TouchableWithoutFeedback>
      
    );
  }
}

const styles = StyleSheet.create({
  rowStyle: {
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    flex: 1,
    borderBottomColor: 'gray',
  },
  textStyleiOS: {
    flex: 1,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  }
});

const mapStateToProps = (state) => {
  const { pd, auth, other } = state;
  const { sessionToken } = auth;
  const { tripCode, loading } = pd;
  const { ServiceFee } = other;
  const db = getOrders(state);
  return { db, sessionToken, ServiceFee, tripCode, loading };
};


export default connect(
  mapStateToProps
)(PopupErrorOnUpdateOrder);
