
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  Right, Left, Body,
  Icon, Button, Title, Text,
  Header, Item, Input
} from 'native-base';
import { Styles, Colors } from '../../Styles';

class AppHeader extends Component {
  render() {
    const { showSearch, keyword, done, layoutMode, onGroup, onChange, onGoBack, onToggleLayoutPress } = this.props;
    if (showSearch) {
      return (
        <Header searchBar>
          <Item
            style={{ borderRadius: 4, backgroundColor: Colors.background }} 
          >
            <Icon name="search" size={10} />
            <Input 
              placeholder="Lọc tên shop ..." value={keyword} 
              onChangeText={(text) => { 
                  onChange({ keyword: text });
              }}
              autoFocus
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => onChange({ keyword: '' })}
              style={{ padding: 8 }}
            >
              <IC 
                name="close-circle-outline" size={14} 
              />
            </TouchableOpacity>
            
          </Item>
          <Right style={{ flex: 0 }} >
            <Button
              transparent
              style={{ marginLeft: 0 }}
              onPress={() => {
                onChange({ showSearch: !showSearch, keyword: '' });
              }}
            >
              <Text uppercase={false}>Huỷ</Text>
            </Button>
          </Right>
        </Header>
      );
    }

    return (
      <Header>
        <Left style={Styles.leftStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            transparent
            onPress={() => onGoBack()}
          >
            <Icon name="arrow-back" />
          </Button>
          </View>
          
        </Left>
        <Body style={Styles.bodyStyle}>
          <Title>Lấy</Title>
        </Body>
        <Right style={Styles.rightStyle}>
          <Button
            transparent
            onPress={() => onChange({ showSearch: !showSearch })}
          >
            <Icon name="search" />
          </Button>
          { layoutMode === false ?
          <Button
            transparent
            onPress={() => onChange({ done: !done })}
          >
            <IC name="playlist-check" size={24} color={done ? Colors.headerActive : Colors.headerNormal} />
          </Button>
          : null}
          { layoutMode ?
          <Button 
            transparent
            onPress={() => onGroup()}
          >
            <IC name="group" size={22} color={Colors.headerNormal} />
          </Button>
          : null}
          <Button 
            transparent
            onPress={onToggleLayoutPress.bind(this)}
          >
            <IC name="apple-keyboard-option" size={22} color={Colors.headerNormal} />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default AppHeader;
