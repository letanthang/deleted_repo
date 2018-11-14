import React, { Component } from 'react';
import { View, TextInput, Keyboard, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Left, Body,
  Content, Icon, Button
} from 'native-base';
import { addOneOrder } from '../actions';
import { Styles } from '../Styles';
import LoadingSpinner from '../components/LoadingSpinner';
import { ActionLogCode } from '../components/Constant';
import ActionLog from '../libs/ActionLog';

class AddOrderScreen extends Component {
  state = { orderCode: '' }
  addOrder() {
    ActionLog.log(ActionLogCode.ADD_ONE_ORDER, this.props.navigation);
    Keyboard.dismiss();
    this.props.addOneOrder(this.state.orderCode, 'PICK');
  }
  render() {
    const { goBack } = this.props.navigation;
    const { pdsItems } = this.props;
    const { orderCode } = this.state;
    const disabled = orderCode.length < 7;
    const style = disabled ? Styles.addButtonDisableStyle : Styles.addButtonStyle;
    // console.log(disabled);
    return (
      <Container>
        <Header>
          <Left>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            </View>
          </Left>
          <Body />
        </Header>
        <Content 
          style={{ padding: 10 }}
          keyboardShouldPersistTaps='handled'
        >
          {pdsItems !== null ?
          <View>
            <View><Text>Nhập mã đơn hàng</Text></View>
            <View style={{ paddingTop: 16 }}>
              <TextInput 
                placeholder='XXXXXXXX'
                value={orderCode}
                onChangeText={(text) => this.setState({ orderCode: text.toUpperCase() })}
                autoCorrect={false}
                autoCapitalize='characters'
              />
            </View>
            <View style={{ paddingTop: 16 }}>
              <TouchableOpacity
                disabled={disabled}
                onPress={this.addOrder.bind(this)}
                style={style}
              >
                <Text style={{ color: '#FFF' }}>Thêm đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View><Text>Hiện chưa có chuyến đi.</Text></View>}
        </Content>
        <LoadingSpinner loading={this.props.addOrderLoading} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { pd } = state;
  const { pdsItems, addOrderLoading } = pd;
  return { pdsItems, addOrderLoading };
};

export default connect(mapStateToProps, { addOneOrder })(AddOrderScreen);
