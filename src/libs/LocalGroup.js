// localGroup = { 
//   1000 : { 
//     groups : [ nhom1, nhom2], 
//     order-group: { 
//       24123: 'nhom1', 
//       56712: 'nhom2'
//     } 
//   } 
// }

// getGroups === undefined -> resetGroup
//   resetGroup = setGroup = { mpdsid: { groups:[], orderGroup: {} } }
// getmpdsid != current mpdsid -> resetGroup

 
import { AsyncStorage } from 'react-native';

class LocalGroup {
  static dbName='localgroup1'
  static db = { groups: [], orderGroup: {} };
  static async getLocalDB() {
    try {
      const db = await AsyncStorage.getItem(this.dbName);
      if (db) {
        this.db = JSON.parse(db); 
        return this.db; 
      }

      const json = { groups: [], orderGroup: {} };
      await AsyncStorage.setItem(this.dbName, JSON.stringify(json));
      this.db = json;
      return this.db;
    } catch (error) {
      // log error
    }
  }

  static async resetDB() {
    try {
      //this.db = { groups: [], orderGroup: {} };
      await AsyncStorage.removeItem(this.dbName);
      this.getLocalDB();
    } catch (error) {
      // log error
    }
  }

  static async saveDB() {
    try {
      await AsyncStorage.setItem(this.dbName, JSON.stringify(this.db));
    } catch (error) {
      // log error
    }
  }

  static async addGroup(group) {
    try {
      this.db.groups.push(group);
      await this.saveDB();
    } catch (error) {
      // log error
    }
  }
  static async setGroups(groups) {
    try {
      this.db.groups = groups;
      await this.saveDB();
    } catch (error) {
      //log error
    }
  }
  static getGroups() {
    try {
      return this.db.groups;
    } catch (error) {
      // log error
    }
  }
  static async setOrderGroup({ orderCode, group }) {
    try {
      this.db.orderGroup[orderCode] = group;
      await this.saveDB();
    } catch (error) {
      //log error
    }
  }
  static async setOrdersGroups(orderGroup) {
    try {
      this.db.orderGroup = { ...this.db.orderGroup, ...orderGroup };
      await this.saveDB();
    } catch (error) {
      //log error
    }
  }
  static getOrderGroups() {
    try {
      return this.db.orderGroup;
    } catch (error) {
      // log error
    }
  }
}

export default LocalGroup;
