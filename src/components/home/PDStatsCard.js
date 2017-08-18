import React, { Component } from 'react';
import { View } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import { Styles } from '../../Styles';

class PDStatsCard extends Component {
  render() {
    //const { type, onPress, color } = this.props;
    const { type, upNumber, downNumber, percentage } = this.props;

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
      default:
        cardTitle = 'Trả hàng';
        cardTitleColor = 'grey';
    }

    return (
      <Card>
        <CardItem>
          <View style={styles.cardItemLeft}>
            <View>
              <Text style={{ fontWeight: 'bold', color: cardTitleColor }}>
                {cardTitle}
              </Text>
              <Text
                style={Styles.normalColorStyle}
              >
                Thành công: {upNumber} đơn
              </Text>
              <Text
                style={Styles.normalColorStyle}
              >
                Tổng số: {downNumber} đơn
              </Text>
            </View>
          </View>
          <View style={styles.cardItemRight}>
            <Text 
              style={{ color: cardTitleColor, fontSize: 24, fontWeight: '500' }}
            >
              {percentage}%
            </Text>
          </View>
        </CardItem>
      </Card>
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

export default PDStatsCard;
