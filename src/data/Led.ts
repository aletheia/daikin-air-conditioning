import {Data, Config, Mapping} from './Data';
import merge = require('lodash.merge');

export enum LedValue {
  Off = 'off',
  On = 'on',
}

export class Led extends Data {
  constructor(config?: Config) {
    const mapping: Mapping = {};
    mapping[LedValue.On] = '1';
    mapping[LedValue.Off] = '0';
    const classConfig = merge({mapping}, config);
    super(classConfig);
  }
}
