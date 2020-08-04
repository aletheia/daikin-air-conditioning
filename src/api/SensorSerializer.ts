import isNumber = require('lodash.isnumber');
import {DeviceInfo} from '../data/DeviceInfo';
import {string2bool} from './Serializer';

const sMapping = {
  homeTemperature: 'htemp',
  outsideTemperature: 'otemp',
  homeHumidity: 'hhum',
  error: 'error',
};

export const deserialize = (serialized: {
  [key: string]: string;
}): DeviceInfo => {
  const ds: DeviceInfo = {
    error: string2bool(serialized[sMapping.error]),
  };
  if (isNumber(serialized[sMapping.homeTemperature])) {
    ds.homeTemperature = parseFloat(serialized[sMapping.homeTemperature]);
  }
  if (isNumber(serialized[sMapping.outsideTemperature])) {
    ds.outsideTemperature = parseFloat(serialized[sMapping.outsideTemperature]);
  }
  if (isNumber(serialized[sMapping.homeHumidity])) {
    ds.homeHumidity = parseFloat(serialized[sMapping.homeHumidity]);
  }
  return ds;
};
