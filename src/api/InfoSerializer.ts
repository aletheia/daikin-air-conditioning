import {DeviceInfo} from '../data/DeviceInfo';

const diMapping: {[key: string]: string} = {
  type: 'type',
  subType: 'subtype',
  region: 'reg',
  destination: 'dst',
  version: 'ver',
  location: 'location',
  name: 'name',
  icon: 'icon',
  method: 'method',
  port: 'port',
  userId: 'id',
  userPassword: 'pw',
  lpwFlag: 'lpw_flag',
  adpKind: 'adp_kind',
  pv: 'pv',
  cpv: 'cpv',
  led: 'led',
  enSetzone: 'en_setzone',
  macAddress: 'mac',
  adpMode: 'adp_mode',
  enHol: 'en_hol',
  groupName: 'grp_name',
  enGroup: 'en_grp',
};

export const keyMap = (key: string): string => {
  return diMapping[key];
};

export const deserialize = (serialized: {
  [key: string]: string;
}): DeviceInfo => {
  const di: DeviceInfo = {
    type: serialized[diMapping.type],
    subType: serialized[diMapping.subType],
    region: serialized[diMapping.region],
    name: decodeURI(serialized[diMapping.name]),
    communicationMethod: serialized[diMapping.method],
    port: serialized[diMapping.port],
    userId: serialized[diMapping.userId],
    userPassword: serialized[diMapping.userPassword],
    macAddress: serialized[diMapping.macAddress],
    version: serialized[diMapping.version],
    //TODO: Complete implementation with missing params after having a clear understanding of what they mean
  };
  return di;
};
