import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Left, Body,
  Content, Icon, Button
} from 'native-base';
import { changeOrderCode, addOneOrder } from '../actions';
import { Styles } from '../Styles';
import LoadingSpinner from '../components/LoadingSpinner';

class AddOrderScreen extends Component {
  componentWillMount() {
    this.props.changeOrderCode('');
  }
  render() {
    const { goBack } = this.props.navigation;
    const { code, pdsItems } = this.props;
    const disabled = this.props.code.length < 7;
    const style = disabled ? Styles.addButtonDisableStyle : Styles.addButtonStyle;
    console.log(disabled);
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
                onPress={() => this.props.addOneOrder(code, 'PICK')}
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
  const { orderAdd, pd } = state;
  const { code, order } = orderAdd;
  const { pdsItems, addOrderLoading } = pd;
  return { code, order, pdsItems, addOrderLoading };
};

export default connect(mapStateToProps, { changeOrderCode, addOneOrder })(AddOrderScreen);
