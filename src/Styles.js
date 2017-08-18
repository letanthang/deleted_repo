import { StyleSheet } from 'react-native';

export const Colors = {
  normalColor: '#455265',
  weakColor: '#4552658f'
};

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
    color: Colors.weakColor
  },
  normalColorStyle: {
    color: Colors.normalColor
  },
  orderWrapperStyle: { 
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 8
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
    borderColor: '#4552658f',
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
    borderColor: '#4552658f'
  },
  rowHeaderStyle: {
    backgroundColor: '#eee',
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
