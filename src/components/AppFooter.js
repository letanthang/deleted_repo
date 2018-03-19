import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Footer, FooterTab } from 'native-base';
import FooterButton from './FooterButton';

const pickIcon = require('../../resources/pick.png');
const pickIconActive = require('../../resources/pick_active.png');
const deliveryIcon = require('../../resources/delivery.png');
const deliveryIconActive = require('../../resources/delivery_active.png');

const returnIcon = require('../../resources/return.png');
const returnIconActive = require('../../resources/return_active.png');
const allIcon = require('../../resources/all.png');
const allIconActive = require('../../resources/all_active.png');
const accountIcon = require('../../resources/account.png');
const accountIconActive = require('../../resources/account_active.png');

const navigate = (dispatch, routeName) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName })
    ]
  });
  dispatch(resetAction);
};

class AppFooter extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.navigation.state.routeName === nextProps.navigation.state.routeName) {
      return false;
    }
    return true;
  }
  render() {
    const dispatch = this.props.navigation.dispatch;
    const currentRoute = this.props.navigation.state.routeName;
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
            normalImage={pickIcon}
            activeImage={pickIconActive}
            normalIcon='package-variant'
            activeIcon='package-variant'
            active={currentRoute === 'TripList'}
            onPress={() => navigate(dispatch, 'TripList')}
          />
          <FooterButton
            text='Giao'
            normalImage={deliveryIcon}
            activeImage={deliveryIconActive}
            normalIcon='truck-delivery'
            activeIcon='truck-delivery'
            active={currentRoute === 'DeliveryList'}
            onPress={() => navigate(dispatch, 'DeliveryList')}
          />
          
          <FooterButton
            text='Trả'
            normalImage={returnIcon}
            activeImage={returnIconActive}
            normalIcon='truck-delivery'
            activeIcon='truck-delivery'
            flip
            active={currentRoute === 'ReturnList'}
            onPress={() => navigate(dispatch, 'ReturnList')}
          />
          <FooterButton
            text='Tất cả'
            normalImage={allIcon}
            activeImage={allIconActive}
            normalIcon='all-inclusive'
            activeIcon='all-inclusive'
            flip
            active={currentRoute === 'OrderList'}
            onPress={() => navigate(dispatch, 'OrderList')}
          />
          <FooterButton
            text='Tôi'
            normalImage={accountIcon}
            activeImage={accountIconActive}
            normalIcon='account-outline'
            activeIcon='account'
            active={false}
          />
        </FooterTab>
      </Footer>
    );
  } 
}

export default AppFooter;
