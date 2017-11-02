import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Left, Body,
  Content, Icon, Button
} from 'native-base';
import color from 'color';
import { changeOrderCode, getOrder } from '../actions';
import OrderDetail from './OrderDetail';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';

class AddOrderScreen extends Component {
  render() {
    const { goBack } = this.props.navigation;
    const { OrderCode } = this.props;
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
        <Content style={{ padding: 10 }}>
          <View>
            <View><Text>Nhập mã đơn hàng</Text></View>
            <View>
              <TextInput 
                value={OrderCode}
                onChangeText={(text) => this.props.changeOrderCode(text)}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => this.props.getOrder(OrderCode)}
              style={style}
            >
              <Text style={{ color: '#FFF' }}>Kiểm tra đơn</Text>
            </TouchableOpacity>
          </View>
          <View>
            <OrderDetail />
          </View>
        </Content>

      </Container>
    );
  }
}

const mapStateToProps = ({ orderAdd }) => {
  const { OrderCode, order } = orderAdd;
  return { OrderCode, order };
}

export default connect(mapStateToProps, { changeOrderCode, getOrder })(AddOrderScreen);
