import {Logger} from 'winston';
import {DaikinApi, ApiProps} from './api/DaikinApi';
import merge = require('lodash.merge');
import {Mode, ModeValue, Power, PowerValue} from './data';
import {FanDirection, FanDirectionValue} from './data/FanDirection';
import {FanRate} from './data/FanRate';
import {DeviceInfo} from './data/DeviceInfo';
import {DeviceState, serialize} from './data/DeviceState';
import {SerializedData} from './data/Data';

export const DeviceType = {
  AirConditioning: 'aircon',
};

export class Device {
  protected logger?: Logger;
  protected api: DaikinApi;
  protected info: DeviceInfo;
  protected state?: DeviceState;

  constructor(api: DaikinApi, logger?: Logger) {
    this.logger = logger;
    this.api = api;
    this.info = {};
  }

  async init() {
    this.logger && this.logger.info('Initializing device');
    await this.deviceInfo();
    await this.updateState();
    //validateTemperature(this.state.temperature);
  }

  async deviceInfo() {
    this.logger && this.logger.info('Getting device info');
    const basicInfo = await this.api.getBasicInfo();
    const modelInfo = await this.api.getModelInfo();
    this.info = merge(this.info, basicInfo, modelInfo);
  }

  async updateState() {
    const state = await this.api.getStateInfo();
    this.state = merge(this.state, state);
  }

  async switchOn() {
    await this.setStateInfo({power: new Power({value: PowerValue.On})});
  }
  async switchOff() {
    await this.setStateInfo({power: new Power({value: PowerValue.Off})});
  }
  async setTemperature(value: number) {
    await this.setStateInfo({temperature: value});
  }
  async setMode(mode: Mode) {
    await this.setStateInfo({mode});
  }
  async setFan(
    rate: FanRate,
    direction: FanDirection = new FanDirection({
      value: FanDirectionValue.No_Motion,
    })
  ) {
    await this.setStateInfo({
      fanRate: rate,
      fanDirection: direction,
    });
  }

  protected async setStateInfo(info: Partial<DeviceState>) {
    await this.updateState();
    await this.api.setStateInfo(merge(this.state, info));
  }

  async getState(): Promise<DeviceState> {
    await this.updateState();
    if (!this.state) {
      throw new Error('Device is in an inconsistent state');
    }
    return this.state;
  }

  async getInfo(): Promise<DeviceInfo> {
    await this.deviceInfo();
    return this.info;
  }

  async serialize(): Promise<{info: SerializedData; state: SerializedData}> {
    const state = await this.getState();
    const info = (await this.getInfo()) as SerializedData;
    return {info, state: serialize(state)};
  }

  static async getDevice(props: ApiProps, logger?: Logger): Promise<Device> {
    const api = new DaikinApi(props);
    const device = new Device(api, logger);
    await device.init();
    return device;
  }
}

export const validateTemperature = (
  value: number,
  mode: Mode = new Mode({value: ModeValue.Auto})
) => {
  if (
    (mode.get() === ModeValue.Auto && value >= 18 && value <= 31) ||
    (mode.get() === ModeValue.Cold && value >= 18 && value <= 33) ||
    (mode.get() === ModeValue.Hot && value >= 10 && value <= 31)
  ) {
    return value;
  } else {
    throw new Error(`Temperature value is not valid. (value: ${value})`);
  }
};
