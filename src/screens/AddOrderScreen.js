import React, { Component } from 'react';
import { View, TextInput, Keyboard, Text, TouchableOpacity,Platform } from 'react-native';
import { connect } from 'react-redux';
import { 
  Container, Header, Left, Body, Title, Right,
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
    const { senderHubId , isCvs} = this.props.navigation.state.params || {};
    this.props.addOneOrder(this.state.orderCode, 'PICK', senderHubId);
  }
  render() {
    // console.log("AddOrderScreen >> render Func")
    const bodyStyle = Platform.OS === 'android' ? Styles.bodyStyleAndroid : Styles.bodyStyle;
    const rightStyle = Platform.OS === 'android' ? Styles.rightStyleAndroid : Styles.rightStyle;

    const { senderHubId , isCvs} = this.props.navigation.state.params || {};
    // console.log("AddOrderScreen >> addOrder Func >> isCvs",this.props.navigation.state.params)
    
    // console.log("AddOrderScreen >> render Func >> this cvs ",this.isCvs)

    
    const { goBack } = this.props.navigation;
    const { pdsItems } = this.props;
    const { orderCode } = this.state;
    const disabled = orderCode.length < 7;
    const style = disabled ? Styles.addButtonDisableStyle : Styles.addButtonStyle;
    return (
      <Container>
        <Header>
        <Left style={Styles.leftStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            </View>
          </Left>
          <Body style={bodyStyle}>
            <Title>Thêm đơn hàng {isCvs ? "CVS" : ""} </Title>
          </Body>
          <Right style={rightStyle}>
          </Right>
        </Header>
        <Content 
          style={{ padding: 10 }}
          keyboardShouldPersistTaps='handled' 
        >
        {isCvs ? 
            <View style={{ padding: 10, borderColor:'#fff3cd',borderStyle:'solid', borderWidth:1, backgroundColor:'#fff3cd', borderRadius:0.25 }}>
                <Text style={{color:'#856404'}}>Lưu ý: <Text style={{fontWeight:'bold',color:'#856404'}}>Màn hình này chỉ để thêm đơn lấy của CVS.</Text> Ae không được thêm đơn hàng lấy của shop thường vào đây.
              </Text>
            </View>
          : 
          null
        }

          <View style={{ padding: 10 }}></View>
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
