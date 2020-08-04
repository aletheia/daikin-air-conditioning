import invert = require('lodash.invert');
import {FanRate} from './FanRate';

export type SerializedData = {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | {[key: string]: number | string};
};

export interface Mapping {
  [key: string]: string;
}
export interface DataConfig {
  value?: string;
  apiValue?: string;
  mapping: Mapping;
}

export type Config = Omit<DataConfig, 'mapping' | 'mappingKey'>;

export abstract class Data {
  protected mapping: Mapping = {};
  protected inverseMapping: {[key: string]: string};
  protected value?: string;

  constructor(config: DataConfig) {
    this.mapping = config.mapping;
    this.inverseMapping = invert(this.mapping);

    this.value = config.value;
    if (config.apiValue) {
      this.value = this.inverseMapping[config.apiValue];
    }
  }
  get() {
    return this.value;
  }
  set(value: string) {
    this.value = value;
  }
  serialized() {
    if (this.value) return this.mapping[this.value];
    else {
      return '';
    }
  }
}
