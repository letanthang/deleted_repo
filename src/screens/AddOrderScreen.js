import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Left, Body,
  Content, Icon, Button
} from 'native-base';
import { changeOrderCode, getOrder } from '../actions';
import { Styles } from '../Styles';

class AddOrderScreen extends Component {
  componentWillMount() {
    this.props.changeOrderCode('');
  }
  render() {
    const { goBack } = this.props.navigation;
    const { OrderCode, PDSItems } = this.props;
    const disabled = this.props.OrderCode.length < 7;
    const style = disabled ? Styles.addButtonDisableStyle : Styles.addButtonStyle;

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
          {PDSItems !== null ?
          <View>
            <View><Text>Nhập mã đơn hàng</Text></View>
            <View style={{ paddingTop: 16 }}>
              <TextInput 
                placeholder='XXXXXXXX'
                value={OrderCode}
                onChangeText={(text) => this.props.changeOrderCode(text)}
                autoCorrect={false}
                autoCapitalize='characters'
              />
            </View>
            <View style={{ paddingTop: 16 }}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => this.props.getOrder(OrderCode)}
                style={style}
              >
                <Text style={{ color: '#FFF' }}>Kiểm tra đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View><Text>Hiện chưa có chuyến đi.</Text></View>}
        </Content>

      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { orderAdd, pd } = state;
  const { OrderCode, order } = orderAdd;
  const { PDSItems } = pd;
  return { OrderCode, order, PDSItems };
};

export default connect(mapStateToProps, { changeOrderCode, getOrder })(AddOrderScreen);
