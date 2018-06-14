import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import { View, TouchableOpacity, TextInput, Button as Btn, Clipboard } from 'react-native';
import { 
  Container, Header, Left, Body, Card, Title,
  Content, Text, Button, Icon, CardItem 
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import md5 from 'md5';
import { pdListFetch } from '../actions';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';

class AboutScreen extends Component {
  componentDidMount() {
    codePush.sync({ updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE });
    this.props.pdListFetch({});
  }
  state = { clickNum: 0, password: '', verified: false }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const { tripCode, userId, pdsItems, lastUpdatedTime, isTripDone } = this.props;
    const showTime = lastUpdatedTime ? moment(lastUpdatedTime).format('LT DD/MM ') : '';
    const ordersNum = pdsItems ? Object.keys(pdsItems).length : 0;
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
          <Body>
            <Title>Thông tin ứng dụng</Title>
          </Body>
        </Header>
        <Content
          keyboardShouldPersistTaps='handled'
          style={{ padding: 10 }}
        >
            <Card>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Phiên bản</Text>
                  </View>
                </View>
                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>14/06</Text>
                </View>
              </CardItem>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>MSNV</Text>
                  </View>
                </View>

                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{userId}</Text>
                </View>
              </CardItem>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Mã chuyến đi</Text>
                  </View>
                </View>

                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{tripCode}</Text>
                </View>
              </CardItem>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Tình trạng CĐ</Text>
                  </View>
                </View>
                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{ isTripDone ? 'Đã kết thúc' : 'Đang chạy'}</Text>
                </View>
              </CardItem>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Số lượng đơn</Text>
                  </View>
                </View>

                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{ordersNum}</Text>
                </View>
              </CardItem>
              <CardItem style={{ backgroundColor: Colors.row }}>
                <View style={HomeStyles.cardItemLeft}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Dữ liệu</Text>
                  </View>
                </View>

                <View style={HomeStyles.cardItemRight}>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{showTime}</Text>
                </View>
              </CardItem>
            </Card>
            <TouchableOpacity
              onPress={() => Clipboard.setString(tripCode + '' + userId)}
            >
            <Text>*Nhấn để copy</Text>
            </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => this.setState({ clickNum: this.state.clickNum + 1 })}
          >
            <View style={{ flex: 1, height: 44 }}></View>
          </TouchableOpacity>
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = ({ auth, pd }) => {
  const { userId } = auth;
  const { tripCode, pdsItems, isTripDone, lastUpdatedTime } = pd;
  return { userId, tripCode, pdsItems, isTripDone, lastUpdatedTime };
};

export default connect(mapStateToProps, {pdListFetch})(AboutScreen);
