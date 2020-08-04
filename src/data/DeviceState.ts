import {Power} from './Power';
import {Mode} from './Mode';
import {FanRate} from './FanRate';
import {FanDirection} from './FanDirection';
import {SerializedData} from './Data';
import {startTimer} from 'winston';
import {string2bool} from '../api/Serializer';

export interface DeviceState {
  power: Power;
  mode: Mode;
  temperature: number;
  humidity?: number;
  alert: boolean;
  fanRate: FanRate;
  fanDirection?: FanDirection;
  latestTemperature?: {[key: string]: number};
  latestFanRate?: {[key: string]: FanRate};
  latestFanDirection?: {[key: string]: FanDirection};
}

export const serialize = (state: DeviceState): SerializedData => {
  const serialized: SerializedData = {
    power: state.power.get(),
    mode: state.mode.get(),
    temperature: state.temperature,
    humidity: state.humidity,
    alert: state.alert,
    fanRate: state.fanRate.get(),
    fanDirection: state.fanDirection ? state.fanDirection.get() : undefined,
    latestTemperature: state.latestTemperature,
  };
  if (state.latestFanRate) {
    const list: {[key: string]: string} = {};
    for (const key in state.latestFanRate) {
      list[key] = state.latestFanRate[key].get() as string;
    }
    serialized['latestFanRate'] = list;
  }
  if (state.latestFanDirection) {
    const list: {[key: string]: string} = {};
    for (const key in state.latestFanDirection) {
      list[key] = state.latestFanDirection[key].get() as string;
    }
    serialized['latestFanDirection'] = list;
  }

  return serialized;
};

export const deserialize = (serializedState: SerializedData): DeviceState => {
  const {
    power,
    mode,
    temperature,
    humidity,
    alert,
    fanRate,
    fanDirection,
    latestTemperature,
    latestFanRate,
    latestFanDirection,
  } = serializedState;

  if (!power || !mode || !temperature) {
    throw new Error('Serialized data does not comply to object schema');
  } else {
    const state: DeviceState = {
      power: new Power({value: power as string}),
      mode: new Mode({value: mode as string}),
      temperature: temperature as number,
      humidity: humidity as number,
      alert: alert ? (alert as boolean) : false,
      fanRate: new FanRate({value: fanRate as string}),
    };
    if (fanDirection) {
      state['fanDirection'] = new FanDirection({value: fanDirection as string});
    }

    if (latestTemperature) {
      state['latestTemperature'] = latestTemperature as {[key: string]: number};
    }
    if (latestFanRate) {
      const list: {[key: string]: FanRate} = {};
      const lfr = latestFanRate as {[key: string]: string};
      for (const key in lfr) {
        const value = lfr[key];
        list[key] = new FanRate({value});
      }
      state.latestFanRate = list;
    }
    if (latestFanDirection) {
      const list: {[key: string]: FanRate} = {};
      const lfd = latestFanDirection as {[key: string]: string};
      for (const key in lfd) {
        const value = lfd[key];
        list[key] = new FanDirection({value});
      }
      state.latestFanDirection = list;
    }

    return state;
  }
};
