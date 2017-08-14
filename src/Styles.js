import { StyleSheet } from 'react-native';

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
  weakColor: {
    color: '#4552658f'
  },
  normalColor: {
    color: '#455265'
  },
  orderWrapperStyle: { 
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8
  },
  itemStyle: {
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row'
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
    borderBottomWidth: 0.5
  },
  rowHeaderStyle: {
    backgroundColor: '#06B2F5',
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
