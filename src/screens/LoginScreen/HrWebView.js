import React, { Component } from 'react';
import { WebView } from 'react-native';
import CookieManager from 'react-native-cookies';

//staging
// const authenUri = 'http://103.20.148.181:8099/Home/Login?AppKey=FjDA32C152Y49845801B597B4D4BC10809C3D&returnUrl=http://staging.lastmile.ghn.vn/sso-login';
//prod
const authenUri = 'https://hr.ghn.vn/Home/Login?AppKey=BB17y1A9A0128b7677C940784CE11A28DE2B3&returnUrl=http://staging.lastmile.ghn.vn/sso-login';

class HrWebView extends Component {
  state = {
    cookies    : {},
    webViewUrl : ''
  }
  componentWillMount() {
    CookieManager.clearAll();
  }
  onNavigationStateChange = (webViewState) => {
    const { url } = webViewState;

    // when WebView.onMessage called, there is not-http(s) url
    if(url.includes('http')) {
      // alert(url);
      this.setState({ webViewUrl: url })
    }
  }
  _checkNeededCookies = () => {
    const { cookies, webViewUrl } = this.state;
    
    if (webViewUrl.includes('lastmile.ghn.vn/sso-login')) {
        const pos = webViewUrl.indexOf('?t62=')
        if (pos > 0) {
          const t62 = webViewUrl.substr(pos + 5, 1000);
          // alert('Dang nhap voi t62=' + t62);
          this.props.loginSuccess(t62)
        }
        // if (cookies['f2354167']) {}
    }
  }

  _onMessage = (event) => {
    const { data } = event.nativeEvent;
    const cookies  = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`

    cookies.forEach((cookie) => {
        const c = cookie.trim().split('=');
        const new_cookies = this.state.cookies;
        new_cookies[c[0]] = c[1];
        this.setState({ cookies: new_cookies });
    });

    this._checkNeededCookies();
  }

  render() {
    const jsCode = "document.cookie='f2354167=; expires=Thu, 01 Jan 1970 00:00:00 GMT';window.postMessage(document.cookie)"
    // let jsCode = "window.postMessage(document.cookie= 'f2354167=; expires=Thu, 01 Jan 1970 00:00:00 GMT')"; // if you need to write some cookies, not sure if it goes to shared cookies, most probably no :)
    return (
      <WebView
        source={{ uri: authenUri }}
        onNavigationStateChange={this.onNavigationStateChange}
        onMessage={this._onMessage}
        injectedJavaScript={jsCode}
        style={{ flex: 1 }}
      />
    );
  }
}

export default HrWebView;
