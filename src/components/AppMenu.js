import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import IC from 'react-native-vector-icons/MaterialCommunityIcons';
const renderTouchable = () => <TouchableOpacity />;

const AppMenu = () => (
  <Menu>
    <MenuTrigger renderTouchable={renderTouchable}>
      <IC name='dots-horizontal' size={28} />
    </MenuTrigger>
    <MenuOptions>
      <MenuOption value={1} renderTouchable={renderTouchable}>
        <Text>One</Text>
      </MenuOption>
      <MenuOption value={2} renderTouchable={renderTouchable}>
        <Text>Two</Text>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

export default AppMenu;
