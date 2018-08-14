import _ from "lodash";
import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import { View, TouchableOpacity, TextInput, Button as Btn, Clipboard } from 'react-native';
import { 
  Container, Header, Left, Body, Card, Title,
  Content, Text, Button, Icon, CardItem, Right 
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import md5 from 'md5';
import { pdListFetch } from '../actions';
import { HomeStyles, Styles, Colors, Theme } from '../Styles';
import { live, appVersionName } from '../apis/MPDS';

class AboutScreen extends Component {
  componentDidMount() {
    if (live) codePush.sync({ updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE });
    this.props.pdListFetch({});
  }
  state = { clickNum: 0, password: '', verified: false }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const { tripCode, userId, pdsItems, lastUpdatedTime, isTripDone } = this.props;
    let { allDate, resetDate } = this.props;
    allDate = allDate ? moment(allDate).format('LT DD/MM ') : '';
    resetDate = resetDate ? moment(resetDate).format('LT DD/MM ') : '';
    const showTime = lastUpdatedTime ? moment(lastUpdatedTime).format('LT DD/MM ') : '';
    const ordersNum = pdsItems ? Object.keys(pdsItems).length : 0;
    const pickNum = pdsItems ? _.filter(pdsItems, o => o.type == 'PICK').length : 0;
    const returnNum = pdsItems ? _.filter(pdsItems, o => o.type == 'RETURN').length : 0;
    const deliverNum = pdsItems ? _.filter(pdsItems, o => o.type == 'DELIVER').length : 0;

    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              transparent
              onPress={() => goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
            </View>
          </Left>
          <Body style={{ flex: 0.6 }}>
            <Title>Thông tin ứng dụng</Title>
          </Body>
          <Right style={{ flex: 0.2 }}/>
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
                <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{appVersionName}</Text>
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
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Số ĐH </Text>
                </View>
              </View>

              <View style={HomeStyles.cardItemRight}>
                <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{ordersNum} (Lấy: {pickNum} Giao: {deliverNum} Trả: {returnNum})</Text>
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
            <CardItem style={{ backgroundColor: Colors.row }}>
              <View style={HomeStyles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Full date</Text>
                </View>
              </View>

              <View style={HomeStyles.cardItemRight}>
                <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{allDate}</Text>
              </View>
            </CardItem>
            <CardItem style={{ backgroundColor: Colors.row }}>
              <View style={HomeStyles.cardItemLeft}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>Reset date</Text>
                </View>
              </View>

              <View style={HomeStyles.cardItemRight}>
                <Text style={{ fontWeight: 'bold', color: '#00b0ff' }}>{resetDate}</Text>
              </View>
            </CardItem>
          </Card>
          {/* <TouchableOpacity
            onPress={() => Clipboard.setString(tripCode + '' + userId)}
          >
          <Text>*Nhấn để copy</Text>
          </TouchableOpacity> */}
          {/* <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#00b0ff', padding: 4, borderRadius: 4, margin: 1 }}
              onPress={() => this.props.pdListFetch({ all: true })}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Cập nhật dữ liệu</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#00b0ff', padding: 4, borderRadius: 4, margin: 1 }}
              onPress={() => this.props.pdListFetch({ softReset: true, all: true })}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Reset & Cập nhật dữ liệu</Text>
            </TouchableOpacity>
          </View> */}
            
          
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
  const { tripCode, pdsItems, isTripDone, lastUpdatedTime, allDate, resetDate } = pd;
  return { userId, tripCode, pdsItems, isTripDone, lastUpdatedTime, allDate, resetDate };
};

export default connect(mapStateToProps, {pdListFetch})(AboutScreen);
