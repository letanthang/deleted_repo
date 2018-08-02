import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import * as Progress from 'react-native-progress';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Styles, Colors } from '../../Styles';

class PDCard extends Component {
  constructor(props) {
    super(props);
    const { upNumber, downNumber, delay } = props;
    if (delay) {
      this.state = { upNumber: 0, downNumber: 0 };
      setTimeout(() => this.setState({ upNumber, downNumber }), 500);
    } else {
      this.state = { upNumber, downNumber };
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { upNumber, downNumber, delay } = nextProps;
      if (delay) {
        this.setState({ upNumber: 0, downNumber: 0 });
        setTimeout(() => this.setState({ upNumber, downNumber }), 500);
      } else {
        this.setState({ upNumber, downNumber });
      }
    }
  }
  render() {
    const { type, onPress, color } = this.props;
    const { upNumber, downNumber } = this.state;

    let cardTitle = '';
    let cardTitleColor = '';

    switch (type) {
      case 'pick':
        cardTitle = 'Lấy hàng';
        cardTitleColor = '#12cd72';
        break;
      case 'delivery':
        cardTitle = 'Giao hàng';
        cardTitleColor = '#ff6e40';
        break;
      case 'return':
        cardTitle = 'Trả hàng';
        cardTitleColor = 'grey';
        break;
      case 'cvs':
        cardTitle = 'Luân chuyển';
        cardTitleColor = '#397AF2';
        break;
      default:
        cardTitle = 'Trả hàng';
        cardTitleColor = 'grey';
    }

    return (
      <TouchableOpacity 
              onPress={onPress}
      >
        <Card>
          <CardItem style={{ backgroundColor: Colors.row, borderLeftWidth: 2, borderLeftColor: cardTitleColor }}>
            <View style={styles.cardItemLeft}>
              <View>
                <Text style={{ fontWeight: 'bold', color: cardTitleColor }}>
                  {cardTitle}
                </Text>
                <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 4 }}>
                  <IC name='map-marker' size={15} style={{ width: 20 }} />
                  <View style={{ width: 80 }}>
                    <Text style={Styles.normalColorStyle}>Số điểm</Text>
                  </View>
                  <Text style={Styles.normalColorStyle}>{this.props.upNumber}/{this.props.downNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 4 }}>
                  <IC name='package-variant' size={16} style={{ width: 20 }} />
                  <View style={{ width: 80 }}>
                    <Text style={Styles.normalColorStyle}>Số đơn</Text>
                  </View>
                  <Text style={Styles.normalColorStyle}>{this.props.upNumber2}/{this.props.downNumber2}</Text>
                </View>
                
              </View>
            </View>
            <View style={styles.cardItemRight}>
              <Progress.Circle 
                size={60}
                progress={downNumber === 0 ? 0 : upNumber / downNumber} 
                indeterminate={false}
                color={color}
                unfilledColor='#F5F5F5'
                borderWidth={0}
              >
              <View style={styles.progressTextContainer}>
                <View style={styles.progressText}>
                  <View style={{ marginTop: 0, marginLeft: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{upNumber}</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: '200', color: '#ADADAD' }}>/{downNumber}</Text>
                  </View>
                </View>
              </View>
              </Progress.Circle>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }

}

const styles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  progressText: {
    flexDirection: 'row'
  },
  progressTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default PDCard;
