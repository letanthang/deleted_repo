import { StyleSheet } from 'react-native';

export const Theme = 'dark';

export const darkTheme = {
  background: '#272727',
  purple: '#9677ff',
  veryLight: '#f0f0f0',
  light: '#8a8a8a',
  dark: '#656565',
  darkest: '#3d3d3d',
  strongPurple: '#6039e3'
};

const Colors0 = {
  normal: '#455265',
  weak: '#4552658f',
  background: '#eee',
  row: 'white',
  rowDivider: '#4552658f',
  rowHeader: '#eee'
};

const Colors1 = {
  normal: darkTheme.light,
  weak: darkTheme.dark,
  background: darkTheme.background,
  row: darkTheme.darkest,
  rowDivider: darkTheme.veryLight,
  rowHeader: '#eee'
};

export const Colors = Colors1;

export const Styles = StyleSheet.create({
  bigTextStyle: {
    fontSize: 17,
    fontWeight: '600'
  },
  midTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    flex: 1
  },
  smallTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
    flex: 1
  },
  weakColorStyle: {
    color: Colors.weak
  },
  normalColorStyle: {
    color: Colors.normal
  },
  orderWrapperStyle: { 
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 8,
    backgroundColor: Colors.row,
    borderRadius: 2
  },
  itemStyle: {
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row'
  },
  item2Style: {
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowStyle: {
    paddingTop: 14,
    paddingBottom: 6,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: Colors.rowDivider,
    borderBottomWidth: 1
  },
  rowLastStyle: {
    paddingTop: 14,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: Colors.rowDivider
  },
  rowHeaderStyle: {
    backgroundColor: Colors.rowHeader,
    padding: 4,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  col1Style: {
    width: 150,
    alignSelf: 'center'
  },
  actionItemStyle: {
    paddingTop: 6,
    paddingLeft: 10,
    paddingBottom: 2,
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  CheckBoxStyle: {
    backgroundColor: '#fff'
  },
  CheckBoxStyleDisable: {
    backgroundColor: '#ddd'
  },
  tripWrapperStyle: {
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 4,
    paddingBottom: 0,
    backgroundColor: Colors.row,
    borderRadius: 2
  }
});

export const HomeStyles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
};

export const OrderStyles = {
  cardItemLeft: {

  },
  cardItemRight: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  }
};

export const DeliverGroupStyles = {
  col1Style: {
    flex: 1,
    alignSelf: 'center'
  },
  col2Style: {
    justifyContent: 'center'
  }
};
