let instance = null;
class ShareVariables {
  constructor() {
    if (!instance) {
          instance = this;
    }
    return instance;
  }

  BaseInfo = {
    ApiKey: 'MiNyd2FrbnFScWVzU3MjRw==\n', 
    ApiSecretKey: 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=\n', 
    VersionCode: 63
  }

  LoginHeader = {
    'X-Auth': null,
    // 'X-HubId': '',
  }

  setLoginInfo( 
    SessionToken, 
    ApiKey = 'MiNyd2FrbnFScWVzU3MjRw==\n', 
    ApiSecretKey = 'QkQ1NjRCOTdGRDk2NzI3RUJEODk5NTcyOTFFMjk2MTE=\n', 
    VersionCode = 63) {
    this.LoginInfo = { SessionToken, ApiKey, ApiSecretKey, VersionCode };
  }
  getLoginInfo() {
    return this.LoginInfo;
  }
  
}
export default ShareVariables;
