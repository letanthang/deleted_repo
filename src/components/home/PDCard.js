import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Item } from 'native-base';

const PDCard = ({ type, upNumber, downNumber, onPress }) => {
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
    <TouchableOpacity 
            onPress={onPress}
    >
      <Card>
        <CardItem>
          <View style={styles.cardItemLeft}>
            <View>
              <Text style={{ fontWeight: 'bold', color: cardTitleColor }}>
                {cardTitle}
              </Text>
              <Text>
                Hoàn thành: {upNumber}
              </Text>
              <Text>
                Tổng số: {downNumber}
              </Text>
            </View>
          </View>
          <View style={styles.cardItemRight}>
            <Item rounded style={{ height: 55, width: 55 }}>
              <View style={{ marginTop: -2, marginLeft: 15 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{upNumber}</Text>
              </View>
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 12, fontWeight: '200', color: '#ADADAD' }}>/{downNumber}</Text>
              </View>
            </Item>
          </View>
        </CardItem>
      </Card>
    </TouchableOpacity>
  );
};

const styles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
};

export default PDCard;
