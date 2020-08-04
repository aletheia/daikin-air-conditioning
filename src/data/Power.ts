import {Data, Config, Mapping} from './Data';
import merge = require('lodash.merge');

export enum PowerValue {
  On = 'on',
  Off = 'off',
}

export class Power extends Data {
  constructor(config?: Config) {
    const mapping: Mapping = {};
    mapping[PowerValue.On] = '1';
    mapping[PowerValue.Off] = '0';
    const classConfig = merge({mapping}, config);
    super(classConfig);
  }
}
