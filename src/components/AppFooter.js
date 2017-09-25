import React from 'react';
import { NavigationActions } from 'react-navigation';
import { Footer, FooterTab } from 'native-base';
import FooterButton from './FooterButton';

const navigate = (dispatch, routeName) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName })
    ]
  });
  dispatch(resetAction);
};

const AppFooter = ({ navigation }) => {
  console.log(navigation);
  const { dispatch } = navigation;
  const currentRoute = navigation.state.routeName;
  return (
    <Footer>
      <FooterTab>
        {/* <FooterButton
          text='Nhà'
          normalIcon='home'
          activeIcon='home'
          active={currentRoute === 'Home'}
          onPress={() => navigate(dispatch, 'Drawer')}
        /> */}
        <FooterButton
          text='Lấy'
          normalIcon='package-variant'
          activeIcon='package-variant'
          active={currentRoute === 'TripList'}
          onPress={() => navigate(dispatch, 'PickList')}
        />
        <FooterButton
          text='Giao'
          normalIcon='truck-delivery'
          activeIcon='truck-delivery'
          active={currentRoute === 'DeliveryList'}
          onPress={() => navigate(dispatch, 'DeliveryList')}
        />
        
        <FooterButton
          text='Trả'
          normalIcon='truck-delivery'
          activeIcon='truck-delivery'
          flip
          active={currentRoute === 'ReturnList'}
          onPress={() => navigate(dispatch, 'ReturnList')}
        />
        <FooterButton
          text='Tất cả'
          normalIcon='all-inclusive'
          activeIcon='all-inclusive'
          flip
          active={currentRoute === 'OrderList'}
          onPress={() => navigate(dispatch, 'OrderList')}
        />
        <FooterButton
          text='Tôi'
          normalIcon='account-outline'
          activeIcon='account'
          active={false}
        />
      </FooterTab>
    </Footer>
  );
};

export default AppFooter;
