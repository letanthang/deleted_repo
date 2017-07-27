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
                Hoàn thành
              </Text>
              <Text>
                Tổng số
              </Text>
            </View>
          </View>
          <View style={styles.cardItemRight}>
            <Item rounded style={{ height: 55, width: 55 }}>
              <View style={{ marginTop: -10, marginLeft: 5 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{upNumber}</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12 }}>/{downNumber}</Text>
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
