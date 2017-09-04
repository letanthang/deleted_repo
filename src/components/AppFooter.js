import React from 'react';
import { Footer, FooterTab } from 'native-base';
import FooterButton from './FooterButton';

const AppFooter = () => {
  return (
    <Footer>
      <FooterTab>
        <FooterButton
          text='Nhà'
          normalIcon='home'
          activeIcon='home'
          active={false}
        />
        <FooterButton
          text='Lấy'
          normalIcon='package-variant'
          activeIcon='package-variant'
          active={false}
        />
        <FooterButton
          text='Giao'
          normalIcon='truck-delivery'
          activeIcon='truck-delivery'
          active={true}
        />
        
        <FooterButton
          text='Trả'
          normalIcon='truck-delivery'
          activeIcon='truck-delivery'
          flip
          active={false}
        />
        <FooterButton
          text='Tôi'
          normalIcon='account-outline'
          activeIcon='account'
          active={true}
        />
      </FooterTab>
    </Footer>
  );
};

export default AppFooter;
