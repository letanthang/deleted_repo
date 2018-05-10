import { Platform } from 'react-native';

const darkTheme = {
  background: '#272727',
  purple: '#9677ff',
  veryLight: '#f0f0f0',
  light: '#8a8a8a',
  dark: '#656565',
  darkest: '#3d3d3d',
  strongPurple: '#6039e3'
};

let ColorsDefault = {
  theme: '#005939',
  normal: '#202430',
  weak: '#202430fa',
  background: '#EAEFF2',
  row: 'white',
  rowDivider: '#4552658f',
  rowHeader: '#eee',
  headerNormal: '#1C1C1C',
  headerActive: '#4EA1FD',
  headerBackground: '#F8F8F8',
  footerNormal: this.headerNormal,
  footerActive: this.headerActive,
  footerBackground: '#F8F8F8'
};
const ColorsAndroid = {
  headerNormal: '#fff',
  headerActive: '#00f',
  headerBackground: '#005939',
  footerNormal: '#878787',
  footerActive: ColorsDefault.theme,
  footerBackground: 'white'
};
if (Platform.OS === 'android') ColorsDefault = { ...ColorsDefault, ...ColorsAndroid };

const ColorsDark = {
  normal: darkTheme.light,
  weak: darkTheme.dark,
  background: darkTheme.background,
  row: darkTheme.darkest,
  rowDivider: darkTheme.veryLight,
  rowHeader: '#eee',
  headerNormal: darkTheme.veryLight,
  headerActive: darkTheme.purple,
  footerNormal: this.headerNormal,
  footerActive: this.headerActive,
  footerBackground: darkTheme.background
};

export const Theme = 'default';
export const Colors = ColorsDefault;

export const Styles = {
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
  actionAllWrapperStyle: { 
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#f5f5f5',
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
  signatureStyle: {
    justifyContent: 'center',
    height: 180,
    marginLeft: 16,
    marginRight: 16,
    borderColor: Colors.rowDivider,
    borderWidth: 1,
    backgroundColor: 'white'
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
  rowHeaderConfirm: {
    backgroundColor: Colors.rowHeader,
    padding: 4,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'flex-start'
  },
  col1Style: {
    width: 150,
    alignSelf: 'center'
  },
  col1ConfirmStyle: {
    width: 150,
    alignSelf: 'center',
    marginRight: 16
  },
  actionItemStyle: {
    paddingTop: 6,
    paddingLeft: 10,
    paddingBottom: 2,
    justifyContent: 'space-between',
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
  },
  leftStyle: {
    flex: 0.11
  },
  bodyStyle: {
    flex: 0.64
  },
  rightStyle: {
    flex: 0.25
  },
  updateButtonStyle: {
    margin: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1, 
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
    borderWidth: 1,
    borderRadius: 5,
  },
  addButtonStyle: {
    margin: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 95, 
    height: 40,
    backgroundColor: '#1FAA61',
    borderColor: '#1FAA61',
    borderWidth: 1,
    borderRadius: 5,
  },
  addButtonDisableStyle: {
    margin: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 95, 
    height: 40,
    backgroundColor: '#555',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    padding: 10,
    paddingBottom: 6,
    flexDirection: 'row',
  },
  headerText0: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.theme,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#808080'
  },
};

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
  orderWrapperStyle: {
    ...Styles.orderWrapperStyle,
    marginTop: 4,
    marginLeft: 0,
    marginRight: 0,
  },
  orderWrapperFirstStyle: {
    ...Styles.orderWrapperStyle,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  },
  col1Style: {
    flex: 1,
    alignSelf: 'center'
  },
  col2Style: {
    justifyContent: 'center'
  },
  content: {
    // paddingBottom: 5,
    // backgroundColor: '#fff',
  },
  header: {
    backgroundColor: Colors.background,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#CFCFD1',
    flexDirection: 'row'
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CFCFD1',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#808080'
  },
};
