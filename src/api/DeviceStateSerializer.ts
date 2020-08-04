import {apiString2json, json2apiString, string2bool} from './Serializer';
import {Power, Mode} from '../data';
import {FanRate} from '../data/FanRate';
import {FanDirection} from '../data/FanDirection';
import {DeviceState} from '../data/DeviceState';

const parseTemperature = (stringValue: string) => {
  const value = parseFloat(stringValue);
  if (isNaN(value)) {
    throw new Error('Temperature value is invalid');
  }
  return value;
};

export class DeviceStateSerializer {
  static apiKeyMapping: {[key: string]: string} = {
    power: 'pow',
    mode: 'mode',
    temperature: 'stemp',
    humidity: 'shum',
    latestTemperaturePrefix: 'dt',
    alert: 'alert',
    fanRate: 'f_rate',
    fanDirection: 'f_dir',
    latestFanRatePrefix: 'dfr',
    latestFanDirectionPrefix: 'dfd',
  };

  static serialize(
    deviceState: DeviceState,
    serializeHistory = false
  ): {[key: string]: string} {
    const {apiKeyMapping} = DeviceStateSerializer;
    const serialized: {[key: string]: string} = {};
    if (deviceState.power) {
      serialized[apiKeyMapping.power] = deviceState.power.serialized();
    }
    if (deviceState.mode) {
      serialized[apiKeyMapping.mode] = deviceState.mode.serialized();
    }
    if (deviceState.temperature) {
      serialized[apiKeyMapping.temperature] = `${deviceState.temperature}`;
    }
    if (deviceState.alert) {
      serialized[apiKeyMapping.alert] = deviceState.alert ? '1' : '0';
    }
    if (deviceState.fanRate) {
      serialized[apiKeyMapping.fanRate] = deviceState.fanRate.serialized();
    }
    serialized[apiKeyMapping.fanDirection] = deviceState.fanDirection
      ? deviceState.fanDirection.serialized()
      : '0';
    if (serializeHistory) {
      for (const key in deviceState.latestTemperature) {
        serialized[key] = `${deviceState.latestTemperature[key]}`;
      }
      for (const key in deviceState.latestFanRate) {
        serialized[key] = deviceState.latestFanRate[key].serialized();
      }
      for (const key in deviceState.latestFanDirection) {
        serialized[key] = deviceState.latestFanDirection[key].serialized();
      }
    }
    return serialized;
  }

  static serializeToString(deviceState: DeviceState): string {
    return json2apiString(DeviceStateSerializer.serialize(deviceState));
  }
  static deserialize(serializedState: {[key: string]: string}): DeviceState {
    const {apiKeyMapping} = DeviceStateSerializer;
    const ds: DeviceState = {
      power: new Power({apiValue: serializedState[apiKeyMapping.power]}),
      mode: new Mode({apiValue: serializedState[apiKeyMapping.mode]}),
      temperature: parseTemperature(serializedState[apiKeyMapping.temperature]),
      alert: string2bool(serializedState[apiKeyMapping.alert]),
      fanRate: new FanRate({
        apiValue: serializedState[apiKeyMapping.fanRate],
      }),
      fanDirection: serializedState[apiKeyMapping.fanDirection]
        ? new FanDirection({
            apiValue: serializedState[apiKeyMapping.fanDirection],
          })
        : undefined,
      latestTemperature: {},
      latestFanRate: {},
      latestFanDirection: {},
    };

    for (const key in serializedState) {
      if (
        key.startsWith(apiKeyMapping.latestTemperaturePrefix) &&
        ds.latestTemperature &&
        serializedState[key] !== '--'
      ) {
        delete ds.latestTemperature[key];
      }
      if (
        key.startsWith(apiKeyMapping.latestFanRatePrefix) &&
        ds.latestFanRate &&
        serializedState[key] !== '--'
      ) {
        delete ds.latestFanRate[key];
      }
      if (
        key.startsWith(apiKeyMapping.latestFanDirectionPrefix) &&
        ds.latestFanDirection &&
        serializedState[key] !== '--'
      ) {
        delete ds.latestFanDirection[key];
      }
    }
    return ds;
  }
  static deserializeFromString(serializedState: string): DeviceState {
    return DeviceStateSerializer.deserialize(apiString2json(serializedState));
  }
}
