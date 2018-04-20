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
    const { code, pdsItems } = this.props;
    const disabled = this.props.code.length < 7;
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
          {pdsItems !== null ?
          <View>
            <View><Text>Nhập mã đơn hàng</Text></View>
            <View style={{ paddingTop: 16 }}>
              <TextInput 
                placeholder='XXXXXXXX'
                value={code}
                onChangeText={(text) => this.props.changeOrderCode(text.toUpperCase())}
                autoCorrect={false}
                autoCapitalize='characters'
              />
            </View>
            <View style={{ paddingTop: 16 }}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => this.props.getOrder(code)}
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
  const { code, order } = orderAdd;
  const { pdsItems } = pd;
  return { code, order, pdsItems };
};

export default connect(mapStateToProps, { changeOrderCode, getOrder })(AddOrderScreen);
