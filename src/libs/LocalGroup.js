import { AsyncStorage } from 'react-native';

class LocalGroup {
  static async addGroup(group) {
    try {
      const groups = await this.getGroups();
      groups.push(group);
      await AsyncStorage.setItem('localgroup', groups);
    } catch (error) {
      console.log('addGroup failed with error=');
      console.log(error);
    }
  }
  static async getGroups() {
    try {
      const groups = await AsyncStorage.getItem('localgroup');
      return groups;
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
  static async setOrderGroup({ OrderID, group }) {
    try {
      const orderGroups = await this.getOrderGroups();
      orderGroups[OrderID] = group;
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
  static async getOrderGroups() {
    try {
      const orderGroups = await AsyncStorage.getItem('order-group');
      return orderGroups;
    } catch (error) {
      console.log('loadLoginInfo failed with error=');
      console.log(error);
    }
  }
}

export default LocalGroup;
