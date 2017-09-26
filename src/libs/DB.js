import Realm from 'realm';

const UserInfoSchema = {
  name: 'UserInfo',
  properties: {
    Id: 'int',
    Info: 'string'
  }
};

const GroupSchema = {
  name: 'Group',
  properties: {
    GroupName: 'string'
  }
};

const realmDB = new Realm({ schema: [GroupSchema, UserInfoSchema] });

export const writeMoreInfo = (Id, MoreInfo) => {
  Realm.open({ schema: [UserInfoSchema] })
  .then(realm => {
    realm.write(() => {
      const Info = JSON.stringify(MoreInfo);
      realm.create('UserInfo', {
        Id,
        Info
      });
    });
  });
};

export const addGroupAsync = (GroupName) => {
  Realm.open({ schema: [GroupSchema] })
  .then(realm => {
    realm.write(() => {
      realm.create('Group', {
        GroupName
      });
    });
  });
};

export const getGroupsAsync = () => {
  Realm.open({ schema: [GroupSchema] })
  .then(realm => {
    let groups = realm.objects('Groups');
  });
};

export const addGroup = (GroupName) => {
  realmDB.write(() => {
    realmDB.create('Group', { GroupName });
  });
};

export const getGroups = () => {
  let groups = realmDB.objects('Groups');
  return groups;
};
